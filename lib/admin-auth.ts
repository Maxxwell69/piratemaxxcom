import { SignJWT, jwtVerify } from 'jose';

const COOKIE = 'admin_session';

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET;
  if (!s || s.length < 32) return null;
  return new TextEncoder().encode(s);
}

export async function createAdminSessionToken(): Promise<string | null> {
  const secret = getSecret();
  if (!secret) return null;
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  const secret = getSecret();
  if (!secret) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function adminAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_JWT_SECRET && process.env.ADMIN_JWT_SECRET.length >= 32);
}

export { COOKIE as ADMIN_SESSION_COOKIE_NAME };
