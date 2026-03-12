import Link from 'next/link';
import type { PortfolioItem } from '@/data/portfolio';
import { Badge } from './Badge';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  return (
    <article className="group overflow-hidden rounded-lg border border-pirate-steel bg-pirate-charcoal transition hover:border-pirate-gold/40">
      <div className="aspect-video bg-pirate-steel flex items-center justify-center text-gray-500 text-sm">
        {item.imagePlaceholder || 'Project image'}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-2">
          {item.tags?.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
          {!item.tags?.length && <Badge>{item.category}</Badge>}
        </div>
        <h3 className="font-display text-lg font-semibold text-white group-hover:text-pirate-gold transition">
          {item.title}
        </h3>
        <p className="mt-2 text-sm text-gray-400">{item.description}</p>
        {item.link && (
          <Link
            href={item.link}
            className="mt-4 inline-block text-sm font-medium text-pirate-gold hover:underline"
          >
            View project →
          </Link>
        )}
      </div>
    </article>
  );
}
