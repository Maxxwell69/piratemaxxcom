import { NextResponse } from 'next/server';
import { memberStorageConfigured, listFanDirectoryEntries } from '@/lib/member-storage';

export const dynamic = 'force-dynamic';

/** Public fan directory for /community/fans (no emails). */
export async function GET() {
  if (!memberStorageConfigured()) {
    return NextResponse.json({ members: [] });
  }
  const members = await listFanDirectoryEntries();
  return NextResponse.json({ members });
}
