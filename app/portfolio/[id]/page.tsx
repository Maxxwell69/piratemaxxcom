import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { getMergedPortfolioItems } from '@/lib/portfolio-data';
import { getYouTubeId, isDirectVideoFileUrl } from '@/lib/portfolio-video';

export const dynamic = 'force-dynamic';

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps) {
  const items = await getMergedPortfolioItems();
  const item = items.find((i) => i.id === params.id);
  if (!item) {
    return buildMetadata({
      title: 'Project not found',
      description: 'This portfolio entry could not be found.',
      path: `/portfolio/${params.id}`,
    });
  }
  return buildMetadata({
    title: item.title,
    description: item.description,
    path: `/portfolio/${item.id}`,
  });
}

function isExternalProjectLink(href: string): boolean {
  return /^https?:\/\//i.test(href.trim());
}

export default async function PortfolioItemPage({ params }: PageProps) {
  const items = await getMergedPortfolioItems();
  const item = items.find((i) => i.id === params.id);
  if (!item) notFound();

  const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
  const directVideo = item.videoUrl && !ytId && isDirectVideoFileUrl(item.videoUrl);
  const showLiveLink = item.link && item.link !== '#' && isExternalProjectLink(item.link);

  return (
    <div className="bg-pirate-black pb-16 pt-8">
      <Container>
        <Link
          href="/portfolio"
          className="text-sm text-pirate-gold hover:underline"
        >
          ← Back to portfolio
        </Link>

        <header className="mt-8">
          <div className="flex flex-wrap gap-2">
            {item.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
            {!item.tags?.length && <Badge>{item.category}</Badge>}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">{item.title}</h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-400">{item.description}</p>
          <div className="mt-6 flex flex-wrap gap-4">
            {showLiveLink && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-md bg-pirate-crimson px-5 py-2.5 text-sm font-medium text-white hover:bg-pirate-red transition"
              >
                Visit live project →
              </a>
            )}
          </div>
        </header>

        {item.imageUrl && (
          <div className="relative mt-10 aspect-video w-full max-w-4xl overflow-hidden rounded-lg border border-pirate-steel bg-pirate-steel">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-contain sm:object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              unoptimized
              priority
            />
          </div>
        )}

        {!item.imageUrl && item.imagePlaceholder && (
          <p className="mt-10 text-sm text-gray-500">{item.imagePlaceholder}</p>
        )}

        {item.videoUrl && (
          <div className="mt-10 max-w-4xl space-y-4">
            <h2 className="font-display text-xl font-semibold text-white">Video</h2>
            {ytId ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black">
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
                className="w-full rounded-lg bg-black"
                preload="metadata"
              />
            ) : (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-pirate-gold hover:underline"
              >
                Open video archive →
              </a>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
