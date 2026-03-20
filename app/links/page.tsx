import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { StreamLinkCard } from '@/components/ui/StreamLinkCard';
import { Container } from '@/components/layout/Container';
import { platformLinks, internalLinks } from '@/data/links';

export const metadata = buildMetadata({
  title: 'Links',
  description:
    'All Pirate Maxx links in one place: TikTok, Twitch, YouTube, Kick, Discord, and more. Your stream and content hub.',
  path: '/links',
});

export default function LinksPage() {
  const funnelLinks = [
    {
      id: 'ghl-client-funnel',
      name: 'Start Your Project',
      href: process.env.NEXT_PUBLIC_GHL_CLIENT_FUNNEL_URL,
      description: 'Client intake funnel for websites, graphics, and branding.',
      icon: '🧭',
    },
    {
      id: 'ghl-quote-funnel',
      name: 'Get a Quote',
      href: process.env.NEXT_PUBLIC_GHL_QUOTE_FUNNEL_URL,
      description: 'Quote request funnel for scoped project pricing.',
      icon: '💰',
    },
  ].filter((link): link is { id: string; name: string; href: string; description: string; icon: string } =>
    Boolean(link.href)
  );

  return (
    <>
      <PageBanner
        title="Links"
        subtitle="One hub for all platforms. Streams, community, and contact."
      />

      <Section background="charcoal">
        <Container size="narrow">
          <p className="text-center text-lg text-gray-400">
            Catch streams, join the community, or reach out. Everything you need is below.
          </p>
        </Container>
      </Section>

      <Section background="default">
        <Container size="narrow">
          <div className="space-y-4">
            {funnelLinks.length > 0 && (
              <div className="mb-6 space-y-4">
                {funnelLinks.map((link) => (
                  <StreamLinkCard key={link.id} link={link} size="large" />
                ))}
                <div className="border-t border-pirate-steel/60 pt-2" />
              </div>
            )}
            {platformLinks.map((link) => (
              <StreamLinkCard key={link.id} link={link} size="large" />
            ))}
            <div className="border-t border-pirate-steel pt-6 mt-8 space-y-4">
              {internalLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  className="group flex items-center gap-4 rounded-lg border border-pirate-steel bg-pirate-charcoal p-6 transition hover:border-pirate-gold/50 hover:shadow-glow-gold sm:p-8"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-pirate-crimson/30 text-2xl group-hover:bg-pirate-crimson/50 transition">
                    →
                  </span>
                  <span className="text-lg font-semibold text-white group-hover:text-pirate-gold transition">
                    {link.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
