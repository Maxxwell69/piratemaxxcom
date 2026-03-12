import Link from 'next/link';
import { finalCtaCopy } from '@/data/cta';

interface CTASectionProps {
  headline?: string;
  subhead?: string;
  buttons?: { label: string; href: string }[];
}

export function CTASection({
  headline = finalCtaCopy.headline,
  subhead = finalCtaCopy.subhead,
  buttons = finalCtaCopy.buttons,
}: CTASectionProps) {
  return (
    <section className="relative overflow-hidden border-y border-pirate-steel bg-pirate-charcoal py-20 texture-overlay sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-pirate-crimson/15 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {headline}
        </h2>
        <p className="mt-4 text-lg text-gray-400">
          {subhead}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {buttons.map((btn) => (
            <Link
              key={btn.href}
              href={btn.href}
              className="rounded-md bg-pirate-crimson px-6 py-3 text-base font-medium text-white transition hover:bg-pirate-red"
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
