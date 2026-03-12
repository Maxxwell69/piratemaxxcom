import Link from 'next/link';
import { HeroSection } from '@/components/ui/HeroSection';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { StreamLinkCard } from '@/components/ui/StreamLinkCard';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import { CTASection } from '@/components/ui/CTASection';
import { Container } from '@/components/layout/Container';
import { homeServicePreviews } from '@/data/services';
import { platformLinks } from '@/data/links';
import { portfolioItems } from '@/data/portfolio';

const heroHeadline = 'Pirate Maxx';
const heroSubhead =
  'Gaming, streaming, websites, graphics, and digital brand building. One captain. One command deck.';

const introCopy = {
  title: 'Gamer. Builder. Entrepreneur.',
  body: 'Pirate Maxx is the digital brand for gaming, creation, and building. From gaming communities and live streams to custom websites, graphics, and game badges—everything lives here. This is where the brand operates: building online projects from the ground up and helping creators and communities look and perform like they mean it.',
};

const whyCopy = {
  title: 'Why Work With Pirate Maxx',
  points: [
    { title: 'Gaming-native mindset', text: 'Understands communities, stream culture, and what gamers and creators actually need.' },
    { title: 'Creator-focused design', text: 'Design that serves your content and your audience, not generic templates.' },
    { title: 'Custom branding', text: 'Distinct identity for servers, streams, and projects—no cookie-cutter look.' },
    { title: 'Digital building experience', text: 'Websites, graphics, and systems that are built to last and easy to grow.' },
    { title: 'Creativity + execution', text: 'Ideas turned into real sites, assets, and brands you can use from day one.' },
  ],
};

export default function HomePage() {
  return (
    <>
      <HeroSection
        headline={heroHeadline}
        subheadline={heroSubhead}
        primaryCta={{ label: 'Watch Streams', href: '/links' }}
        secondaryCta={{ label: 'View Services', href: '/services' }}
        tertiaryCta={{ label: 'Contact Pirate Maxx', href: '/contact' }}
      />

      {/* Intro / About preview */}
      <Section background="charcoal">
        <SectionHeader title={introCopy.title} subtitle={introCopy.body} />
      </Section>

      {/* Services preview */}
      <Section id="services-preview" background="default">
        <SectionHeader
          title="Services"
          subtitle="Websites, graphics, streaming support, and gaming branding—built for creators and communities."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeServicePreviews.map((s) => (
            <ServiceCard
              key={s.id}
              title={s.title}
              summary={s.summary}
              href={s.href}
              icon={s.icon}
            />
          ))}
        </div>
      </Section>

      {/* Stream / Content hub preview */}
      <Section background="storm">
        <SectionHeader
          title="Command Center"
          subtitle="Your hub for Pirate Maxx content. Catch streams and connect on every platform."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {platformLinks.map((link) => (
            <StreamLinkCard key={link.id} link={link} size="large" />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/links"
            className="inline-flex items-center rounded-md bg-pirate-crimson px-6 py-3 text-base font-medium text-white hover:bg-pirate-red transition"
          >
            View all links →
          </Link>
        </div>
      </Section>

      {/* Portfolio preview */}
      <Section background="charcoal">
        <SectionHeader
          title="Selected Work"
          subtitle="Websites, graphics, stream assets, and gaming branding."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {portfolioItems.slice(0, 4).map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center rounded-md border border-pirate-gold/50 px-6 py-3 text-base font-medium text-pirate-gold hover:bg-pirate-gold/10 transition"
          >
            View full portfolio →
          </Link>
        </div>
      </Section>

      {/* Why work with Pirate Maxx */}
      <Section background="default">
        <SectionHeader title={whyCopy.title} />
        <ul className="mx-auto max-w-3xl space-y-6">
          {whyCopy.points.map((point) => (
            <li key={point.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-pirate-crimson/30 text-pirate-gold font-bold">
                ✓
              </span>
              <div>
                <h3 className="font-semibold text-white">{point.title}</h3>
                <p className="mt-1 text-gray-400">{point.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <CTASection />
    </>
  );
}
