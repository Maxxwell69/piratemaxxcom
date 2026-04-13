import { unstable_noStore } from 'next/cache';
import { portfolioItems as seedItems } from '@/data/portfolio';
import type { PortfolioItem } from '@/data/portfolio';
import { getUserPortfolioItems } from '@/lib/portfolio-storage';
import { sanitizePortfolioItem } from '@/lib/portfolio-sanitize';

/**
 * Seed items from `data/portfolio.ts` plus items added via `/admin/portfolio`.
 */
export async function getMergedPortfolioItems(): Promise<PortfolioItem[]> {
  unstable_noStore();
  const user = (await getUserPortfolioItems()).map(sanitizePortfolioItem);
  return [...seedItems, ...user];
}
