import type { MemberSocials } from '@/lib/member-socials';
import { SOCIAL_FIELD_DEFS } from '@/lib/member-socials';

function hrefFor(key: keyof MemberSocials, raw: string): string {
  const v = raw.trim();
  if (!v) return '#';
  if (/^https?:\/\//i.test(v)) return v;
  if (key === 'website') return `https://${v}`;
  return v;
}

export function FanSocialLinks({ socials }: { socials?: MemberSocials }) {
  if (!socials) return null;
  const items = SOCIAL_FIELD_DEFS.filter(({ key }) => {
    const v = socials[key];
    return typeof v === 'string' && v.trim().length > 0;
  });
  if (items.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-2">
      {items.map(({ key, label }) => (
        <li key={key}>
          <a
            href={hrefFor(key, socials[key]!)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-md border border-pirate-steel bg-pirate-black px-3 py-1.5 text-sm text-pirate-gold transition hover:border-pirate-gold/60 hover:text-white"
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
