import Link from 'next/link';
import Image from 'next/image';
import type { PortfolioItem } from '@/data/portfolio';
import { Badge } from './Badge';
import { getYouTubeId, isDirectVideoFileUrl } from '@/lib/portfolio-video';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export function PortfolioCard({ item }: PortfolioCardProps) {
  const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
  const directVideo = item.videoUrl && !ytId && isDirectVideoFileUrl(item.videoUrl);

  return (
    <article className="group overflow-hidden rounded-lg border border-pirate-steel bg-pirate-charcoal transition hover:border-pirate-gold/40">
      <div className="relative aspect-video bg-pirate-steel">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full min-h-[10rem] items-center justify-center px-4 text-center text-gray-500 text-sm">
            {item.imagePlaceholder || 'Project image'}
          </div>
        )}
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

        {item.videoUrl && (
          <div className="mt-4 space-y-2">
            {ytId ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
                <iframe
                  title={`${item.title} video`}
                  src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : directVideo ? (
              <video
                src={item.videoUrl}
                controls
                className="w-full rounded-md bg-black"
                preload="metadata"
              />
            ) : (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-pirate-gold hover:underline"
              >
                Watch video archive →
              </a>
            )}
          </div>
        )}

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
          <Link
            href={`/portfolio/${encodeURIComponent(item.id)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-medium text-pirate-gold hover:underline"
          >
            View project →
          </Link>
          {item.link &&
            item.link !== '#' &&
            /^https?:\/\//i.test(item.link.trim()) && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm font-medium text-gray-400 hover:text-pirate-gold hover:underline"
              >
                Live site →
              </a>
            )}
        </div>
      </div>
    </article>
  );
}
