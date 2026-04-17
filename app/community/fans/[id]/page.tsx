import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findMemberById, memberStorageConfigured, toFanPublicProfile } from '@/lib/member-storage';
import { permissionLabel } from '@/lib/community-permission';
import { FanSocialLinks } from '@/components/community/FanSocialLinks';
import { SOCIAL_FIELD_DEFS } from '@/lib/member-socials';

export const dynamic = 'force-dynamic';

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props) {
  const { id } = params;
  if (!memberStorageConfigured()) {
    return { title: 'Fan profile | Pirate Maxx' };
  }
  const m = await findMemberById(id);
  if (!m) return { title: 'Fan profile | Pirate Maxx' };
  return {
    title: `${m.displayName} | Fan crew | Pirate Maxx`,
    description: m.bio?.slice(0, 160) ?? `Fan profile for ${m.displayName} on Pirate Maxx.`,
  };
}

export default async function FanProfilePage({ params }: Props) {
  const { id } = params;
  if (!memberStorageConfigured()) {
    notFound();
  }
  const record = await findMemberById(id);
  if (!record) {
    notFound();
  }

  const fan = toFanPublicProfile(record);

  return (
    <div className="bg-pirate-black px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link href="/community/fans" className="text-sm text-pirate-gold hover:underline">
          ← Fan crew
        </Link>

        <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-pirate-steel bg-pirate-black">
            {fan.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={fan.avatarUrl} alt="" className="h-28 w-28 object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-4xl text-pirate-gold">
                {fan.displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="font-display text-3xl font-bold text-white">{fan.displayName}</h1>
            <p className="mt-2 text-sm text-pirate-gold">{permissionLabel(fan.permission)}</p>
          </div>
        </div>

        {fan.bio && (
          <div className="mt-10 rounded-lg border border-pirate-steel bg-pirate-charcoal p-6">
            <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-gray-500">About</h2>
            <p className="mt-2 whitespace-pre-wrap text-gray-300">{fan.bio}</p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-gray-500">Socials</h2>
          <div className="mt-3">
            {fan.socials &&
            SOCIAL_FIELD_DEFS.some(({ key }) => {
              const v = fan.socials![key];
              return typeof v === 'string' && v.trim().length > 0;
            }) ? (
              <FanSocialLinks socials={fan.socials} />
            ) : (
              <p className="text-sm text-gray-600">No links yet.</p>
            )}
          </div>
        </div>

        <p className="mt-12 text-center text-sm text-gray-500">
          <Link href="/community/fans" className="text-pirate-gold hover:underline">
            Fan crew &amp; chat
          </Link>
        </p>
      </div>
    </div>
  );
}
