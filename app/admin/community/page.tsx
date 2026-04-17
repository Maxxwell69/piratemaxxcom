'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import type { CommunityPermission } from '@/lib/community-permission';

type MemberRow = {
  id: string;
  email: string;
  displayName: string;
  permission: CommunityPermission;
  createdAt: string;
  avatarUrl?: string;
};

const roles: { value: CommunityPermission; label: string }[] = [
  { value: 'fan', label: 'Fan' },
  { value: 'super_fan', label: 'Super fan' },
  { value: 'mod', label: 'Mod' },
];

export default function AdminCommunityPage() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError('');
    try {
      const res = await fetch('/api/admin/community/members', { credentials: 'same-origin' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not load members');
        setMembers([]);
        return;
      }
      const list = Array.isArray(data.members) ? data.members : [];
      setMembers(list as MemberRow[]);
    } catch {
      setError('Network error');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changeRole(id: string, permission: CommunityPermission) {
    setMessage('');
    setSavingId(id);
    try {
      const res = await fetch('/api/admin/community/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id, permission }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Update failed');
        await load();
        return;
      }
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, permission: data.permission ?? permission } : m))
      );
      setMessage('Role updated.');
      setTimeout(() => setMessage(''), 3000);
    } catch {
      setError('Network error');
      await load();
    } finally {
      setSavingId(null);
    }
  }

  const q = filter.trim().toLowerCase();
  const filtered = q
    ? members.filter(
        (m) =>
          m.email.toLowerCase().includes(q) ||
          m.displayName.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      )
    : members;

  return (
    <div className="min-h-screen bg-pirate-black px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <AdminNav />
        <h1 className="font-display text-2xl font-bold text-white">Community members</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">
          Everyone who signed up on the site. Change roles from the dropdown; the member&apos;s session updates on
          their next navigation.
        </p>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, email, or id…"
            className="w-full max-w-md rounded-md border border-pirate-steel bg-pirate-charcoal px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold sm:w-auto"
          />
          <button
            type="button"
            onClick={() => load()}
            className="rounded-md border border-pirate-steel px-4 py-2 text-sm text-gray-300 hover:border-pirate-gold hover:text-white"
          >
            Refresh list
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
        {message && <p className="mt-4 text-sm text-green-400/90">{message}</p>}

        <div className="mt-8 overflow-x-auto rounded-lg border border-pirate-steel bg-pirate-charcoal">
          {loading ? (
            <p className="p-8 text-sm text-gray-500">Loading members…</p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-sm text-gray-500">
              {members.length === 0 ? 'No community members yet.' : 'No matches for this filter.'}
            </p>
          ) : (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-pirate-steel text-gray-500">
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Public</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-pirate-steel/80 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-pirate-steel bg-pirate-black">
                          {m.avatarUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.avatarUrl} alt="" className="h-10 w-10 object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-pirate-gold">
                              {m.displayName.slice(0, 1).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white">{m.displayName}</div>
                          <div className="truncate font-mono text-xs text-gray-600" title={m.id}>
                            {m.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-gray-300" title={m.email}>
                      {m.email}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={m.permission}
                        disabled={savingId === m.id}
                        onChange={(e) => changeRole(m.id, e.target.value as CommunityPermission)}
                        className="rounded-md border border-pirate-steel bg-pirate-black px-2 py-1.5 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold disabled:opacity-50"
                      >
                        {roles.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-400">
                      {new Date(m.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/community/fans/${m.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pirate-gold hover:underline"
                      >
                        Fan page
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <Link href="/admin" className="mt-10 inline-block text-sm text-gray-400 hover:text-pirate-gold">
          ← Admin home
        </Link>
      </div>
    </div>
  );
}
