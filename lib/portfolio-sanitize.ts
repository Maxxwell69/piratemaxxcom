import type { PortfolioItem } from '@/data/portfolio';

/** Coerce and trim imageUrl from Redis/API so UI always gets a usable string. */
export function sanitizePortfolioItem(item: PortfolioItem): PortfolioItem {
  const raw = item.imageUrl;
  if (raw == null) return item;
  const s = typeof raw === 'string' ? raw.trim() : String(raw).trim();
  if (!s) {
    const next = { ...item };
    delete next.imageUrl;
    return next;
  }
  if (s === item.imageUrl) return item;
  return { ...item, imageUrl: s };
}
