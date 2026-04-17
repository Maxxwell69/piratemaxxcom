'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileActions() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<'refresh' | 'logout' | null>(null);

  async function refreshSession() {
    setMessage(null);
    setBusy('refresh');
    try {
      const res = await fetch('/api/community/refresh', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(typeof data.error === 'string' ? data.error : 'Could not refresh');
        return;
      }
      setMessage('Session updated. Mod tools use the latest role from the server.');
      router.refresh();
    } catch {
      setMessage('Network error');
    } finally {
      setBusy(null);
    }
  }

  async function logout() {
    setMessage(null);
    setBusy('logout');
    try {
      await fetch('/api/community/logout', { method: 'POST' });
      router.push('/community/login');
      router.refresh();
    } catch {
      setMessage('Network error');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={refreshSession}
        disabled={busy !== null}
        className="rounded-md border border-pirate-gold/50 bg-pirate-black px-4 py-2 text-sm font-medium text-pirate-gold hover:bg-pirate-steel disabled:opacity-50"
      >
        {busy === 'refresh' ? 'Syncing…' : 'Sync permissions'}
      </button>
      <button
        type="button"
        onClick={logout}
        disabled={busy !== null}
        className="rounded-md border border-pirate-steel px-4 py-2 text-sm text-gray-300 hover:border-pirate-slate hover:text-white disabled:opacity-50"
      >
        {busy === 'logout' ? 'Signing out…' : 'Log out'}
      </button>
      {message && <p className="w-full text-sm text-gray-400">{message}</p>}
    </div>
  );
}
