export interface PlatformLink {
  id: string;
  name: string;
  href: string;
  description?: string;
  icon?: string;
}

export const platformLinks: PlatformLink[] = [
  { id: 'tiktok', name: 'TikTok', href: 'https://tiktok.com/@piratemaxx', description: 'Short-form content' },
  { id: 'twitch', name: 'Twitch', href: 'https://twitch.tv/piratemaxx', description: 'Live streams' },
  { id: 'youtube', name: 'YouTube', href: 'https://youtube.com/@piratemaxx', description: 'Videos & streams' },
  { id: 'kick', name: 'Kick', href: 'https://kick.com/piratemaxx', description: 'Streaming' },
  { id: 'discord', name: 'Discord', href: 'https://discord.gg/piratemaxx', description: 'Community' },
  { id: 'instagram', name: 'Instagram', href: 'https://instagram.com/piratemaxx', description: 'Photos & reels' },
  { id: 'twitter', name: 'X / Twitter', href: 'https://twitter.com/piratemaxx', description: 'Updates & chat' },
];

export const internalLinks = [
  { id: 'contact', name: 'Contact Pirate Maxx', href: '/contact' },
  { id: 'services', name: 'Services', href: '/services' },
];
