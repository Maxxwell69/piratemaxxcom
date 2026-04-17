import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/member-session';
import { findMemberById, toPublicMember } from '@/lib/member-storage';

export async function GET() {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ member: null }, { status: 200 });
  }
  const full = await findMemberById(session.id);
  if (full) {
    return NextResponse.json({ member: toPublicMember(full) });
  }
  return NextResponse.json({
    member: {
      id: session.id,
      email: session.email,
      displayName: session.displayName,
      permission: session.permission,
    },
  });
}
