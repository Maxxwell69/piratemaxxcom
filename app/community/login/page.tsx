'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/community/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/community/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Login failed');
        return;
      }
      const dest = nextPath.startsWith('/') && !nextPath.startsWith('//') ? nextPath : '/community/profile';
      router.push(dest);
      router.refresh();
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-lg border border-pirate-steel bg-pirate-charcoal p-8">
      <h1 className="font-display text-2xl font-bold text-white">Community log in</h1>
      <p className="mt-2 text-sm text-gray-400">Use the email and password from your crew profile.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
      <p className="mt-6 text-center text-sm text-gray-400">
        Need an account?{' '}
        <Link href="/community/signup" className="text-pirate-gold hover:underline">
          Sign up
        </Link>
      </p>
      <Link href="/" className="mt-4 block text-center text-sm text-gray-500 hover:text-pirate-gold">
        ← Back to site
      </Link>
    </div>
  );
}

export default function CommunityLoginPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-pirate-black py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md rounded-lg border border-pirate-steel bg-pirate-charcoal p-8 text-gray-400">
            Loading…
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
