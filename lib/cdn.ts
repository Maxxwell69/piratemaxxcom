/**
 * CDN base URL for logos and images.
 * Set NEXT_PUBLIC_CDN_URL in .env to use a CDN (e.g. Cloudinary, your own domain).
 * If unset, URLs fall back to site-relative paths (served from /public).
 */
const CDN_BASE = process.env.NEXT_PUBLIC_CDN_URL?.replace(/\/$/, '') ?? '';

/**
 * Returns the full URL for an image path using the CDN when configured.
 * @param path - Path relative to CDN root (e.g. "images/logo.png") or leading slash "/images/logo.png"
 * @returns Full CDN URL if NEXT_PUBLIC_CDN_URL is set, otherwise path for local /public (e.g. "/images/logo.png")
 */
export function getCdnUrl(path: string): string {
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  if (!CDN_BASE) return `/${normalized}`;
  return `${CDN_BASE}/${normalized}`;
}

/**
 * Use in next/image src. Prefer getCdnUrl() for consistency.
 */
export function cdnImageSrc(path: string): string {
  return getCdnUrl(path);
}
