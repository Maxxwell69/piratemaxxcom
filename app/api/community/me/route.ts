import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/member-session';

export async function GET() {
  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ member: null }, { status: 200 });
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
