'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Re-signs the member JWT from server storage on every route change and full reload,
 * so role / display name changes apply without a manual “sync” action.
 */
export function MemberSessionSync() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meRes = await fetch('/api/community/me', { credentials: 'same-origin' });
      const meJson = await meRes.json().catch(() => ({}));
      if (cancelled || !meJson?.member) return;

      const res = await fetch('/api/community/refresh', {
        method: 'POST',
        credentials: 'same-origin',
      });
      if (cancelled || !res.ok) return;
      router.refresh();
    })();
    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
}
