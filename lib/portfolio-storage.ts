import { promises as fs } from 'fs';
import path from 'path';
import { Redis } from '@upstash/redis';
import type { PortfolioItem } from '@/data/portfolio';

const REDIS_KEY = 'portfolio:user_items';
const USER_FILE = path.join(process.cwd(), 'data', 'portfolio-user.json');

/** Vercel/env UIs sometimes save values with wrapping quotes — strip them. */
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

async function readFromFile(): Promise<PortfolioItem[]> {
  if (process.env.NODE_ENV !== 'development') return [];
  try {
    const raw = await fs.readFile(USER_FILE, 'utf8');
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed as PortfolioItem[];
  } catch {
    return [];
  }
}

async function writeToFile(items: PortfolioItem[]): Promise<void> {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('File storage is only available in local development.');
  }
  await fs.writeFile(USER_FILE, JSON.stringify(items, null, 2), 'utf8');
}

export function portfolioStorageConfigured(): boolean {
  return Boolean(redis()) || process.env.NODE_ENV === 'development';
}

function parseStoredPortfolioItems(data: unknown): PortfolioItem[] {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data as PortfolioItem[];
  }
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data) as unknown;
      return Array.isArray(parsed) ? (parsed as PortfolioItem[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

export async function getUserPortfolioItems(): Promise<PortfolioItem[]> {
  const r = redis();
  if (r) {
    const data = await r.get(REDIS_KEY);
    return parseStoredPortfolioItems(data);
  }
  return readFromFile();
}

export async function setUserPortfolioItems(items: PortfolioItem[]): Promise<void> {
  const r = redis();
  if (r) {
    await r.set(REDIS_KEY, JSON.stringify(items));
    return;
  }
  await writeToFile(items);
}

export async function appendUserPortfolioItem(item: PortfolioItem): Promise<void> {
  const items = await getUserPortfolioItems();
  items.push(item);
  await setUserPortfolioItems(items);
}

export async function removeUserPortfolioItem(id: string): Promise<boolean> {
  const items = await getUserPortfolioItems();
  const next = items.filter((i) => i.id !== id);
  if (next.length === items.length) return false;
  await setUserPortfolioItems(next);
  return true;
}

/** Replace an existing user-saved item by id. Returns false if not found. */
export async function updateUserPortfolioItem(id: string, nextItem: PortfolioItem): Promise<boolean> {
  const items = await getUserPortfolioItems();
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return false;
  items[idx] = nextItem;
  await setUserPortfolioItems(items);
  return true;
}
