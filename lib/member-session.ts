import { cookies } from 'next/headers';
import { verifyMemberSessionToken, MEMBER_SESSION_COOKIE_NAME } from '@/lib/member-auth';
import { findMemberById } from '@/lib/member-storage';
import type { CommunityPermission } from '@/lib/community-permission';

export interface MemberSession {
  id: string;
  email: string;
  displayName: string;
  permission: CommunityPermission;
}

/** Server-side: valid session from cookie; permission is refreshed from storage when possible. */
export async function getMemberSession(): Promise<MemberSession | null> {
  const token = cookies().get(MEMBER_SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  const jwt = await verifyMemberSessionToken(token);
  if (!jwt) return null;
  const fromDb = await findMemberById(jwt.sub);
  if (fromDb) {
    return {
      id: fromDb.id,
      email: fromDb.email,
      displayName: fromDb.displayName,
      permission: fromDb.permission,
    };
  }
  return {
    id: jwt.sub,
    email: jwt.email,
    displayName: jwt.displayName,
    permission: jwt.permission,
  };
}
