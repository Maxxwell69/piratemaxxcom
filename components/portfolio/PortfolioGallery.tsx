'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { PortfolioCard } from '@/components/ui/PortfolioCard';
import {
  portfolioCategories,
  type PortfolioCategory,
  type PortfolioItem,
} from '@/data/portfolio';

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  /** When the viewer is an admin: ids of items stored in admin storage (editable on-site). */
  editableIds?: string[];
}

export function PortfolioGallery({ items, editableIds }: PortfolioGalleryProps) {
  const [filter, setFilter] = useState<PortfolioCategory | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.category === filter);
  }, [filter, items]);

  const isAdmin = editableIds !== undefined;

  return (
    <>
      {isAdmin && (
        <div className="mb-6 rounded-lg border border-pirate-gold/30 bg-pirate-black/40 px-4 py-3 text-sm text-gray-300">
          <span className="font-semibold text-pirate-gold">Admin</span>
          <span className="text-gray-500"> · </span>
          Cards you added from the dashboard show an <strong className="text-white">Edit</strong> link.
          Built-in projects are edited in{' '}
          <code className="rounded bg-pirate-charcoal px-1 text-xs text-gray-400">data/portfolio.ts</code>{' '}
          in the repo.
          <Link href="/admin/portfolio" className="ml-2 text-pirate-gold hover:underline">
            Portfolio admin →
          </Link>
        </div>
      )}
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
          <PortfolioCard
            key={item.id}
            item={item}
            editHref={
              editableIds?.includes(item.id)
                ? `/admin/portfolio?edit=${encodeURIComponent(item.id)}`
                : undefined
            }
          />
        ))}
      </div>
    </>
  );
}
