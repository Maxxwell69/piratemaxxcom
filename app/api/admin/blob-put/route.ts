import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { getBlobReadWriteToken } from '@/lib/blob-token';

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VIDEO = ['video/mp4', 'video/webm', 'video/quicktime'];

/** Stay under typical Vercel serverless request body limits; avoids browser→vercel.com CORS. */
const MAX_BYTES = 4 * 1024 * 1024;

async function requireAdmin(): Promise<NextResponse | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminSessionToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const rw = getBlobReadWriteToken();
  if (!rw) {
    return NextResponse.json({ error: 'Blob storage not configured' }, { status: 503 });
  }

  try {
    const form = await request.formData();
    const file = form.get('file');
    const prefixRaw = form.get('prefix');
    const prefix = prefixRaw === 'video' ? 'video' : 'images';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing file' }, { status: 400 });
    }

    const allowed = prefix === 'video' ? ALLOWED_VIDEO : ALLOWED_IMAGE;
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        {
          error: `File too large for this upload (${Math.round(MAX_BYTES / (1024 * 1024))}MB max). Compress the file, or paste an image/video URL instead.`,
        },
        { status: 413 }
      );
    }

    const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'upload';
    const pathname = `portfolio/${prefix}/${Date.now()}-${safe}`;

    const blob = await put(pathname, file, {
      access: 'public',
      token: rw,
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    console.error(e);
    const msg = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
