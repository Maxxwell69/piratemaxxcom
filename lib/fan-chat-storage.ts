import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Redis } from '@upstash/redis';

const ROOM = 'fan-lounge';
const REDIS_KEY = `community:chat:${ROOM}_v1`;
const USER_FILE = path.join(process.cwd(), 'data', 'community-chat.json');
const MAX_MESSAGES = 250;
const MAX_BODY = 500;

export interface FanChatMessage {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorAvatarUrl?: string;
  body: string;
  createdAt: string;
}

function normalizeEnvValue(value: string | undefined): string | undefined {
  if (!value) return undefined;
  let v = value.trim();
  while (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v || undefined;
}

function redis(): Redis | null {
  const url = normalizeEnvValue(process.env.UPSTASH_REDIS_REST_URL);
  const token = normalizeEnvValue(process.env.UPSTASH_REDIS_REST_TOKEN);
  if (!url || !token) return null;
  if (!url.startsWith('https://')) return null;
  return new Redis({ url, token });
}

function parseMessages(data: unknown): FanChatMessage[] {
  if (!data) return [];
  let raw: unknown = data;
  if (typeof data === 'string') {
    try {
      raw = JSON.parse(data) as unknown;
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  const out: FanChatMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const o = item as Record<string, unknown>;
    if (
      typeof o.id === 'string' &&
      typeof o.authorId === 'string' &&
      typeof o.authorDisplayName === 'string' &&
      typeof o.body === 'string' &&
      typeof o.createdAt === 'string'
    ) {
      out.push({
        id: o.id,
        authorId: o.authorId,
        authorDisplayName: o.authorDisplayName,
        authorAvatarUrl: typeof o.authorAvatarUrl === 'string' ? o.authorAvatarUrl : undefined,
        body: o.body,
        createdAt: o.createdAt,
      });
    }
  }
  return out;
}

async function readFromFile(): Promise<FanChatMessage[]> {
  if (process.env.NODE_ENV !== 'development') return [];
  try {
    const text = await fs.readFile(USER_FILE, 'utf8');
    const parsed = JSON.parse(text) as unknown;
    if (typeof parsed !== 'object' || parsed === null) return [];
    const rooms = (parsed as { rooms?: unknown }).rooms;
    if (typeof rooms !== 'object' || rooms === null) return [];
    const list = (rooms as Record<string, unknown>)[ROOM];
    return parseMessages(list);
  } catch {
    return [];
  }
}

async function writeToFile(messages: FanChatMessage[]): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('File chat storage is only available in local development.');
  }
  const payload = { rooms: { [ROOM]: messages } };
  await fs.writeFile(USER_FILE, JSON.stringify(payload, null, 2), 'utf8');
}

export function fanChatStorageConfigured(): boolean {
  return Boolean(redis()) || process.env.NODE_ENV === 'development';
}

export async function getFanLoungeMessages(): Promise<FanChatMessage[]> {
  const r = redis();
  if (r) {
    const data = await r.get(REDIS_KEY);
    return parseMessages(data);
  }
  return readFromFile();
}

async function setFanLoungeMessages(messages: FanChatMessage[]): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(REDIS_KEY, JSON.stringify(messages));
    return;
  }
  await writeToFile(messages);
}

export function sanitizeChatBody(raw: string): string {
  return raw.trim().replace(/\s+/g, ' ').slice(0, MAX_BODY);
}

export async function appendFanLoungeMessage(input: {
  authorId: string;
  authorDisplayName: string;
  authorAvatarUrl?: string;
  body: string;
}): Promise<FanChatMessage | { error: string }> {
  const body = sanitizeChatBody(input.body);
  if (body.length < 1) return { error: 'Message cannot be empty' };

  const msg: FanChatMessage = {
    id: randomUUID(),
    authorId: input.authorId,
    authorDisplayName: input.authorDisplayName.trim().slice(0, 80) || 'Crew member',
    authorAvatarUrl: input.authorAvatarUrl?.trim(),
    body,
    createdAt: new Date().toISOString(),
  };

  const list = await getFanLoungeMessages();
  list.push(msg);
  const trimmed = list.slice(-MAX_MESSAGES);
  await setFanLoungeMessages(trimmed);
  return msg;
}
