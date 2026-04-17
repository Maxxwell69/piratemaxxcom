import { NextRequest, NextResponse } from 'next/server';
import {
  memberAuthConfigured,
  createMemberSessionToken,
  verifyMemberSessionToken,
  MEMBER_SESSION_COOKIE_NAME,
} from '@/lib/member-auth';
import { memberStorageConfigured, findMemberById } from '@/lib/member-storage';

/** Re-issue JWT from stored profile so permission changes apply without re-entering password. */
export async function POST(request: NextRequest) {
  if (!memberAuthConfigured() || !memberStorageConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const token = request.cookies.get(MEMBER_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  const jwt = await verifyMemberSessionToken(token);
  if (!jwt) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
  }

  const member = await findMemberById(jwt.sub);
  if (!member) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const next = await createMemberSessionToken({
    sub: member.id,
    email: member.email,
    displayName: member.displayName,
    permission: member.permission,
  });
  if (!next) {
    return NextResponse.json({ error: 'Could not refresh session' }, { status: 500 });
  }

  const res = NextResponse.json({
    success: true,
    member: {
      id: member.id,
      email: member.email,
      displayName: member.displayName,
      permission: member.permission,
    },
  });
  res.cookies.set(MEMBER_SESSION_COOKIE_NAME, next, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
