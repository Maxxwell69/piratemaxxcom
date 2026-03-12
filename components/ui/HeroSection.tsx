import Link from 'next/link';
import Image from 'next/image';
import { LiveBadge } from './LiveBadge';

interface HeroSectionProps {
  headline: string;
  subheadline: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  tertiaryCta?: { label: string; href: string };
  /** Optional hero image path (e.g. /images/hero.png). Shown as full-bleed background. */
  heroImageSrc?: string;
}

export function HeroSection({
  headline,
  subheadline,
  primaryCta = { label: 'Watch Streams', href: '/links' },
  secondaryCta = { label: 'View Services', href: '/services' },
  tertiaryCta = { label: 'Contact Pirate Maxx', href: '/contact' },
  heroImageSrc,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-pirate-charcoal texture-overlay">
      {/* Hero background image */}
      {heroImageSrc && (
        <>
          <div className="absolute inset-0">
            <Image
              src={heroImageSrc}
              alt=""
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-pirate-black/60" aria-hidden />
        </>
      )}
      {/* Gradient orbs (when no hero image) */}
      {!heroImageSrc && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-pirate-crimson/20 blur-3xl" />
          <div className="absolute top-1/2 -left-20 h-60 w-60 rounded-full bg-pirate-gold/10 blur-3xl" />
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <div className="mb-6 flex justify-center">
          <LiveBadge />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          {headline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 sm:text-xl">
          {subheadline}
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={primaryCta.href}
            className="rounded-md bg-pirate-crimson px-6 py-3 text-base font-medium text-white shadow-glow-crimson transition hover:bg-pirate-red"
          >
            {primaryCta.label}
          </Link>
          <Link
            href={secondaryCta.href}
            className="rounded-md border border-pirate-gold/50 bg-transparent px-6 py-3 text-base font-medium text-pirate-gold transition hover:bg-pirate-gold/10"
          >
            {secondaryCta.label}
          </Link>
          <Link
            href={tertiaryCta.href}
            className="rounded-md border border-gray-500 bg-transparent px-6 py-3 text-base font-medium text-gray-300 transition hover:bg-pirate-steel"
          >
            {tertiaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
