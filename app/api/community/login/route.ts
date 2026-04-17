import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/password-hash';
import { memberAuthConfigured, createMemberSessionToken, MEMBER_SESSION_COOKIE_NAME } from '@/lib/member-auth';
import { memberStorageConfigured, findMemberByEmail } from '@/lib/member-storage';

export async function POST(request: NextRequest) {
  try {
    if (!memberAuthConfigured() || !memberStorageConfigured()) {
      return NextResponse.json({ error: 'Community login is not configured.' }, { status: 503 });
    }

    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const member = await findMemberByEmail(email);
    if (!member || !(await verifyPassword(password, member.passwordHash))) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const token = await createMemberSessionToken({
      sub: member.id,
      email: member.email,
      displayName: member.displayName,
      permission: member.permission,
    });
    if (!token) {
      return NextResponse.json({ error: 'Could not create session' }, { status: 500 });
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
    res.cookies.set(MEMBER_SESSION_COOKIE_NAME, token, {
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
