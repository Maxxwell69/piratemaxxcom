import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://piratemaxx.com';

export function buildMetadata({
  title,
  description,
  path = '',
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const url = path ? `${siteUrl}${path}` : siteUrl;
  return {
    title: title === 'Pirate Maxx' ? title : `${title} | Pirate Maxx`,
    description,
    openGraph: {
      title: title === 'Pirate Maxx' ? title : `${title} | Pirate Maxx`,
      description,
      url,
      siteName: 'Pirate Maxx',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: title === 'Pirate Maxx' ? title : `${title} | Pirate Maxx`,
      description,
    },
  };
}
