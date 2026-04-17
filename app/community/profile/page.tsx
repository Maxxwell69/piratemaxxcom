import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-session';
import { permissionLabel } from '@/lib/community-permission';
import { findMemberById, toPublicMember } from '@/lib/member-storage';
import { ProfileEditor } from '@/components/community/ProfileEditor';
import { ProfileLogout } from '@/components/community/ProfileLogout';

export default async function CommunityProfilePage() {
  const session = await getMemberSession();
  if (!session) {
    redirect('/community/login?next=/community/profile');
  }

  const record = await findMemberById(session.id);
  if (!record) {
    redirect('/community/login?next=/community/profile');
  }
  const publicProfile = toPublicMember(record);

  return (
    <div className="min-h-[70vh] bg-pirate-black px-4 py-12">
      <div className="mx-auto max-w-2xl rounded-lg border border-pirate-steel bg-pirate-charcoal p-8">
        <h1 className="font-display text-2xl font-bold text-white">Your profile</h1>
        <p className="mt-2 text-sm text-gray-400">
          Signed in as <span className="text-gray-200">{session.email}</span> — crew role is synced when you move
          between pages or reload.
        </p>
        <dl className="mt-6 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-pirate-steel/80 pb-3">
            <dt className="text-gray-500">Role</dt>
            <dd className="font-medium text-pirate-gold">{permissionLabel(record.permission)}</dd>
          </div>
        </dl>
        <ProfileEditor initial={publicProfile} />
        <ProfileLogout />
        <ul className="mt-10 space-y-2 text-sm text-gray-400">
          <li>
            <Link href="/community/fans" className="text-pirate-gold hover:underline">
              Fan crew &amp; chat
            </Link>{' '}
            — directory, your public card, and fan lounge.
          </li>
          <li>
            <Link href={`/community/fans/${session.id}`} className="text-pirate-gold hover:underline">
              Your public fan page
            </Link>
          </li>
          <li>
            <Link href="/community/super-fans" className="text-pirate-gold hover:underline">
              Super fan lounge
            </Link>{' '}
            — super fans and mods.
          </li>
          {record.permission === 'mod' && (
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
