import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getMemberSession } from '@/lib/member-session';
import { hasAtLeastPermission } from '@/lib/community-permission';

export default async function SuperFansPage() {
  const session = await getMemberSession();
  if (!session) {
    redirect('/community/login?next=/community/super-fans');
  }
  if (!hasAtLeastPermission(session.permission, 'super_fan')) {
    return (
      <div className="min-h-[50vh] bg-pirate-black px-4 py-12 text-center">
        <p className="text-gray-400">This lounge is for super fans and mods.</p>
        <p className="mt-2 text-sm text-gray-500">
          Your current role is shown on your{' '}
          <Link href="/community/profile" className="text-pirate-gold hover:underline">
            profile
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-pirate-black px-4 py-12">
      <div className="mx-auto max-w-lg rounded-lg border border-pirate-gold/30 bg-pirate-charcoal p-8">
        <h1 className="font-display text-2xl font-bold text-pirate-gold">Super fan lounge</h1>
        <p className="mt-2 text-sm text-gray-400">
          Welcome, {session.displayName}. This page is allowed for <strong className="text-gray-200">super fan</strong>{' '}
          and <strong className="text-gray-200">mod</strong> profiles (checked on the server from your stored role).
        </p>
        <Link href="/community/profile" className="mt-8 inline-block text-sm text-pirate-gold hover:underline">
          ← Profile
        </Link>
      </div>
    </div>
  );
}
