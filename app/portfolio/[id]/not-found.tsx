import Link from 'next/link';
import { Container } from '@/components/layout/Container';

export default function PortfolioNotFound() {
  return (
    <div className="bg-pirate-black py-24">
      <Container>
        <h1 className="font-display text-2xl font-bold text-white">Project not found</h1>
        <p className="mt-2 text-gray-400">That portfolio entry does not exist or was removed.</p>
        <Link href="/portfolio" className="mt-6 inline-block text-pirate-gold hover:underline">
          ← Back to portfolio
        </Link>
      </Container>
    </div>
  );
}
