import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import {
  appendUserPortfolioItem,
  getUserPortfolioItems,
  portfolioStorageConfigured,
  removeUserPortfolioItem,
  updateUserPortfolioItem,
} from '@/lib/portfolio-storage';
import type { PortfolioCategory, PortfolioItem } from '@/data/portfolio';

const CATEGORIES: PortfolioCategory[] = [
  'websites',
  'graphics',
  'badges',
  'stream-branding',
  'gaming-projects',
];

async function requireAdmin(): Promise<NextResponse | null> {
  const token = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token || !(await verifyAdminSessionToken(token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}

type ParsedPortfolioFields = {
  title: string;
  description: string;
  category: PortfolioCategory;
  link: string;
  imagePlaceholder: string;
  imageUrl: string;
  videoUrl: string;
  tags: string[] | undefined;
};

function parsePortfolioBody(body: unknown):
  | { ok: true; data: ParsedPortfolioFields }
  | { ok: false; error: string; status: number } {
  if (typeof body !== 'object' || body === null) {
    return { ok: false, error: 'Invalid JSON', status: 400 };
  }
  const b = body as Record<string, unknown>;
  const title = typeof b.title === 'string' ? b.title.trim() : '';
  const description = typeof b.description === 'string' ? b.description.trim() : '';
  const category = b.category as PortfolioCategory;
  const link = typeof b.link === 'string' ? b.link.trim() : '';
  const imagePlaceholder =
    typeof b.imagePlaceholder === 'string' ? b.imagePlaceholder.trim() : '';
  const imageUrl =
    typeof b.imageUrl === 'string'
      ? b.imageUrl.trim()
      : b.imageUrl != null
        ? String(b.imageUrl).trim()
        : '';
  const videoUrl = typeof b.videoUrl === 'string' ? b.videoUrl.trim() : '';
  const tagsRaw = typeof b.tags === 'string' ? b.tags : '';

  if (!title || !description) {
    return { ok: false, error: 'Title and description are required', status: 400 };
  }
  if (!CATEGORIES.includes(category)) {
    return { ok: false, error: 'Invalid category', status: 400 };
  }

  const tagList = tagsRaw
    ? String(tagsRaw)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)
    : undefined;

  return {
    ok: true,
    data: {
      title,
      description,
      category,
      link,
      imagePlaceholder,
      imageUrl,
      videoUrl,
      tags: tagList?.length ? tagList : undefined,
    },
  };
}

function buildPortfolioItem(id: string, d: ParsedPortfolioFields): PortfolioItem {
  return {
    id,
    title: d.title,
    category: d.category,
    description: d.description,
    ...(d.link ? { link: d.link } : {}),
    ...(d.imagePlaceholder ? { imagePlaceholder: d.imagePlaceholder } : {}),
    ...(d.imageUrl ? { imageUrl: d.imageUrl } : {}),
    ...(d.videoUrl ? { videoUrl: d.videoUrl } : {}),
    ...(d.tags?.length ? { tags: d.tags } : {}),
  };
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const userItems = await getUserPortfolioItems();
  return NextResponse.json({
    userItems,
    storageReady: portfolioStorageConfigured(),
    blobReady: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
  });
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!portfolioStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          'Portfolio storage is not configured. For production, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Local dev can use a file without Redis.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const parsed = parsePortfolioBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }
    const item = buildPortfolioItem(crypto.randomUUID(), parsed.data);

    await appendUserPortfolioItem(item);
    revalidatePath('/');
    revalidatePath('/portfolio');
    return NextResponse.json({ success: true, item });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save portfolio item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  const removed = await removeUserPortfolioItem(id);
  if (!removed) {
    return NextResponse.json({ error: 'Item not found' }, { status: 404 });
  }
  revalidatePath('/');
  revalidatePath('/portfolio');
  revalidatePath(`/portfolio/${id}`);
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!portfolioStorageConfigured()) {
    return NextResponse.json(
      {
        error:
          'Portfolio storage is not configured. For production, set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Local dev can use a file without Redis.',
      },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const id = typeof body?.id === 'string' ? body.id.trim() : '';
    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const userItems = await getUserPortfolioItems();
    if (!userItems.some((i) => i.id === id)) {
      return NextResponse.json(
        { error: 'Item not found or not editable (seed projects are edited in the repo).' },
        { status: 404 }
      );
    }

    const parsed = parsePortfolioBody(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    const item = buildPortfolioItem(id, parsed.data);
    const updated = await updateUserPortfolioItem(id, item);
    if (!updated) {
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    revalidatePath('/');
    revalidatePath('/portfolio');
    revalidatePath(`/portfolio/${id}`);
    return NextResponse.json({ success: true, item });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to update portfolio item' }, { status: 500 });
  }
}
