import { SignJWT, jwtVerify } from 'jose';
import type { CommunityPermission } from '@/lib/community-permission';

export const MEMBER_SESSION_COOKIE_NAME = 'member_session';

function getSecret() {
  const s = process.env.MEMBER_JWT_SECRET;
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

export interface MemberJwtPayload {
  sub: string;
  email: string;
  displayName: string;
  permission: CommunityPermission;
}

export function memberAuthConfigured(): boolean {
  return Boolean(process.env.MEMBER_JWT_SECRET && process.env.MEMBER_JWT_SECRET.length >= 32);
}

export async function createMemberSessionToken(payload: MemberJwtPayload): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  return new SignJWT({
    email: payload.email,
    displayName: payload.displayName,
    permission: payload.permission,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyMemberSessionToken(token: string): Promise<MemberJwtPayload | null> {
  const secret = getSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    const sub = typeof payload.sub === 'string' ? payload.sub : '';
    const email = typeof payload.email === 'string' ? payload.email : '';
    const displayName = typeof payload.displayName === 'string' ? payload.displayName : '';
    const permission = payload.permission;
    if (!sub || !email) return null;
    if (permission !== 'fan' && permission !== 'super_fan' && permission !== 'mod') return null;
    return { sub, email, displayName, permission };
  } catch {
    return null;
  }
}
