'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type MeState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'member'; displayName: string; avatarUrl?: string };

export function CommunityNavAuth() {
  const pathname = usePathname();
  const [me, setMe] = useState<MeState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/community/me', { credentials: 'same-origin' });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        const m = data?.member;
        if (m && typeof m.displayName === 'string') {
          setMe({
            status: 'member',
            displayName: m.displayName,
            avatarUrl: typeof m.avatarUrl === 'string' ? m.avatarUrl : undefined,
          });
        } else {
          setMe({ status: 'guest' });
        }
      } catch {
        if (!cancelled) setMe({ status: 'guest' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  if (me.status === 'loading') {
    return <span className="text-xs text-gray-500 md:text-sm">…</span>;
  }

  if (me.status === 'member') {
    const src = me.avatarUrl?.trim();
    return (
      <Link
        href="/community/profile"
        className="flex max-w-[10rem] items-center gap-2 text-sm font-medium text-gray-300 transition hover:text-pirate-gold md:max-w-none"
        title="Community profile"
      >
        {src ? (
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-pirate-steel bg-pirate-black">
            {/* eslint-disable-next-line @next/next/no-img-element -- user-provided avatar URL */}
            <img src={src} alt="" className="h-8 w-8 object-cover" />
          </span>
        ) : (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-pirate-steel bg-pirate-black font-display text-xs text-pirate-gold">
            {me.displayName.slice(0, 1).toUpperCase()}
          </span>
        )}
        <span className="truncate">{me.displayName}</span>
      </Link>
    );
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <Link href="/community/login" className="font-medium text-gray-300 transition hover:text-pirate-gold">
        Log in
      </Link>
      <span className="text-gray-600" aria-hidden>
        |
      </span>
      <Link href="/community/signup" className="font-medium text-pirate-gold transition hover:underline">
        Join
      </Link>
    </span>
  );
}
