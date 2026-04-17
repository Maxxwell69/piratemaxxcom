import Link from 'next/link';
import { listFanDirectoryEntries, memberStorageConfigured } from '@/lib/member-storage';
import { FanLoungeChat } from '@/components/community/FanLoungeChat';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Fan crew | Pirate Maxx',
  description: 'Meet the crew, fan profiles, and the fan lounge chat.',
};

export default async function FansHubPage() {
  const entries = memberStorageConfigured() ? await listFanDirectoryEntries() : [];

  return (
    <div className="bg-pirate-black px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-display text-3xl font-bold text-white">Fan crew</h1>
        <p className="mt-2 max-w-2xl text-gray-400">
          Community members who sail with Pirate Maxx. Open a profile card to see socials and bio. The fan lounge chat
          lives below — sign in to join the conversation.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-xl text-pirate-gold">Profiles</h2>
          {entries.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">
              No public profiles yet. Sign up from the navbar and fill out your fan card.
            </p>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {entries.map((fan) => (
                <li key={fan.id}>
                  <Link
                    href={`/community/fans/${fan.id}`}
                    className="block rounded-lg border border-pirate-steel bg-pirate-charcoal p-5 transition hover:border-pirate-gold/40"
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-pirate-steel bg-pirate-black">
                        {fan.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={fan.avatarUrl} alt="" className="h-14 w-14 object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center font-display text-lg text-pirate-gold">
                            {fan.displayName.slice(0, 1).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="font-semibold text-white">{fan.displayName}</span>
                        {fan.bioPreview && (
                          <p className="mt-1 line-clamp-3 text-sm text-gray-400">{fan.bioPreview}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-16">
          <FanLoungeChat />
        </section>

        <p className="mt-10 text-center text-sm text-gray-500">
          <Link href="/community/profile" className="text-pirate-gold hover:underline">
            Edit your profile
          </Link>{' '}
          ·{' '}
          <Link href="/" className="hover:text-gray-400">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
