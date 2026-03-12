import Link from 'next/link';
import Image from 'next/image';
import { tiktokProfile } from '@/data/tiktok';

const tiktokUrl = `https://www.tiktok.com/@${tiktokProfile.username}`;

export function TikTokProfileCard() {
  return (
    <Link
      href={tiktokUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center rounded-xl border border-pirate-steel bg-pirate-charcoal p-6 text-center transition hover:border-pirate-gold/40 hover:shadow-glow-gold sm:flex-row sm:items-center sm:text-left"
    >
      <div className="mb-4 sm:mb-0 sm:mr-6 flex h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-pirate-gold/50 bg-pirate-steel">
        {tiktokProfile.profileImageUrl ? (
          <Image
            src={tiktokProfile.profileImageUrl}
            alt={tiktokProfile.displayName}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-3xl text-pirate-gold">
            🏴‍☠️
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium uppercase tracking-wider text-pirate-gold">
          TikTok
        </p>
        <h3 className="mt-1 text-xl font-bold text-white group-hover:text-pirate-gold transition">
          @{tiktokProfile.username}
        </h3>
        {tiktokProfile.displayName && (
          <p className="mt-0.5 text-gray-400">{tiktokProfile.displayName}</p>
        )}
        <span className="mt-3 inline-block text-sm font-medium text-pirate-gold group-hover:underline">
          Follow on TikTok →
        </span>
      </div>
    </Link>
  );
}
