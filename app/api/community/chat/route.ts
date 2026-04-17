import { NextRequest, NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/member-session';
import { findMemberById } from '@/lib/member-storage';
import {
  fanChatStorageConfigured,
  getFanLoungeMessages,
  appendFanLoungeMessage,
} from '@/lib/fan-chat-storage';

export async function GET() {
  if (!fanChatStorageConfigured()) {
    return NextResponse.json(
      { error: 'Chat is not configured. Add Upstash Redis in production.' },
      { status: 503 }
    );
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: 'Sign in to view the fan lounge chat.' }, { status: 401 });
  }

  const messages = await getFanLoungeMessages();
  return NextResponse.json({ messages });
}

export async function POST(request: NextRequest) {
  if (!fanChatStorageConfigured()) {
    return NextResponse.json(
      { error: 'Chat is not configured. Add Upstash Redis in production.' },
      { status: 503 }
    );
  }

  const session = await getMemberSession();
  if (!session) {
    return NextResponse.json({ error: 'Sign in to post in the fan lounge.' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const text =
    body && typeof body === 'object' && typeof (body as { body?: unknown }).body === 'string'
      ? (body as { body: string }).body
      : '';

  const member = await findMemberById(session.id);
  if (!member) {
    return NextResponse.json({ error: 'Account not found' }, { status: 404 });
  }

  const result = await appendFanLoungeMessage({
    authorId: member.id,
    authorDisplayName: member.displayName,
    authorAvatarUrl: member.avatarUrl,
    body: text,
  });

  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: result });
}
