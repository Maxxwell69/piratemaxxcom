import { NextResponse } from 'next/server';

/**
 * Returns whether you're currently live on TikTok.
 * Set TIKTOK_LIVE=true in env (Railway or .env.local) and restart — no redeploy needed.
 */
export async function GET() {
  const tiktokLive =
    process.env.TIKTOK_LIVE === 'true' || process.env.TIKTOK_LIVE === '1';
  return NextResponse.json({ tiktokLive });
}
