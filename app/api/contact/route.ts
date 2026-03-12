import { NextRequest, NextResponse } from 'next/server';

/**
 * Placeholder API route for contact form submissions.
 * In production, wire this to:
 * - Email (Resend, SendGrid, etc.)
 * - CRM
 * - Database
 * - Webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, service, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, message' },
        { status: 400 }
      );
    }

    // Placeholder: log or store submission
    if (process.env.NODE_ENV === 'development') {
      console.log('Contact submission:', { name, email, service, message });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
