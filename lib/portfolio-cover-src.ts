import type { PortfolioItem } from '@/data/portfolio';

export function isExternalHttpUrl(link: string | undefined): boolean {
  if (!link || link === '#') return false;
  return /^https?:\/\//i.test(link.trim());
}

/**
 * When there is no uploaded cover, use the live site’s favicon so cards are not blank.
 * (Still add a real screenshot in admin for best results — a homepage URL is not an image file.)
 */
export function faviconFromProjectLink(link: string | undefined): string | null {
  if (!isExternalHttpUrl(link)) return null;
  try {
    const host = new URL(link!.trim()).hostname;
    if (!host) return null;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256`;
  } catch {
    return null;
  }
}

/** Cover image URL for cards and detail hero: explicit image, else favicon from project link. */
export function getPortfolioCoverSrc(item: PortfolioItem): string | null {
  const u = item.imageUrl?.trim();
  if (u) return u;
  return faviconFromProjectLink(item.link);
}

export function isFaviconCoverFallback(item: PortfolioItem): boolean {
  return !Boolean(item.imageUrl?.trim()) && Boolean(faviconFromProjectLink(item.link));
}
