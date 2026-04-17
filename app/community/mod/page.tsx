import Link from 'next/link';
import { getMemberSession } from '@/lib/member-session';

export default async function CommunityModPage() {
  const session = await getMemberSession();
  if (!session || session.permission !== 'mod') {
    return (
      <div className="min-h-[50vh] bg-pirate-black px-4 py-12 text-center text-gray-400">
        <p>Mod access requires the mod role on your session.</p>
        <p className="mt-2 text-sm">
          Open your{' '}
          <Link href="/community/profile" className="text-pirate-gold hover:underline">
            profile
          </Link>{' '}
          and use <strong className="text-gray-300">Sync permissions</strong> after an admin assigns mod.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-pirate-black px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-lg border border-pirate-steel bg-pirate-charcoal p-8">
        <h1 className="font-display text-2xl font-bold text-white">Mod deck</h1>
        <p className="mt-2 text-sm text-gray-400">
          Signed in as {session.displayName}. This area is gated to the <strong className="text-gray-200">mod</strong>{' '}
          permission in your session cookie.
        </p>
        <p className="mt-6 text-sm text-gray-400">
          Hook chat moderation, reports, or stream tools here as you grow the stack. The route is protected in{' '}
          <code className="text-xs text-gray-500">middleware.ts</code> using your community JWT.
        </p>
        <Link href="/community/profile" className="mt-8 inline-block text-sm text-pirate-gold hover:underline">
          ← Back to profile
        </Link>
      </div>
    </div>
  );
}
