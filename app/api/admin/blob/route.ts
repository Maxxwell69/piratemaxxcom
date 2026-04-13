import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { getBlobReadWriteToken } from '@/lib/blob-token';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

/** 200 MB max per upload (multipart handles large video). */
const MAX_BYTES = 200 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const rw = getBlobReadWriteToken();
  if (!rw) {
    return NextResponse.json({ error: 'Blob storage not configured' }, { status: 503 });
  }
  process.env.BLOB_READ_WRITE_TOKEN = rw;

  try {
    const body = (await request.json()) as HandleUploadBody;

    if (body.type === 'blob.generate-client-token') {
      const sessionToken = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
      if (!sessionToken || !(await verifyAdminSessionToken(sessionToken))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async () => {
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
