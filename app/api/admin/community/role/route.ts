import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyAdminSessionToken, ADMIN_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { parseCommunityPermission } from '@/lib/community-permission';
import { updateMemberPermission, updateMemberPermissionById } from '@/lib/member-storage';

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
    const permission = parseCommunityPermission(body.permission);
    if (!permission) {
      return NextResponse.json(
        { error: 'Provide permission: fan, super_fan, or mod.' },
        { status: 400 }
      );
    }

    const id = typeof body.id === 'string' ? body.id.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (id) {
      const ok = await updateMemberPermissionById(id, permission);
      if (!ok) {
        return NextResponse.json({ error: 'No member found with that id.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, id, permission });
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Provide member id or email, and permission.' },
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
