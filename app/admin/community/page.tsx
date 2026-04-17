'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';

const roles = [
  { value: 'fan', label: 'Fan' },
  { value: 'super_fan', label: 'Super fan' },
  { value: 'mod', label: 'Mod' },
] as const;

export default function AdminCommunityPage() {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<(typeof roles)[number]['value']>('fan');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/community/role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, permission }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Update failed');
        return;
      }
      setMessage(
        `Updated ${email} → ${permission}. Their next page navigation or refresh updates the session automatically.`
      );
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-pirate-black px-4 py-10">
      <div className="mx-auto max-w-lg">
        <AdminNav />
        <h1 className="font-display text-2xl font-bold text-white">Community roles</h1>
        <p className="mt-2 text-sm text-gray-400">
          Change a member&apos;s permission after they sign up. Matches the email they used at registration (case
          insensitive).
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-lg border border-pirate-steel bg-pirate-charcoal p-6">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300">
              Member email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-3 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
              required
            />
          </div>
          <div>
            <label htmlFor="permission" className="block text-sm text-gray-300">
              Permission
            </label>
            <select
              id="permission"
              value={permission}
              onChange={(e) => setPermission(e.target.value as (typeof roles)[number]['value'])}
              className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-3 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-green-400/90">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-pirate-crimson py-3 font-medium text-white hover:bg-pirate-red disabled:opacity-60"
          >
            {loading ? 'Saving…' : 'Save role'}
          </button>
        </form>
        <Link href="/admin" className="mt-8 inline-block text-sm text-gray-400 hover:text-pirate-gold">
          ← Admin home
        </Link>
      </div>
    </div>
  );
}
