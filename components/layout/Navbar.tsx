'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { mainNav } from '@/data/navigation';
import { Container } from './Container';
import { LiveBadge } from '@/components/ui/LiveBadge';
import { CommunityNavAuth } from '@/components/layout/CommunityNavAuth';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-pirate-steel/80 bg-pirate-black/95 backdrop-blur-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between lg:h-18">
          <Link href="/" className="flex items-center gap-2 transition opacity-90 hover:opacity-100">
            <Image
              src="/images/logo.png"
              alt="Pirate Maxx"
              width={160}
              height={48}
              className="h-10 w-auto object-contain sm:h-12"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-6 md:flex">
            <li>
              <LiveBadge variant="compact" />
            </li>
            {mainNav.map((item) =>
              item.href === '/' ? null : (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-gray-300 transition hover:text-pirate-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
            <li className="border-l border-pirate-steel pl-6">
              <CommunityNavAuth />
            </li>
          </ul>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-pirate-steel hover:text-white md:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Toggle menu</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile nav */}
        {open && (
          <div className="border-t border-pirate-steel/80 py-4 md:hidden">
            <div className="mb-3 flex justify-center">
              <LiveBadge variant="compact" />
            </div>
            <ul className="flex flex-col gap-2">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-3 py-2 text-gray-300 hover:bg-pirate-steel hover:text-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="border-t border-pirate-steel pt-3">
                <div className="px-3 py-2 text-gray-400">
                  <span className="text-xs uppercase tracking-wide text-gray-500">Community</span>
                  <div className="mt-2 flex flex-col gap-2">
                    <CommunityNavAuth />
                  </div>
                </div>
              </li>
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}
