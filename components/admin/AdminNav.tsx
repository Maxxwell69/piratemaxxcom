import Link from 'next/link';

export function AdminNav() {
  return (
    <nav className="mb-8 flex flex-wrap gap-4 border-b border-pirate-steel pb-4 text-sm">
      <Link href="/admin" className="text-gray-400 hover:text-pirate-gold">
        Admin home
      </Link>
      <Link href="/admin/portfolio" className="text-gray-400 hover:text-pirate-gold">
        Portfolio
      </Link>
    </nav>
  );
}
