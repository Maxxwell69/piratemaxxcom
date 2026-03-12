import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Portfolio',
  description:
    'Selected work: websites, graphics, stream branding, game badges, and gaming projects by Pirate Maxx.',
  path: '/portfolio',
});

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
