/* eslint-disable @next/next/no-img-element -- arbitrary remote URLs (Blob, CDNs); next/image optimizer is not used. */
/**
 * Portfolio covers use arbitrary HTTPS URLs (Vercel Blob, CDNs, pasted links).
 * Plain <img> avoids Next.js image optimizer / remotePatterns quirks in production.
 */
type PortfolioCoverImageProps = {
  src: string;
  alt: string;
  className?: string;
  /** When true, load eagerly (e.g. project detail hero). */
  priority?: boolean;
};

export function PortfolioCoverImage({ src, alt, className, priority }: PortfolioCoverImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
    />
  );
}
