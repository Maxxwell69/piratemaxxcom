export interface PlatformLink {
  id: string;
  name: string;
  href: string;
  description?: string;
  icon?: string;
}

export const platformLinks: PlatformLink[] = [
  { id: 'tiktok', name: 'TikTok', href: 'https://www.tiktok.com/@thepiratemaxx', description: 'Short-form content' },
  { id: 'twitch', name: 'Twitch', href: 'https://www.twitch.tv/thepiratemaxx', description: 'Live streams' },
];

export const internalLinks = [
  { id: 'contact', name: 'Contact Pirate Maxx', href: '/contact' },
  { id: 'services', name: 'Services', href: '/services' },
];
