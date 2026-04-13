'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Login failed');
        return;
      }
      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-pirate-black">
      <div className="w-full max-w-md rounded-lg border border-pirate-steel bg-pirate-charcoal p-8">
        <h1 className="font-display text-2xl font-bold text-white">Admin login</h1>
        <p className="mt-2 text-sm text-gray-400">
          Portfolio editor. Set <code className="text-pirate-gold">ADMIN_JWT_SECRET</code> and{' '}
          <code className="text-pirate-gold">ADMIN_PORTFOLIO_PASSWORD</code> in production.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-3 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
              autoComplete="current-password"
              required
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-pirate-crimson py-3 font-medium text-white hover:bg-pirate-red disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <Link href="/" className="mt-6 block text-center text-sm text-pirate-gold hover:underline">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
