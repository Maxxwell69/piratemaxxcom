import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout/Container';
import { Badge } from '@/components/ui/Badge';
import { getMergedPortfolioItems } from '@/lib/portfolio-data';
import { getUserPortfolioItems } from '@/lib/portfolio-storage';
import { isAdminAuthenticated } from '@/lib/admin-session';
import { getYouTubeId, isDirectVideoFileUrl } from '@/lib/portfolio-video';
import { PortfolioCoverImage } from '@/components/portfolio/PortfolioCoverImage';
import { getPortfolioCoverSrc, isFaviconCoverFallback } from '@/lib/portfolio-cover-src';

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

  const isAdmin = await isAdminAuthenticated();
  const userIds = isAdmin ? (await getUserPortfolioItems()).map((u) => u.id) : [];
  const canEditInAdmin = userIds.includes(item.id);
  const adminEditHref = canEditInAdmin
    ? `/admin/portfolio?edit=${encodeURIComponent(item.id)}`
    : null;

  const ytId = item.videoUrl ? getYouTubeId(item.videoUrl) : null;
  const directVideo = item.videoUrl && !ytId && isDirectVideoFileUrl(item.videoUrl);
  const showLiveLink = item.link && item.link !== '#' && isExternalProjectLink(item.link);
  const coverSrc = getPortfolioCoverSrc(item);
  const faviconOnlyCover = isFaviconCoverFallback(item);

  return (
    <div className="bg-pirate-black pb-16 pt-8">
      <Container>
        <Link
          href="/portfolio"
          className="text-sm text-pirate-gold hover:underline"
        >
          ← Back to portfolio
        </Link>

        {isAdmin && (
          <div className="mt-4 rounded-lg border border-pirate-gold/30 bg-pirate-charcoal/60 px-4 py-3 text-sm text-gray-300">
            <span className="font-semibold text-pirate-gold">Admin</span>
            {adminEditHref ? (
              <>
                <span className="text-gray-500"> · </span>
                <Link href={adminEditHref} className="text-amber-400 hover:text-amber-300 hover:underline">
                  Edit this project
                </Link>
              </>
            ) : (
              <>
                <span className="text-gray-500"> · </span>
                Built-in projects are edited in{' '}
                <code className="rounded bg-pirate-black px-1 text-xs text-gray-400">data/portfolio.ts</code>.
              </>
            )}
          </div>
        )}

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

        {coverSrc && (
          <div className="mt-10 max-w-4xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-pirate-steel bg-pirate-steel">
              <PortfolioCoverImage
                src={coverSrc}
                alt={item.title}
                className={
                  faviconOnlyCover
                    ? 'absolute inset-0 m-auto h-24 w-24 max-h-[40%] max-w-[40%] object-contain sm:h-32 sm:w-32'
                    : 'absolute inset-0 h-full w-full object-contain sm:object-cover'
                }
                priority
              />
            </div>
            {faviconOnlyCover && (
              <p className="mt-3 text-sm text-gray-500">
                Showing the live site icon only. In{' '}
                <Link href="/admin/portfolio" className="text-pirate-gold hover:underline">
                  admin
                </Link>
                , upload a screenshot or paste a direct image URL (for example .png or .jpg) for a full cover.
              </p>
            )}
          </div>
        )}

        {!coverSrc && item.imagePlaceholder && (
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
