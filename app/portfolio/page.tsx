import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { PortfolioGallery } from '@/components/portfolio/PortfolioGallery';
import { CTASection } from '@/components/ui/CTASection';
import { getMergedPortfolioItems } from '@/lib/portfolio-data';
import { getUserPortfolioItems } from '@/lib/portfolio-storage';
import { isAdminAuthenticated } from '@/lib/admin-session';

/** Admin-added items live in Redis; must not use a static snapshot from build time. */
export const dynamic = 'force-dynamic';

export default async function PortfolioPage() {
  const items = await getMergedPortfolioItems();
  const isAdmin = await isAdminAuthenticated();
  const editableIds = isAdmin ? (await getUserPortfolioItems()).map((i) => i.id) : undefined;

  return (
    <>
      <PageBanner
        title="Portfolio"
        subtitle="Websites, graphics, badges, stream branding, and gaming projects."
      />

      <Section background="charcoal">
        <PortfolioGallery items={items} editableIds={editableIds} />
      </Section>

      <CTASection />
    </>
  );
}
