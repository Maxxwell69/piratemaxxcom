'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

type ChatMessage = {
  id: string;
  authorId: string;
  authorDisplayName: string;
  authorAvatarUrl?: string;
  body: string;
  createdAt: string;
};

type ChatState =
  | { status: 'loading' }
  | { status: 'guest' }
  | { status: 'unconfigured' }
  | { status: 'ready'; messages: ChatMessage[] };

export function FanLoungeChat() {
  const [state, setState] = useState<ChatState>({ status: 'loading' });
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    const res = await fetch('/api/community/chat', { credentials: 'same-origin' });
    if (res.status === 503) {
      setState({ status: 'unconfigured' });
      return;
    }
    if (res.status === 401) {
      setState({ status: 'guest' });
      return;
    }
    if (!res.ok) {
      setState({ status: 'ready', messages: [] });
      return;
    }
    const data = await res.json().catch(() => ({}));
    const messages = Array.isArray(data.messages) ? (data.messages as ChatMessage[]) : [];
    setState({ status: 'ready', messages });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (state.status !== 'ready') return;
    const t = setInterval(load, 4000);
    return () => clearInterval(t);
  }, [load, state.status]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setSendError('');
    setSending(true);
    try {
      const res = await fetch('/api/community/chat', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSendError(typeof data.error === 'string' ? data.error : 'Could not send');
        return;
      }
      setDraft('');
      await load();
    } catch {
      setSendError('Network error');
    } finally {
      setSending(false);
    }
  }

  if (state.status === 'loading') {
    return (
      <div className="rounded-lg border border-pirate-steel bg-pirate-charcoal p-6 text-sm text-gray-500">
        Loading chat…
      </div>
    );
  }

  if (state.status === 'unconfigured') {
    return (
      <div className="rounded-lg border border-amber-900/50 bg-pirate-charcoal p-6 text-sm text-amber-200/90">
        Fan lounge chat needs Redis in production (same Upstash vars as the rest of the community features).
      </div>
    );
  }

  if (state.status === 'guest') {
    return (
      <div className="rounded-lg border border-pirate-steel bg-pirate-charcoal p-6 text-center text-sm text-gray-400">
        <p>Sign in with your crew account to read and post in the fan lounge.</p>
        <div className="mt-4 flex justify-center gap-4">
          <Link href="/community/login?next=/community/fans" className="text-pirate-gold hover:underline">
            Log in
          </Link>
          <Link href="/community/signup" className="text-gray-300 hover:text-white">
            Join
          </Link>
        </div>
      </div>
    );
  }

  const { messages } = state;

  return (
    <div className="flex flex-col rounded-lg border border-pirate-steel bg-pirate-charcoal">
      <div className="border-b border-pirate-steel px-4 py-3">
        <h2 className="font-display text-lg text-white">Fan lounge chat</h2>
        <p className="text-xs text-gray-500">Crew-only. Messages refresh every few seconds.</p>
      </div>
      <div className="max-h-[min(420px,50vh)] space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages yet — say hello to the crew.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-3 text-sm">
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-pirate-steel bg-pirate-black">
                {m.authorAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.authorAvatarUrl} alt="" className="h-9 w-9 object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-pirate-gold">
                    {m.authorDisplayName.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                  <span className="font-medium text-gray-200">{m.authorDisplayName}</span>
                  <time className="text-xs text-gray-600" dateTime={m.createdAt}>
                    {new Date(m.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </time>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-gray-300">{m.body}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} className="border-t border-pirate-steel p-4">
        {sendError && <p className="mb-2 text-xs text-red-400">{sendError}</p>}
        <div className="flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={500}
            placeholder="Say something to the crew…"
            className="min-w-0 flex-1 rounded-md border border-pirate-steel bg-pirate-black px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
          />
          <button
            type="submit"
            disabled={sending || !draft.trim()}
            className="shrink-0 rounded-md bg-pirate-crimson px-4 py-2 text-sm font-medium text-white hover:bg-pirate-red disabled:opacity-50"
          >
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
