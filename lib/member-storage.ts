import { promises as fs } from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import type { CommunityPermission } from '@/lib/community-permission';
import type { MemberSocials } from '@/lib/member-socials';
import { sanitizeSocials } from '@/lib/member-socials';

const REDIS_KEY = 'community:members_v1';
const USER_FILE = path.join(process.cwd(), 'data', 'community-members.json');

export interface CommunityMemberRecord {
  id: string;
  /** Normalized email (lowercase, trimmed). */
  email: string;
  displayName: string;
  passwordHash: string;
  permission: CommunityPermission;
  createdAt: string;
  /** Profile image URL (https recommended). */
  avatarUrl?: string;
  /** Short fan / crew blurb. */
  bio?: string;
  socials?: MemberSocials;
}

export type CommunityMemberPublic = Omit<CommunityMemberRecord, 'passwordHash'>;

export function toPublicMember(m: CommunityMemberRecord): CommunityMemberPublic {
  const { passwordHash: _, ...rest } = m;
  return rest;
}

function normalizeMember(m: CommunityMemberRecord): CommunityMemberRecord {
  return {
    ...m,
    socials: m.socials && typeof m.socials === 'object' ? sanitizeSocials(m.socials) : {},
  };
}

interface MemberStore {
  members: CommunityMemberRecord[];
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
  if (!url.startsWith('https://')) {
    console.error('UPSTASH_REDIS_REST_URL must start with https://');
    return null;
  }
  return new Redis({ url, token });
}

function emptyStore(): MemberStore {
  return { members: [] };
}

function parseStore(data: unknown): MemberStore {
  if (!data) return emptyStore();
  let raw: unknown = data;
  if (typeof data === 'string') {
    try {
      raw = JSON.parse(data) as unknown;
    } catch {
      return emptyStore();
    }
  }
  if (typeof raw !== 'object' || raw === null) return emptyStore();
  const m = (raw as { members?: unknown }).members;
  if (!Array.isArray(m)) return emptyStore();
  return { members: m as CommunityMemberRecord[] };
}

async function readFromFile(): Promise<MemberStore> {
  if (process.env.NODE_ENV !== 'development') return emptyStore();
  try {
    const text = await fs.readFile(USER_FILE, 'utf8');
    return parseStore(JSON.parse(text) as unknown);
  } catch {
    return emptyStore();
  }
}

async function writeToFile(store: MemberStore): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('File storage is only available in local development.');
  }
  await fs.writeFile(USER_FILE, JSON.stringify(store, null, 2), 'utf8');
}

export function memberStorageConfigured(): boolean {
  return Boolean(redis()) || process.env.NODE_ENV === 'development';
}

export async function getMemberStore(): Promise<MemberStore> {
  const r = redis();
  if (r) {
    const data = await r.get(REDIS_KEY);
    return parseStore(data);
  }
  return readFromFile();
}

export async function setMemberStore(store: MemberStore): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(REDIS_KEY, JSON.stringify(store));
    return;
  }
  await writeToFile(store);
}

export async function findMemberByEmail(email: string): Promise<CommunityMemberRecord | null> {
  const normalized = email.trim().toLowerCase();
  const { members } = await getMemberStore();
  const m = members.find((x) => x.email === normalized) ?? null;
  return m ? normalizeMember(m) : null;
}

export async function findMemberById(id: string): Promise<CommunityMemberRecord | null> {
  const { members } = await getMemberStore();
  const m = members.find((x) => x.id === id) ?? null;
  return m ? normalizeMember(m) : null;
}

export async function addMember(record: CommunityMemberRecord): Promise<void> {
  const store = await getMemberStore();
  if (store.members.some((m) => m.email === record.email)) {
    throw new Error('Email already registered');
  }
  store.members.push(record);
  await setMemberStore(store);
}

export async function updateMemberPermission(
  email: string,
  permission: CommunityPermission
): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const store = await getMemberStore();
  const idx = store.members.findIndex((m) => m.email === normalized);
  if (idx === -1) return false;
  store.members[idx] = { ...store.members[idx], permission };
  await setMemberStore(store);
  return true;
}

export async function updateMemberPermissionById(
  id: string,
  permission: CommunityPermission
): Promise<boolean> {
  const store = await getMemberStore();
  const idx = store.members.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  store.members[idx] = { ...store.members[idx], permission };
  await setMemberStore(store);
  return true;
}

/** All members for admin (no password). Sorted newest first. */
export async function listMembersForAdmin(): Promise<CommunityMemberPublic[]> {
  const { members } = await getMemberStore();
  const rows = members.map((raw) => toPublicMember(normalizeMember(raw)));
  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : a.createdAt > b.createdAt ? -1 : 0));
}

export interface FanDirectoryEntry {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bioPreview?: string;
}

/** Public fan cards for /community/fans (no email). */
export async function listFanDirectoryEntries(): Promise<FanDirectoryEntry[]> {
  const { members } = await getMemberStore();
  return members
    .map((raw) => normalizeMember(raw))
    .map((m) => ({
      id: m.id,
      displayName: m.displayName,
      avatarUrl: m.avatarUrl,
      bioPreview:
        m.bio && m.bio.length > 140 ? `${m.bio.slice(0, 137)}…` : m.bio,
    }))
    .sort((a, b) => a.displayName.localeCompare(b.displayName, undefined, { sensitivity: 'base' }));
}

/** Public profile fields for a fan page (no email). */
export interface FanPublicProfile {
  id: string;
  displayName: string;
  permission: CommunityPermission;
  createdAt: string;
  avatarUrl?: string;
  bio?: string;
  socials?: MemberSocials;
}

export function toFanPublicProfile(m: CommunityMemberRecord): FanPublicProfile {
  const n = normalizeMember(m);
  return {
    id: n.id,
    displayName: n.displayName,
    permission: n.permission,
    createdAt: n.createdAt,
    avatarUrl: n.avatarUrl,
    bio: n.bio,
    socials: n.socials,
  };
}

export interface MemberProfileUpdates {
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  socials?: MemberSocials;
}

export async function updateMemberProfile(id: string, updates: MemberProfileUpdates): Promise<boolean> {
  const store = await getMemberStore();
  const idx = store.members.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  const cur = store.members[idx];
  const next: CommunityMemberRecord = { ...cur };

  if (updates.displayName !== undefined) {
    next.displayName = updates.displayName.trim();
  }
  if (updates.avatarUrl !== undefined) {
    if (updates.avatarUrl === null || updates.avatarUrl === '') {
      delete next.avatarUrl;
    } else {
      next.avatarUrl = updates.avatarUrl.trim();
    }
  }
  if (updates.bio !== undefined) {
    if (updates.bio === null || updates.bio === '') {
      delete next.bio;
    } else {
      next.bio = updates.bio.trim();
    }
  }
  if (updates.socials !== undefined) {
    next.socials = sanitizeSocials(updates.socials);
  }

  store.members[idx] = next;
  await setMemberStore(store);
  return true;
}
