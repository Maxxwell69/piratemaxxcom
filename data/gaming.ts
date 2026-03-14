export interface FeaturedGame {
  id: string;
  name: string;
  description: string;
  platform?: string;
  /** Official site, store page, or info link. */
  url?: string;
}

export interface GamingProject {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'upcoming' | 'past';
}

export const featuredGames: FeaturedGame[] = [
  {
    id: '1',
    name: 'Rust',
    description: 'Survival, base building, and community servers.',
    platform: 'PC',
    url: 'https://store.steampowered.com/app/252490/Rust/',
  },
  {
    id: '2',
    name: 'Sea of Thieves',
    description: 'Pirate adventure and crew gameplay.',
    platform: 'PC / Xbox',
    url: 'https://www.seaofthieves.com/',
  },
  {
    id: '3',
    name: 'Valheim',
    description: 'Viking survival and exploration.',
    platform: 'PC',
    url: 'https://store.steampowered.com/app/892970/Valheim/',
  },
  {
    id: '4',
    name: 'Variety',
    description: 'Other games and new releases as they land.',
    platform: 'PC',
  },
];

export const gamingProjects: GamingProject[] = [
  { id: '1', title: 'Community Server', description: 'Dedicated community server with custom branding and events.', status: 'active' },
  { id: '2', title: 'Stream Schedule', description: 'Regular streaming with focus on survival and multiplayer.', status: 'active' },
  { id: '3', title: 'Creator Brand Expansion', description: 'Expanding into more platforms and content formats.', status: 'upcoming' },
];

export const gamingMissionCopy = {
  headline: 'Gaming at the Helm',
  body: 'Pirate Maxx builds and streams from the intersection of gaming and creation. Whether it’s running a server, branding a community, or going live—gaming is the core. This page is your hub for what’s being played, what’s being built, and where to watch.',
};

export const streamPlatformsCopy = {
  headline: 'Where to Watch',
  body: 'Catch streams and content across these platforms. Schedules and highlights are updated regularly.',
};
