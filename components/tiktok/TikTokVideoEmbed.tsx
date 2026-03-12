interface TikTokVideoEmbedProps {
  videoUrl: string;
  className?: string;
}

/**
 * Embeds a single TikTok video using TikTok's official blockquote + script.
 * videoUrl should be the full URL (e.g. https://www.tiktok.com/@user/video/123...)
 * Parent loads https://www.tiktok.com/embed.js for the embed to activate.
 */
export function TikTokVideoEmbed({ videoUrl, className = '' }: TikTokVideoEmbedProps) {
  const videoIdMatch = videoUrl.match(/\/video\/(\d+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) return null;

  return (
    <div className={className}>
      <blockquote
        className="tiktok-embed"
        cite={videoUrl}
        data-video-id={videoId}
        style={{ maxWidth: '605px', minWidth: '325px' }}
      >
        <section>
          <a target="_blank" rel="noopener noreferrer" href={videoUrl}>
            View on TikTok
          </a>
        </section>
      </blockquote>
    </div>
  );
}
