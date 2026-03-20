import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

interface ContactPayload {
  name: string;
  email: string;
  service?: string;
  message: string;
}

function splitName(fullName: string) {
  const trimmed = fullName.trim();
  if (!trimmed) return { firstName: '', lastName: '' };
  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? '',
    lastName: parts.slice(1).join(' '),
  };
}

function classifyLead(service?: string, message?: string): 'quote' | 'client' {
  const serviceText = (service ?? '').toLowerCase();
  const messageText = (message ?? '').toLowerCase();
  const quoteSignals = ['quote', 'pricing', 'price', 'estimate', 'budget'];
  const isQuote = quoteSignals.some((s) => serviceText.includes(s) || messageText.includes(s));
  return isQuote ? 'quote' : 'client';
}

async function sendToGhl(payload: ContactPayload) {
  const webhookUrl = process.env.GHL_WEBHOOK_URL;
  const apiKey = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  const apiVersion = process.env.GHL_API_VERSION ?? '2021-07-28';
  const leadType = classifyLead(payload.service, payload.message);

  if (webhookUrl) {
    const webhookRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...payload,
        leadType,
        source: 'piratemaxx.com/contact',
        submittedAt: new Date().toISOString(),
      }),
    });
    if (!webhookRes.ok) {
      throw new Error(`GHL webhook failed (${webhookRes.status})`);
    }
    return;
  }

  if (!apiKey || !locationId) {
    throw new Error('Missing GHL configuration (GHL_WEBHOOK_URL or GHL_API_KEY + GHL_LOCATION_ID)');
  }

  const { firstName, lastName } = splitName(payload.name);
  const tags = ['source_website', 'piratemaxx', 'client-lead', leadType === 'quote' ? 'quote-request' : 'client'];
  const contactRes = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: apiVersion,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      locationId,
      firstName,
      lastName,
      name: payload.name,
      email: payload.email,
      tags,
      source: 'piratemaxx.com/contact',
    }),
  });

  if (!contactRes.ok) {
    const errText = await contactRes.text();
    throw new Error(`GHL contact create failed (${contactRes.status}): ${errText}`);
  }

  const contactJson = (await contactRes.json()) as {
    contact?: { id?: string };
    id?: string;
  };
  const contactId = contactJson.contact?.id ?? contactJson.id;
  const pipelineId = process.env.GHL_PIPELINE_ID;
  const stageId =
    leadType === 'quote'
      ? process.env.GHL_QUOTE_STAGE_ID ?? process.env.GHL_STAGE_ID
      : process.env.GHL_STAGE_ID;

  if (!contactId || !pipelineId || !stageId) {
    return;
  }

  const opportunityRes = await fetch(`${GHL_BASE_URL}/opportunities/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Version: apiVersion,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      locationId,
      contactId,
      pipelineId,
      pipelineStageId: stageId,
      name: `${payload.name} - ${payload.service || 'General Inquiry'}`,
      source: 'piratemaxx.com/contact',
      status: 'open',
    }),
  });

  if (!opportunityRes.ok) {
    const errText = await opportunityRes.text();
    throw new Error(`GHL opportunity create failed (${opportunityRes.status}): ${errText}`);
  }
}

/**
 * Sends contact form submissions to you via Resend.
 * Set RESEND_API_KEY and CONTACT_EMAIL in Vercel (or .env.local).
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

    const payload: ContactPayload = { name, email, service, message };
    const contactEmail = process.env.CONTACT_EMAIL;
    const shouldUseResend = Boolean(resend && contactEmail);
    const shouldUseGhl = Boolean(
      process.env.GHL_WEBHOOK_URL || (process.env.GHL_API_KEY && process.env.GHL_LOCATION_ID)
    );

    if (!shouldUseResend && !shouldUseGhl) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Contact submission (no integrations configured):', payload);
        return NextResponse.json({ success: true, channels: [] });
      }
      return NextResponse.json(
        {
          error:
            'Contact form is not configured. Set RESEND_API_KEY + CONTACT_EMAIL or GHL_WEBHOOK_URL (or GHL_API_KEY + GHL_LOCATION_ID).',
        },
        { status: 503 }
      );
    }

    const results = await Promise.allSettled([
      (async () => {
        if (!shouldUseResend) return 'resend-skipped';
        const fromAddress = process.env.RESEND_FROM_EMAIL ?? 'Pirate Maxx Contact <onboarding@resend.dev>';
        const { error } = await resend!.emails.send({
          from: fromAddress,
          to: contactEmail!,
          replyTo: email,
          subject: `Contact: ${service ? `[${service}] ` : ''}${name}`,
          html: [
            `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>`,
            service ? `<p><strong>Service interest:</strong> ${service}</p>` : '',
            `<p><strong>Message:</strong></p><p>${message.replace(/\n/g, '<br>')}</p>`,
          ].join(''),
        });
        if (error) throw new Error(`Resend error: ${error.message}`);
        return 'resend';
      })(),
      (async () => {
        if (!shouldUseGhl) return 'ghl-skipped';
        await sendToGhl(payload);
        return 'ghl';
      })(),
    ]);

    const succeeded = results
      .flatMap((r) => (r.status === 'fulfilled' ? [r.value] : []))
      .filter((c) => !c.endsWith('-skipped'));

    if (succeeded.length === 0) {
      const failures = results
        .flatMap((r) => (r.status === 'rejected' ? [r.reason?.message ?? 'Unknown error'] : []));
      console.error('Contact submission failed on all configured channels:', failures);
      return NextResponse.json({ error: 'Failed to process contact submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true, channels: succeeded });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
