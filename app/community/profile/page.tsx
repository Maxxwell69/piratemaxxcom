import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-session';
import { permissionLabel } from '@/lib/community-permission';
import { ProfileActions } from '@/components/community/ProfileActions';

export default async function CommunityProfilePage() {
  const session = await getMemberSession();
  if (!session) {
    redirect('/community/login?next=/community/profile');
  }

  return (
    <div className="min-h-[70vh] bg-pirate-black px-4 py-12">
      <div className="mx-auto max-w-lg rounded-lg border border-pirate-steel bg-pirate-charcoal p-8">
        <h1 className="font-display text-2xl font-bold text-white">Your profile</h1>
        <p className="mt-2 text-sm text-gray-400">
          Signed in as <span className="text-gray-200">{session.displayName}</span> (
          {session.email}).
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-pirate-steel/80 pb-3">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium text-pirate-gold">{permissionLabel(session.permission)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-gray-500">
          If an admin changed your role, use <strong className="text-gray-400">Sync permissions</strong> so mod
          tools and your session match the server (your cookie is re-signed).
        </p>
        <ProfileActions />
        <ul className="mt-10 space-y-2 text-sm text-gray-400">
          <li>
            <Link href="/community/super-fans" className="text-pirate-gold hover:underline">
              Super fan lounge
            </Link>{' '}
            — super fans and mods.
          </li>
          {session.permission === 'mod' && (
            <li>
              <Link href="/community/mod" className="text-pirate-gold hover:underline">
                Mod deck
              </Link>{' '}
              — moderation tools (mods only).
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
