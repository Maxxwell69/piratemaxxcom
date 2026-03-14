import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { StreamLinkCard } from '@/components/ui/StreamLinkCard';
import { Container } from '@/components/layout/Container';
import {
  gamingMissionCopy,
  featuredGames,
  gamingProjects,
  streamPlatformsCopy,
} from '@/data/gaming';
import { platformLinks } from '@/data/links';
import { CTASection } from '@/components/ui/CTASection';

export const metadata = buildMetadata({
  title: 'Gaming',
  description:
    'Pirate Maxx gaming: streams, featured games, community, and gaming-related services. Your hub for content and community.',
  path: '/gaming',
});

const streamLinks = platformLinks.filter((l) =>
  ['twitch', 'youtube', 'kick', 'tiktok'].includes(l.id)
);

export default function GamingPage() {
  return (
    <>
      <PageBanner
        title="Gaming"
        subtitle="Streams, community, and gaming at the helm."
      />

      <Section background="charcoal">
        <Container size="narrow">
          <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
            {gamingMissionCopy.headline}
          </h2>
          <p className="mt-4 text-lg text-gray-400 leading-relaxed">
            {gamingMissionCopy.body}
          </p>
        </Container>
      </Section>

      <Section background="default">
        <SectionHeader title="Featured Games" subtitle="Current and recurring focus." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGames.map((game) => {
            const cardContent = (
              <>
                <h3 className="font-semibold text-white group-hover:text-pirate-gold transition">
                  {game.name}
                </h3>
                {game.platform && (
                  <span className="text-xs text-pirate-gold">{game.platform}</span>
                )}
                <p className="mt-2 text-sm text-gray-400">{game.description}</p>
                {game.url && (
                  <span className="mt-3 inline-block text-sm text-pirate-gold opacity-0 group-hover:opacity-100 transition">
                    Visit game →
                  </span>
                )}
              </>
            );
            const cardClass =
              'rounded-lg border border-pirate-steel bg-pirate-charcoal p-5 transition hover:border-pirate-gold/50 group';
            return game.url ? (
              <a
                key={game.id}
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {cardContent}
              </a>
            ) : (
              <div key={game.id} className={cardClass}>
                {cardContent}
              </div>
            );
          })}
        </div>
      </Section>

      <Section background="storm">
        <SectionHeader
          title={streamPlatformsCopy.headline}
          subtitle={streamPlatformsCopy.body}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {streamLinks.map((link) => (
            <StreamLinkCard key={link.id} link={link} size="large" />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/links"
            className="text-pirate-gold hover:underline"
          >
            View all platforms →
          </Link>
        </div>
      </Section>

      <Section background="charcoal">
        <SectionHeader
          title="Gaming Services"
          subtitle="Branding, community setup, and stream support for gamers and creators."
        />
        <p className="mx-auto max-w-2xl text-center text-gray-400">
          From server branding to stream overlays and creator identity—Pirate Maxx builds for the gaming and creator space. Check the full list on the Services page.
        </p>
        <div className="mt-8 text-center">
          <Link
            href="/services"
            className="inline-flex items-center rounded-md bg-pirate-crimson px-6 py-3 text-base font-medium text-white hover:bg-pirate-red transition"
          >
            View services
          </Link>
        </div>
      </Section>

      <Section background="default">
        <SectionHeader
          title="Community & Projects"
          subtitle="Active and upcoming gaming-related projects."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gamingProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-lg border border-pirate-steel bg-pirate-charcoal p-5"
            >
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  project.status === 'active'
                    ? 'bg-green-900/40 text-green-400'
                    : project.status === 'upcoming'
                    ? 'bg-pirate-gold/20 text-pirate-gold'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {project.status}
              </span>
              <h3 className="mt-3 font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{project.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
