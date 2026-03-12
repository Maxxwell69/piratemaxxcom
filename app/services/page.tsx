import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { Container } from '@/components/layout/Container';
import { serviceCategories } from '@/data/services';
import { CTASection } from '@/components/ui/CTASection';

export const metadata = buildMetadata({
  title: 'Services',
  description:
    'Gaming services, streaming support, website design, graphic design, game badges and branding. Custom packages for creators and communities.',
  path: '/services',
});

export default function ServicesPage() {
  return (
    <>
      <PageBanner
        title="Services"
        subtitle="Gaming, streaming, websites, graphics, and branding—built for creators and communities."
      />

      {serviceCategories.map((category) => (
        <Section
          key={category.id}
          id={category.id}
          background={category.id === 'packages' ? 'storm' : 'charcoal'}
        >
          <SectionHeader title={category.title} centered />
          <div className="space-y-10">
            {category.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-pirate-steel bg-pirate-black/50 p-6 sm:p-8"
              >
                <h3 className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-400">{item.description}</p>
                <ul className="mt-4 list-inside list-disc space-y-1 text-gray-400">
                  {item.deliverables.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="rounded-md bg-pirate-crimson px-4 py-2 text-sm font-medium text-white hover:bg-pirate-red transition"
                  >
                    {item.ctaText || 'Get a quote'}
                  </Link>
                  {item.pricePlaceholder && (
                    <span className="text-sm text-gray-500">{item.pricePlaceholder}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Section>
      ))}

      <CTASection />
    </>
  );
}
