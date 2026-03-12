'use client';

import Link from 'next/link';
import { useState } from 'react';
import { mainNav } from '@/data/navigation';
import { Container } from './Container';

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-pirate-steel/80 bg-pirate-black/95 backdrop-blur-sm">
      <Container>
        <nav className="flex h-16 items-center justify-between lg:h-18">
          <Link
            href="/"
            className="font-display text-xl font-bold tracking-tight text-white transition hover:text-pirate-gold sm:text-2xl"
          >
            Pirate Maxx
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 md:flex">
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
            </ul>
          </div>
        )}
      </Container>
    </header>
  );
}
