'use client';

import Image, { ImageProps } from 'next/image';
import { getCdnUrl } from '@/lib/cdn';

type CdnImageProps = Omit<ImageProps, 'src'> & {
  /** Path relative to CDN root or /public (e.g. "images/logo.png" or "logo.png") */
  src: string;
};

/**
 * Next.js Image that uses the CDN when NEXT_PUBLIC_CDN_URL is set.
 * Use for logos, portfolio images, and any asset you want to serve from a CDN.
 */
export function CdnImage({ src, alt, ...rest }: CdnImageProps) {
  const url = getCdnUrl(src);
  return <Image src={url} alt={alt} {...rest} />;
}
