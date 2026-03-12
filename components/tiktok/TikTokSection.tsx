'use client';

import { useEffect } from 'react';
import { SectionHeader } from '@/components/layout/SectionHeader';
import { TikTokProfileCard } from './TikTokProfileCard';
import { TikTokVideoEmbed } from './TikTokVideoEmbed';
import { tiktokProfile, tiktokVideoUrls } from '@/data/tiktok';
import Link from 'next/link';

export function TikTokSection() {
  useEffect(() => {
    if (document.querySelector('script[src="https://www.tiktok.com/embed.js"]')) return;
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const videosToShow = tiktokVideoUrls.filter((url) => {
    const match = url.match(/\/video\/(\d+)/);
    return match && match[1] && match[1] !== '0000000000000000000';
  });

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-pirate-charcoal">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="From TikTok"
          subtitle={`Latest from @${tiktokProfile.username}. Short-form content, behind-the-scenes, and more.`}
        />

        <div className="mb-10">
          <TikTokProfileCard />
        </div>

        {videosToShow.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {videosToShow.map((url) => (
              <TikTokVideoEmbed key={url} videoUrl={url} className="flex justify-center" />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-pirate-steel bg-pirate-black/50 py-12 text-center">
            <p className="text-gray-400">
              Add TikTok video URLs in <code className="rounded bg-pirate-steel px-1.5 py-0.5 text-sm">data/tiktok.ts</code> to feature them here.
            </p>
            <Link
              href="https://www.tiktok.com/@thepiratemaxx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block text-pirate-gold hover:underline"
            >
              Watch on TikTok →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
