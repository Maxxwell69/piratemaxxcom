import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { parseCommunityPermission } from '@/lib/community-permission';
import { updateMemberPermission } from '@/lib/member-storage';

async function isAdmin(): Promise<boolean> {
  const token = cookies().get(ADMIN_SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const permission = parseCommunityPermission(body.permission);
    if (!email || !permission) {
      return NextResponse.json(
        { error: 'Provide email and permission: fan, super_fan, or mod.' },
        { status: 400 }
      );
    }

    const ok = await updateMemberPermission(email, permission);
    if (!ok) {
      return NextResponse.json({ error: 'No member found with that email.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, email, permission });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
