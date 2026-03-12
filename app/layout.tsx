import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const display = Cinzel({
  variable: '--font-display',
  subsets: ['latin'],
  display: 'swap',
});

const body = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pirate Maxx | Gaming, Streaming, Web & Graphic Design',
  description:
    'Pirate Maxx—gamer, creator, builder. Streaming, website design, graphics, game badges, and digital brand building. Your command deck for gaming and creative services.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://piratemaxx.com'),
  openGraph: {
    title: 'Pirate Maxx | Gaming, Streaming, Web & Graphic Design',
    description: 'Gaming. Creation. Building. Streams, websites, graphics, and branding.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
