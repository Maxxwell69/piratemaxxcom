'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { platformLinks } from '@/data/links';

const tiktokUrl = platformLinks.find((p) => p.id === 'tiktok')?.href ?? 'https://www.tiktok.com/@thepiratemaxx';

interface LiveBadgeProps {
  /** Compact style for navbar; default is larger for hero */
  variant?: 'default' | 'compact';
  className?: string;
}

export function LiveBadge({ variant = 'default', className = '' }: LiveBadgeProps) {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/live')
      .then((res) => res.json())
      .then((data) => setIsLive(data.tiktokLive === true))
      .catch(() => setIsLive(false));
  }, []);

  if (isLive !== true) return null;

  const isCompact = variant === 'compact';

  return (
    <Link
      href={tiktokUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center gap-1.5 rounded-full font-semibold text-white
        bg-red-600 hover:bg-red-500 transition shadow-lg
        ${isCompact ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'}
        ${className}
      `}
      aria-label="Watch live on TikTok"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
      </span>
      LIVE on TikTok
    </Link>
  );
}
