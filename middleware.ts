import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import { verifyMemberSessionToken, MEMBER_SESSION_COOKIE_NAME } from '@/lib/member-auth';
import { ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/community/mod')) {
    const token = request.cookies.get(MEMBER_SESSION_COOKIE_NAME)?.value;
    if (!token) {
      const login = new URL('/community/login', request.url);
      login.searchParams.set('next', pathname);
      return NextResponse.redirect(login);
    }
    const session = await verifyMemberSessionToken(token);
    if (!session || session.permission !== 'mod') {
      return NextResponse.redirect(new URL('/community/profile', request.url));
    }
    return NextResponse.next();
  }

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }
  if (pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const token = request.cookies.get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*', '/community/mod', '/community/mod/:path*'],
};
