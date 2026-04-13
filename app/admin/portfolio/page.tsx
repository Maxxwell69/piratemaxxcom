'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { PortfolioCoverImage } from '@/components/portfolio/PortfolioCoverImage';
import { useRouter } from 'next/navigation';
import { upload } from '@vercel/blob/client';
import type { PortfolioItem, PortfolioCategory } from '@/data/portfolio';
import { portfolioCategories } from '@/data/portfolio';
import { AdminNav } from '@/components/admin/AdminNav';

function safeFilename(name: string) {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
  return base || 'file';
}

const SERVER_PUT_MAX = 4 * 1024 * 1024;

/**
 * Prefer same-origin server upload (avoids browser CORS to vercel.com from www.piratemaxx.com).
 * Larger files fall back to client upload with an absolute handle URL (may still fail over ~4.5MB on Hobby).
 */
async function uploadToBlob(file: File, prefix: 'images' | 'video') {
  if (file.size <= SERVER_PUT_MAX) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('prefix', prefix);
    const res = await fetch('/api/admin/blob-put', {
      method: 'POST',
      body: fd,
      credentials: 'include',
    });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Upload failed');
    }
    if (!data.url) throw new Error('Upload did not return a URL');
    return { url: data.url };
  }

  const pathname = `portfolio/${prefix}/${Date.now()}-${safeFilename(file.name)}`;
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return upload(pathname, file, {
    access: 'public',
    handleUploadUrl: `${origin}/api/admin/blob`,
    multipart: true,
  });
}

export default function AdminPortfolioPage() {
  const router = useRouter();
  const [userItems, setUserItems] = useState<PortfolioItem[]>([]);
  const [storageReady, setStorageReady] = useState(true);
  const [blobReady, setBlobReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioCategory>('websites');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [imagePlaceholder, setImagePlaceholder] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [tags, setTags] = useState('');

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editQueryHandled = useRef(false);

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
      setBlobReady(data.blobReady === true);
    } catch {
      setMessage('Could not load items.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  /** Open editor when arriving from public portfolio (?edit=id). */
  useEffect(() => {
    if (loading || editQueryHandled.current) return;
    editQueryHandled.current = true;
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('edit');
    if (!id) return;
    const item = userItems.find((i) => i.id === id);
    if (item) {
      setEditingId(item.id);
      setTitle(item.title);
      setCategory(item.category);
      setDescription(item.description);
      setLink(item.link ?? '');
      setImagePlaceholder(item.imagePlaceholder ?? '');
      setImageUrl(item.imageUrl ?? '');
      setVideoUrl(item.videoUrl ?? '');
      setTags(item.tags?.join(', ') ?? '');
      setMessage('');
      window.history.replaceState(null, '', '/admin/portfolio');
      window.requestAnimationFrame(() => {
        document.getElementById('admin-portfolio-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      setMessage(
        'That entry is not in your admin-added list. Built-in portfolio rows are edited in data/portfolio.ts in the repo.'
      );
      window.history.replaceState(null, '', '/admin/portfolio');
    }
  }, [loading, userItems]);

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  async function onPickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage('Choose an image file (PNG, JPG, WebP, GIF).');
      return;
    }
    setMessage('');
    setUploadingImage(true);
    try {
      const blob = await uploadToBlob(file, 'images');
      setImageUrl(blob.url);
      setMessage('Image uploaded.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  }

  async function onPickVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setMessage('Choose a video file (MP4, WebM, or QuickTime).');
      return;
    }
    setMessage('');
    setUploadingVideo(true);
    try {
      const blob = await uploadToBlob(file, 'video');
      setVideoUrl(blob.url);
      setMessage('Video uploaded.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle('');
    setCategory('websites');
    setDescription('');
    setLink('');
    setImagePlaceholder('');
    setImageUrl('');
    setVideoUrl('');
    setTags('');
  }

  function startEdit(item: PortfolioItem) {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setDescription(item.description);
    setLink(item.link ?? '');
    setImagePlaceholder(item.imagePlaceholder ?? '');
    setImageUrl(item.imageUrl ?? '');
    setVideoUrl(item.videoUrl ?? '');
    setTags(item.tags?.join(', ') ?? '');
    setMessage('');
    if (typeof window !== 'undefined') {
      window.requestAnimationFrame(() => {
        document.getElementById('admin-portfolio-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  function cancelEdit() {
    resetForm();
    setMessage('Edit cancelled.');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    const wasEdit = Boolean(editingId);
    // Always send string fields so JSON never drops keys (undefined strips and could wipe media on save).
    const payload = {
      title: title.trim(),
      category,
      description: description.trim(),
      link: link.trim(),
      imagePlaceholder: imagePlaceholder.trim(),
      imageUrl: imageUrl.trim(),
      videoUrl: videoUrl.trim(),
      tags: tags.trim(),
    };
    try {
      const res = await fetch('/api/admin/portfolio', {
        method: wasEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wasEdit && editingId ? { id: editingId, ...payload } : payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(typeof data.error === 'string' ? data.error : 'Save failed');
        return;
      }
      resetForm();
      setMessage(wasEdit ? 'Changes saved.' : 'Added to portfolio.');
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
      if (editingId === id) resetForm();
      setMessage('Removed.');
      await load();
    } else {
      setMessage('Could not delete.');
    }
  }

  return (
    <div className="min-h-screen bg-pirate-black px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <AdminNav />
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

        {!blobReady && (
          <div className="mt-4 rounded-md border border-sky-500/40 bg-sky-950/30 px-4 py-3 text-sm text-sky-200">
            <strong className="text-sky-100">Uploads:</strong> Add{' '}
            <code className="text-sky-100">BLOB_READ_WRITE_TOKEN</code> from Vercel → Storage → Blob
            (create a store, then paste the token). Without it, use the image/video URL fields below
            to paste links (e.g. YouTube, Imgur, or any https image).
          </div>
        )}

        {loading ? (
          <p className="mt-8 text-gray-400">Loading…</p>
        ) : (
          <>
            <section
              id="admin-portfolio-form"
              className="mt-8 scroll-mt-8 rounded-lg border border-pirate-steel bg-pirate-charcoal p-6"
            >
              <h2 className="font-semibold text-white">
                {editingId ? 'Edit project' : 'Add project'}
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Seed projects stay in <code className="text-xs text-gray-500">data/portfolio.ts</code>.
                Items you add here can be edited anytime. Upload screenshots or videos, or paste URLs.
              </p>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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

                <div className="rounded-md border border-pirate-steel/60 bg-pirate-black/50 p-4 space-y-3">
                  <p className="text-sm font-medium text-white">Cover image</p>
                  <p className="text-xs text-gray-500">
                    Use <strong className="text-gray-400">Upload</strong> or a <strong className="text-gray-400">direct image URL</strong>{' '}
                    (.png / .jpg / .webp). Your <strong className="text-gray-400">project link</strong> is the live site, not an image — the
                    portfolio will show a small site icon until you add a real cover here.
                  </p>
                  <p className="text-xs text-gray-500">
                    Files in <code className="text-xs text-gray-400">public/images/</code> ship with your repo: after you{' '}
                    <strong className="text-gray-400">push to main</strong>, Vercel deploys them — use paths like{' '}
                    <code className="text-xs text-gray-400">/images/portfolio/…</code> on production the same way (not localhost-only).
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-md border border-pirate-gold/50 px-4 py-2 text-sm text-pirate-gold hover:bg-pirate-gold/10">
                      {uploadingImage ? 'Uploading…' : 'Upload image / screenshot'}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={onPickImage}
                        disabled={!blobReady || uploadingImage}
                      />
                    </label>
                    {!blobReady && (
                      <span className="text-xs text-gray-500">or paste URL →</span>
                    )}
                  </div>
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/portfolio/rustmaxx.png or https://…"
                    className="w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-sm text-white"
                  />
                  {imageUrl && (
                    <div className="relative mt-2 aspect-video w-full max-w-md overflow-hidden rounded-md border border-pirate-steel">
                      <PortfolioCoverImage
                        src={imageUrl}
                        alt="Preview"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="rounded-md border border-pirate-steel/60 bg-pirate-black/50 p-4 space-y-3">
                  <p className="text-sm font-medium text-white">Video archive</p>
                  <p className="text-xs text-gray-500">
                    Upload an MP4/WebM clip, or paste a YouTube link, Twitch VOD, or direct video URL.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer rounded-md border border-pirate-gold/50 px-4 py-2 text-sm text-pirate-gold hover:bg-pirate-gold/10">
                      {uploadingVideo ? 'Uploading…' : 'Upload video file'}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={onPickVideo}
                        disabled={!blobReady || uploadingVideo}
                      />
                    </label>
                  </div>
                  <input
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/… or direct .mp4 URL"
                    className="w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300">Project link (optional)</label>
                  <input
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300">
                    Image label fallback (optional, if no image URL)
                  </label>
                  <input
                    value={imagePlaceholder}
                    onChange={(e) => setImagePlaceholder(e.target.value)}
                    placeholder="Short label when no image"
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
                <div className="flex flex-wrap gap-3">
                  <button
                    type="submit"
                    disabled={saving || !storageReady}
                    className="rounded-md bg-pirate-crimson px-6 py-2 font-medium text-white hover:bg-pirate-red disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : editingId ? 'Save changes' : 'Add to portfolio'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="rounded-md border border-pirate-steel px-6 py-2 text-sm text-gray-300 hover:bg-pirate-black/50"
                    >
                      Cancel edit
                    </button>
                  )}
                </div>
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
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      {item.imageUrl && (
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded border border-pirate-steel">
                          <PortfolioCoverImage
                            src={item.imageUrl}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-medium text-white">{item.title}</span>
                        <span className="ml-2 text-xs text-gray-500">{item.category}</span>
                        {item.videoUrl && (
                          <span className="ml-2 text-xs text-pirate-gold">video</span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="text-sm text-pirate-gold hover:text-amber-200"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
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
