import Link from 'next/link';

interface ServiceCardProps {
  title: string;
  summary: string;
  href: string;
  icon?: string;
}

export function ServiceCard({ title, summary, href, icon }: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-pirate-steel bg-pirate-charcoal p-6 transition hover:border-pirate-gold/40 hover:shadow-glow-gold"
    >
      {icon && (
        <span className="mb-4 block text-3xl" aria-hidden>
          {icon}
        </span>
      )}
      <h3 className="font-display text-xl font-semibold text-white group-hover:text-pirate-gold transition">
        {title}
      </h3>
      <p className="mt-2 text-gray-400">{summary}</p>
      <span className="mt-4 inline-flex items-center text-sm font-medium text-pirate-gold group-hover:underline">
        Learn more →
      </span>
    </Link>
  );
}
