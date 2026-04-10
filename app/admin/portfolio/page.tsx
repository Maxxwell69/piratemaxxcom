'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PortfolioItem, PortfolioCategory } from '@/data/portfolio';
import { portfolioCategories } from '@/data/portfolio';

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [userItems, setUserItems] = useState<PortfolioItem[]>([]);
  const [storageReady, setStorageReady] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioCategory>('websites');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imagePlaceholder, setImagePlaceholder] = useState('');
  const [tags, setTags] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/portfolio');
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      setUserItems(data.userItems ?? []);
      setStorageReady(data.storageReady !== false);
    } catch {
      setMessage('Could not load items.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          description,
          link: link || undefined,
          imagePlaceholder: imagePlaceholder || undefined,
          tags,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(typeof data.error === 'string' ? data.error : 'Save failed');
        return;
      }
      setTitle('');
      setDescription('');
      setLink('');
      setImagePlaceholder('');
      setTags('');
      setMessage('Added to portfolio.');
      await load();
    } catch {
      setMessage('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remove this item from the live portfolio?')) return;
    const res = await fetch(`/api/admin/portfolio?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setMessage('Removed.');
      await load();
    } else {
      setMessage('Could not delete.');
    }
  }

  return (
    <div className="min-h-screen bg-pirate-black px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold text-white">Portfolio admin</h1>
          <div className="flex gap-3">
            <Link href="/portfolio" className="text-sm text-pirate-gold hover:underline">
              View public portfolio
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-white"
            >
              Log out
            </button>
          </div>
        </div>

        {!storageReady && (
          <div className="mt-4 rounded-md border border-amber-500/50 bg-amber-950/40 px-4 py-3 text-sm text-amber-200">
            Storage is not configured for production. Add{' '}
            <code className="text-amber-100">UPSTASH_REDIS_REST_URL</code> and{' '}
            <code className="text-amber-100">UPSTASH_REDIS_REST_TOKEN</code> in Vercel. Local dev can
            save to <code className="text-amber-100">data/portfolio-user.json</code> without Redis.
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-gray-400">Loading…</p>
        ) : (
          <>
            <section className="mt-8 rounded-lg border border-pirate-steel bg-pirate-charcoal p-6">
              <h2 className="font-semibold text-white">Add project</h2>
              <p className="mt-1 text-sm text-gray-400">
                Items you add appear on the site after the built-in seed projects from{' '}
                <code className="text-xs text-gray-500">data/portfolio.ts</code>.
              </p>
              <form onSubmit={handleAdd} className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm text-gray-300">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as PortfolioCategory)}
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  >
                    {portfolioCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={4}
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Link (optional)</label>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Image label (optional)</label>
                  <input
                    value={imagePlaceholder}
                    onChange={(e) => setImagePlaceholder(e.target.value)}
                    placeholder="Short label for card placeholder"
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">Tags (comma-separated)</label>
                  <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Next.js, Branding"
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  />
                </div>
                {message && <p className="text-sm text-pirate-gold">{message}</p>}
                <button
                  type="submit"
                  disabled={saving || !storageReady}
                  className="rounded-md bg-pirate-crimson px-6 py-2 font-medium text-white hover:bg-pirate-red disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Add to portfolio'}
                </button>
              </form>
            </section>

            <section className="mt-10">
              <h2 className="font-semibold text-white">Your added items ({userItems.length})</h2>
              <p className="text-sm text-gray-400">Seed items from the codebase are not listed here.</p>
              <ul className="mt-4 space-y-3">
                {userItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-pirate-steel bg-pirate-charcoal px-4 py-3"
                  >
                    <div>
                      <span className="font-medium text-white">{item.title}</span>
                      <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {userItems.length === 0 && (
                  <li className="text-sm text-gray-500">No admin-added items yet.</li>
                )}
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
