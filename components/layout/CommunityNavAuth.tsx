'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type MeState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'member'; displayName: string };

export function CommunityNavAuth() {
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
          setMe({ status: 'member', displayName: m.displayName });
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
  }, []);

  if (me.status === 'loading') {
    return <span className="text-xs text-gray-500 md:text-sm">…</span>;
  }

  if (me.status === 'member') {
    return (
      <Link
        href="/community/profile"
        className="text-sm font-medium text-gray-300 transition hover:text-pirate-gold"
        title="Community profile"
      >
        {me.displayName}
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
