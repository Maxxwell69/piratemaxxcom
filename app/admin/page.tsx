import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminHomePage() {
  return (
    <div className="min-h-screen bg-pirate-black px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-2xl font-bold text-white">Admin</h1>
        <p className="mt-2 text-sm text-gray-400">
          Manage live site content stored outside the repo. Seed copy and default portfolio entries
          stay in <code className="text-xs text-gray-500">data/</code> until you add more sections
          here.
        </p>
        <div className="mt-8">
          <AdminNav />
        </div>
        <ul className="space-y-3">
          <li>
            <Link
              href="/admin/portfolio"
              className="block rounded-lg border border-pirate-steel bg-pirate-charcoal px-4 py-4 text-white transition hover:border-pirate-gold/50"
            >
              <span className="font-semibold">Portfolio</span>
              <span className="mt-1 block text-sm text-gray-400">
                Add, edit, or remove projects shown on the home and portfolio pages.
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
