import type { PlatformLink } from '@/data/links';

interface StreamLinkCardProps {
  link: PlatformLink;
  size?: 'default' | 'large';
}

export function StreamLinkCard({ link, size = 'default' }: StreamLinkCardProps) {
  const isLarge = size === 'large';
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex items-center gap-4 rounded-lg border border-pirate-steel bg-pirate-charcoal p-4 transition hover:border-pirate-gold/50 hover:shadow-glow-gold sm:p-6 ${
        isLarge ? 'sm:p-8' : ''
      }`}
    >
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-pirate-steel text-xl group-hover:bg-pirate-crimson/30 transition ${
          isLarge ? 'h-14 w-14 text-2xl' : ''
        }`}
        aria-hidden
      >
        {link.icon || '🔗'}
      </span>
      <div className="min-w-0 flex-1">
        <span className={`font-semibold text-white group-hover:text-pirate-gold transition ${isLarge ? 'text-lg' : ''}`}>
          {link.name}
        </span>
        {link.description && (
          <p className="text-sm text-gray-400">{link.description}</p>
        )}
      </div>
      <span className="shrink-0 text-pirate-gold opacity-0 transition group-hover:opacity-100">→</span>
    </a>
  );
}
