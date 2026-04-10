import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import {
  appendUserPortfolioItem,
  getUserPortfolioItems,
  portfolioStorageConfigured,
  removeUserPortfolioItem,
} from '@/lib/portfolio-storage';
import type { PortfolioCategory } from '@/data/portfolio';

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

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  const userItems = await getUserPortfolioItems();
  return NextResponse.json({
    userItems,
    storageReady: portfolioStorageConfigured(),
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
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    const description = typeof body.description === 'string' ? body.description.trim() : '';
    const category = body.category as PortfolioCategory;
    const link = typeof body.link === 'string' ? body.link.trim() : '';
    const imagePlaceholder =
      typeof body.imagePlaceholder === 'string' ? body.imagePlaceholder.trim() : '';
    const tagsRaw = typeof body.tags === 'string' ? body.tags : '';

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }
    if (!CATEGORIES.includes(category)) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    const tags = tagsRaw
      ? tagsRaw
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : undefined;

    const item = {
      id: crypto.randomUUID(),
      title,
      category,
      description,
      ...(link ? { link } : {}),
      ...(imagePlaceholder ? { imagePlaceholder } : {}),
      ...(tags?.length ? { tags } : {}),
    };

    await appendUserPortfolioItem(item);
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
  return NextResponse.json({ success: true });
}
