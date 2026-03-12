/**
 * TikTok live status. Set NEXT_PUBLIC_TIKTOK_LIVE=true when you're live
 * (e.g. in Railway env vars or .env.local), then redeploy or restart the app.
 * TikTok doesn't provide a public "is live" API, so this is a manual toggle.
 */
export const isLiveOnTikTok =
  process.env.NEXT_PUBLIC_TIKTOK_LIVE === 'true' ||
  process.env.NEXT_PUBLIC_TIKTOK_LIVE === '1';
