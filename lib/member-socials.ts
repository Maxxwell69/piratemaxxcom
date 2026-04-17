/** Optional links shown on community profiles (handles or full URLs). */
export interface MemberSocials {
  twitter?: string;
  twitch?: string;
  youtube?: string;
  discord?: string;
  instagram?: string;
  tiktok?: string;
  website?: string;
}

export const SOCIAL_FIELD_DEFS = [
  { key: 'twitter', label: 'X (Twitter)' },
  { key: 'twitch', label: 'Twitch' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'discord', label: 'Discord' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'website', label: 'Website' },
] as const satisfies ReadonlyArray<{ key: keyof MemberSocials; label: string }>;

const SOCIAL_KEYS = new Set<string>(SOCIAL_FIELD_DEFS.map((d) => d.key));

export function sanitizeSocials(input: unknown): MemberSocials {
  if (!input || typeof input !== 'object') return {};
  const out: MemberSocials = {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!SOCIAL_KEYS.has(k)) continue;
    if (typeof v !== 'string') continue;
    const t = v.trim();
    if (!t) continue;
    if (t.length > 300) continue;
    out[k as keyof MemberSocials] = t;
  }
  return out;
}
