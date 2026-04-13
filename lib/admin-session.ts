import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';

/** For server components: true when a valid admin session cookie is present. */
export async function isAdminAuthenticated(): Promise<boolean> {
  const token = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}
