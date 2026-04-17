import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { hashPassword } from '@/lib/password-hash';
import { memberAuthConfigured, createMemberSessionToken, MEMBER_SESSION_COOKIE_NAME } from '@/lib/member-auth';
import { memberStorageConfigured, addMember, findMemberByEmail } from '@/lib/member-storage';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateBody(body: unknown): { email: string; password: string; displayName: string } | null {
  if (!body || typeof body !== 'object') return null;
  const o = body as Record<string, unknown>;
  const email = typeof o.email === 'string' ? o.email.trim().toLowerCase() : '';
  const password = typeof o.password === 'string' ? o.password : '';
  const displayName = typeof o.displayName === 'string' ? o.displayName.trim() : '';
  if (!email || !EMAIL_RE.test(email)) return null;
  if (password.length < 8) return null;
  if (displayName.length < 1 || displayName.length > 80) return null;
  return { email, password, displayName };
}

export async function POST(request: NextRequest) {
  try {
    if (!memberAuthConfigured()) {
      return NextResponse.json(
        {
          error:
            'Community sign-up is not configured. Set MEMBER_JWT_SECRET (32+ characters) in your environment.',
        },
        { status: 503 }
      );
    }
    if (!memberStorageConfigured()) {
      return NextResponse.json(
        {
          error:
            'Member storage is not available. Use Upstash Redis in production or run in development for local file storage.',
        },
        { status: 503 }
      );
    }

    const body = validateBody(await request.json());
    if (!body) {
      return NextResponse.json(
        {
          error:
            'Invalid input. Use a valid email, password (8+ characters), and display name (1–80 characters).',
        },
        { status: 400 }
      );
    }

    if (await findMemberByEmail(body.email)) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await hashPassword(body.password);
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    await addMember({
      id,
      email: body.email,
      displayName: body.displayName,
      passwordHash,
      permission: 'fan',
      createdAt,
    });

    const token = await createMemberSessionToken({
      sub: id,
      email: body.email,
      displayName: body.displayName,
      permission: 'fan',
    });
    if (!token) {
      return NextResponse.json({ error: 'Could not create session' }, { status: 500 });
    }

    const res = NextResponse.json({
      success: true,
      member: { id, email: body.email, displayName: body.displayName, permission: 'fan' as const },
    });
    res.cookies.set(MEMBER_SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : '';
    if (message.includes('already registered')) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
