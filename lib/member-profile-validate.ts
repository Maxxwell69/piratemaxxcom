const DISPLAY_MAX = 80;
const BIO_MAX = 500;
const URL_MAX = 2048;

export function parseDisplayName(raw: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof raw !== 'string') return { ok: false, error: 'Display name is required' };
  const t = raw.trim();
  if (t.length < 1 || t.length > DISPLAY_MAX) {
    return { ok: false, error: `Display name must be 1–${DISPLAY_MAX} characters` };
  }
  return { ok: true, value: t };
}

export function parseBio(raw: unknown): { ok: true; value: string | undefined } | { ok: false; error: string } {
  if (raw === undefined || raw === null || raw === '') return { ok: true, value: undefined };
  if (typeof raw !== 'string') return { ok: false, error: 'Invalid bio' };
  const t = raw.trim();
  if (t.length > BIO_MAX) return { ok: false, error: `Bio must be at most ${BIO_MAX} characters` };
  return { ok: true, value: t || undefined };
}

export function parseAvatarUrl(
  raw: unknown
): { ok: true; value: string | undefined } | { ok: false; error: string } {
  if (raw === undefined || raw === null || raw === '') return { ok: true, value: undefined };
  if (typeof raw !== 'string') return { ok: false, error: 'Invalid image URL' };
  const t = raw.trim();
  if (!t) return { ok: true, value: undefined };
  if (t.length > URL_MAX) return { ok: false, error: 'Image URL is too long' };
  try {
    const u = new URL(t);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') {
      return { ok: false, error: 'Image URL must start with http:// or https://' };
    }
    return { ok: true, value: t };
  } catch {
    return { ok: false, error: 'Invalid image URL' };
  }
}
