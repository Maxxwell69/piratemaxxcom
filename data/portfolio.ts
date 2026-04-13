export type PortfolioCategory = 'websites' | 'graphics' | 'badges' | 'stream-branding' | 'gaming-projects';

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  /** Shown when no imageUrl (seed items / fallback). */
  imagePlaceholder?: string;
  /** Public image URL (e.g. Vercel Blob or CDN). */
  imageUrl?: string;
  /** Video archive: YouTube/Vimeo link, direct .mp4/.webm URL, or uploaded file URL. */
  videoUrl?: string;
  link?: string;
  tags?: string[];
}

export const portfolioCategories: { id: PortfolioCategory; label: string }[] = [
  { id: 'websites', label: 'Websites' },
  { id: 'graphics', label: 'Graphics' },
  { id: 'badges', label: 'Badges' },
  { id: 'stream-branding', label: 'Stream Branding' },
  { id: 'gaming-projects', label: 'Gaming Projects' },
];

export const portfolioItems: PortfolioItem[] = [];
