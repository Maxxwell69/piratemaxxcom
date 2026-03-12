'use client';

import { useMemo, useState } from 'react';
import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import {
  portfolioItems,
  portfolioCategories,
  type PortfolioCategory,
} from '@/data/portfolio';
import { CTASection } from '@/components/ui/CTASection';

export default function PortfolioPage() {
  const [filter, setFilter] = useState<PortfolioCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return portfolioItems;
    return portfolioItems.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <>
      <PageBanner
        title="Portfolio"
        subtitle="Websites, graphics, badges, stream branding, and gaming projects."
      />

      <Section background="charcoal">
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === 'all'
                ? 'bg-pirate-crimson text-white'
                : 'bg-pirate-steel text-gray-400 hover:text-white'
            }`}
          >
            All
          </button>
          {portfolioCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilter(cat.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === cat.id
                  ? 'bg-pirate-crimson text-white'
                  : 'bg-pirate-steel text-gray-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
