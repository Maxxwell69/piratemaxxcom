'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileLogout() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    try {
      await fetch('/api/community/logout', { method: 'POST' });
      router.push('/community/login');
      router.refresh();
    } catch {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8 border-t border-pirate-steel pt-6">
      <button
        type="button"
        onClick={logout}
        disabled={busy}
        className="rounded-md border border-pirate-steel px-4 py-2 text-sm text-gray-300 hover:border-pirate-slate hover:text-white disabled:opacity-50"
      >
        {busy ? 'Signing out…' : 'Log out'}
      </button>
    </div>
  );
}
