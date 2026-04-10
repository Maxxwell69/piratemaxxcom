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

export const portfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Creator Brand Website',
    category: 'websites',
    description: 'Full-site design for a Twitch creator with stream links, schedule, and contact.',
    imagePlaceholder: 'Website mockup',
    link: '#',
    tags: ['Next.js', 'Tailwind', 'Streamer'],
  },
  {
    id: '2',
    title: 'Gaming Community Landing',
    category: 'websites',
    description: 'Landing page for a gaming community with Discord CTA and event highlights.',
    imagePlaceholder: 'Landing page',
    link: '#',
    tags: ['Landing', 'Gaming'],
  },
  {
    id: '3',
    title: 'Stream Overlay Pack',
    category: 'stream-branding',
    description: 'Custom overlay set including webcam frame, lower thirds, and scene transitions.',
    imagePlaceholder: 'Overlay preview',
    link: '#',
    tags: ['Overlays', 'OBS'],
  },
  {
    id: '4',
    title: 'Server Badge Set',
    category: 'badges',
    description: 'Role and rank badges for a game server with consistent nautical theme.',
    imagePlaceholder: 'Badge set',
    link: '#',
    tags: ['Badges', 'Discord'],
  },
  {
    id: '5',
    title: 'Channel Art Bundle',
    category: 'graphics',
    description: 'Twitch panels, banner, and offline screen for a variety streamer.',
    imagePlaceholder: 'Channel art',
    link: '#',
    tags: ['Twitch', 'Panels'],
  },
  {
    id: '6',
    title: 'Guild Insignia & Logo',
    category: 'badges',
    description: 'Logo and insignia for a gaming guild used across Discord and in-game.',
    imagePlaceholder: 'Logo and insignia',
    link: '#',
    tags: ['Logo', 'Branding'],
  },
  {
    id: '7',
    title: 'Thumbnail Template Pack',
    category: 'graphics',
    description: 'Reusable YouTube thumbnail templates with strong text and brand colors.',
    imagePlaceholder: 'Thumbnails',
    link: '#',
    tags: ['YouTube', 'Templates'],
  },
  {
    id: '8',
    title: 'Tournament Branding',
    category: 'gaming-projects',
    description: 'Graphics and branding for a community-run gaming tournament.',
    imagePlaceholder: 'Tournament assets',
    link: '#',
    tags: ['Events', 'Graphics'],
  },
];
