import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  const token = request.cookies.get('admin_session')?.value;
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
  matcher: ['/admin', '/admin/:path*'],
};
