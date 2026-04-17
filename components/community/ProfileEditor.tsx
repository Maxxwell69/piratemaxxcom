'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CommunityMemberPublic } from '@/lib/member-storage';
import { SOCIAL_FIELD_DEFS } from '@/lib/member-socials';

type Props = { initial: CommunityMemberPublic };

export function ProfileEditor({ initial }: Props) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(initial.displayName);
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl ?? '');
  const [bio, setBio] = useState(initial.bio ?? '');
  const [socials, setSocials] = useState<Record<string, string>>(() => {
    const s = initial.socials ?? {};
    const o: Record<string, string> = {};
    for (const { key } of SOCIAL_FIELD_DEFS) {
      o[key] = s[key as keyof typeof s] ?? '';
    }
    return o;
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('saving');
    try {
      const body = {
        displayName,
        avatarUrl: avatarUrl.trim() || '',
        bio: bio.trim() || '',
        socials: Object.fromEntries(
          SOCIAL_FIELD_DEFS.map(({ key }) => [key, (socials[key] ?? '').trim()])
        ),
      };
      const res = await fetch('/api/community/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not save');
        setStatus('error');
        return;
      }
      const u = data.member as CommunityMemberPublic | undefined;
      if (u) {
        setDisplayName(u.displayName);
        setAvatarUrl(u.avatarUrl ?? '');
        setBio(u.bio ?? '');
        const next: Record<string, string> = {};
        for (const { key } of SOCIAL_FIELD_DEFS) {
          next[key] = u.socials?.[key as keyof typeof u.socials] ?? '';
        }
        setSocials(next);
      }
      setStatus('saved');
      router.refresh();
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setError('Network error');
      setStatus('error');
    }
  }

  const preview = avatarUrl.trim() || null;

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-pirate-steel bg-pirate-black">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-supplied arbitrary URL
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-2xl text-pirate-gold">
              {displayName.trim().slice(0, 1).toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="w-full flex-1 space-y-3">
          <div>
            <label htmlFor="avatarUrl" className="block text-sm text-gray-300">
              Profile picture URL
            </label>
            <input
              id="avatarUrl"
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://…"
              className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-2 text-sm text-white placeholder:text-gray-600 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
            />
            <p className="mt-1 text-xs text-gray-500">Paste a direct image link (https). Leave blank for initials.</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="displayName" className="block text-sm text-gray-300">
          Display name
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          required
          maxLength={80}
          className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-2 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
        />
      </div>

      <div>
        <label htmlFor="bio" className="block text-sm text-gray-300">
          Fan card / about
        </label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          maxLength={500}
          placeholder="A line about you, your main game, or how you found the crew…"
          className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-4 py-3 text-white placeholder:text-gray-600 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
        />
        <p className="mt-1 text-xs text-gray-500">{bio.length}/500</p>
      </div>

      <div>
        <h2 className="font-display text-lg text-white">Socials</h2>
        <p className="mt-1 text-xs text-gray-500">Handles or profile links — shown on your public fan card.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {SOCIAL_FIELD_DEFS.map(({ key, label }) => (
            <div key={key}>
              <label htmlFor={`social-${key}`} className="block text-sm text-gray-400">
                {label}
              </label>
              <input
                id={`social-${key}`}
                type="text"
                value={socials[key] ?? ''}
                onChange={(e) => setSocials((prev) => ({ ...prev, [key]: e.target.value }))}
                className="mt-1 w-full rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-sm text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
                autoComplete="off"
              />
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}
      {status === 'saved' && <p className="text-sm text-green-400/90">Saved.</p>}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="rounded-md bg-pirate-crimson px-6 py-2.5 font-medium text-white hover:bg-pirate-red disabled:opacity-60"
      >
        {status === 'saving' ? 'Saving…' : 'Save profile'}
      </button>
    </form>
  );
}
