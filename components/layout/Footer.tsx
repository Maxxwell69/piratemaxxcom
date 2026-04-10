import Link from 'next/link';
import Image from 'next/image';
import { mainNav } from '@/data/navigation';
import { platformLinks } from '@/data/links';
import { Container } from './Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-pirate-steel bg-pirate-charcoal">
      <Container>
        <div className="py-12 sm:py-16">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/logo.png"
                  alt="Pirate Maxx"
                  width={140}
                  height={42}
                  className="h-10 w-auto object-contain opacity-90 transition hover:opacity-100"
                />
              </Link>
              <p className="mt-3 text-sm text-gray-400">
                Gaming. Creation. Building. Your digital command deck for streams, services, and brand.
              </p>
            </div>

            {/* Nav */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Navigate</h3>
              <ul className="mt-4 space-y-2">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-gray-400 hover:text-pirate-gold transition">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Links */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Connect</h3>
              <ul className="mt-4 space-y-2">
                {platformLinks.slice(0, 4).map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-pirate-gold transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">Get in Touch</h3>
              <p className="mt-4 text-sm text-gray-400">
                Ready for custom websites, graphics, or branding? Reach out.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-md bg-pirate-crimson px-4 py-2 text-sm font-medium text-white hover:bg-pirate-red transition"
              >
                Contact
              </Link>
            </div>
          </div>

          <div className="mt-12 border-t border-pirate-steel pt-8 text-center text-sm text-gray-500">
            © {currentYear} Pirate Maxx. All rights reserved.
            <div className="mt-3">
              <Link
                href="/admin/login"
                className="text-xs text-gray-600 hover:text-gray-400 transition"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
