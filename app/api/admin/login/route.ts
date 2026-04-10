import { NextRequest, NextResponse } from 'next/server';
import { adminAuthConfigured, createAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const password = typeof body.password === 'string' ? body.password : '';

    if (!adminAuthConfigured()) {
      return NextResponse.json(
        { error: 'Admin auth is not configured. Set ADMIN_JWT_SECRET (32+ characters) and ADMIN_PORTFOLIO_PASSWORD.' },
        { status: 503 }
      );
    }

    if (password !== process.env.ADMIN_PORTFOLIO_PASSWORD) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    if (!token) {
      return NextResponse.json({ error: 'Could not create session' }, { status: 500 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
