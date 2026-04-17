'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CommunitySignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/community/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Sign-up failed');
        return;
      }
      router.push('/community/profile');
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-pirate-black py-12">
      <div className="w-full max-w-md rounded-lg border border-pirate-steel bg-pirate-charcoal p-8">
        <h1 className="font-display text-2xl font-bold text-white">Join the crew</h1>
        <p className="mt-2 text-sm text-gray-400">
          Create a community profile. New accounts start as a <strong className="text-gray-200">fan</strong>. Super
          fan and mod roles are assigned by the captain after you sign up.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="displayName" className="block text-sm text-gray-300">
              Display name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-3 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
              autoComplete="nickname"
              required
              maxLength={80}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-3 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
              autoComplete="email"
              required
            />
          </div>
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
              autoComplete="new-password"
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-gray-500">At least 8 characters.</p>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-pirate-crimson py-3 font-medium text-white hover:bg-pirate-red disabled:opacity-60"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have a profile?{' '}
          <Link href="/community/login" className="text-pirate-gold hover:underline">
            Log in
          </Link>
        </p>
        <Link href="/" className="mt-4 block text-center text-sm text-gray-500 hover:text-pirate-gold">
          ← Back to site
        </Link>
      </div>
    </div>
  );
}
