import { NextRequest, NextResponse } from 'next/server';
import {
  memberAuthConfigured,
  createMemberSessionToken,
  MEMBER_SESSION_COOKIE_NAME,
} from '@/lib/member-auth';
import { getMemberSession } from '@/lib/member-session';
import {
  memberStorageConfigured,
  findMemberById,
  updateMemberProfile,
  toPublicMember,
  type MemberProfileUpdates,
} from '@/lib/member-storage';
import { sanitizeSocials } from '@/lib/member-socials';
import { parseAvatarUrl, parseBio, parseDisplayName } from '@/lib/member-profile-validate';

export async function PATCH(request: NextRequest) {
  if (!memberAuthConfigured() || !memberStorageConfigured()) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: 'Not signed in' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const o = body as Record<string, unknown>;

  const updates: MemberProfileUpdates = {};

  if ('displayName' in o) {
    const d = parseDisplayName(o.displayName);
    if (!d.ok) return NextResponse.json({ error: d.error }, { status: 400 });
    updates.displayName = d.value;
  }

  if ('avatarUrl' in o) {
    const a = parseAvatarUrl(o.avatarUrl);
    if (!a.ok) return NextResponse.json({ error: a.error }, { status: 400 });
    updates.avatarUrl = a.value;
  }

  if ('bio' in o) {
    const b = parseBio(o.bio);
    if (!b.ok) return NextResponse.json({ error: b.error }, { status: 400 });
    updates.bio = b.value;
  }

  if ('socials' in o) {
    updates.socials = sanitizeSocials(o.socials);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No changes provided' }, { status: 400 });
  }

  const ok = await updateMemberProfile(session.id, updates);
  if (!ok) {
    return NextResponse.json({ error: 'Could not update profile' }, { status: 500 });
  }

  const member = await findMemberById(session.id);
  if (!member) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const token = await createMemberSessionToken({
    sub: member.id,
    email: member.email,
    displayName: member.displayName,
    permission: member.permission,
  });
  if (!token) {
    return NextResponse.json({ error: 'Could not refresh session' }, { status: 500 });
  }

  const res = NextResponse.json({ success: true, member: toPublicMember(member) });
  res.cookies.set(MEMBER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
