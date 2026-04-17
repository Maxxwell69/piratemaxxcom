import { NextResponse } from 'next/server';
import { MEMBER_SESSION_COOKIE_NAME } from '@/lib/member-auth';

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(MEMBER_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}
