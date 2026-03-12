'use client';

import { useState } from 'react';

const serviceOptions = [
  'Website Design',
  'Graphic Design',
  'Stream Branding / Overlays',
  'Game Badges / Server Branding',
  'Gaming Community Setup',
  'Creator Identity / Full Brand',
  'Custom Package',
  'General Inquiry',
];

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      service: (form.elements.namedItem('service') as HTMLSelectElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) setStatus('sent');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 block w-full rounded-md border border-pirate-steel bg-pirate-charcoal px-4 py-3 text-white placeholder-gray-500 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
          placeholder="Your name"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 block w-full rounded-md border border-pirate-steel bg-pirate-charcoal px-4 py-3 text-white placeholder-gray-500 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-300">
          Service interest
        </label>
        <select
          id="service"
          name="service"
          className="mt-1 block w-full rounded-md border border-pirate-steel bg-pirate-charcoal px-4 py-3 text-white focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
        >
          <option value="">Select an option</option>
          {serviceOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-300">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1 block w-full rounded-md border border-pirate-steel bg-pirate-charcoal px-4 py-3 text-white placeholder-gray-500 focus:border-pirate-gold focus:ring-1 focus:ring-pirate-gold"
          placeholder="Tell me about your project or inquiry..."
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-md bg-pirate-crimson px-6 py-3 text-base font-medium text-white transition hover:bg-pirate-red disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Sending...' : status === 'sent' ? 'Message sent' : 'Send inquiry'}
        </button>
        {status === 'sent' && (
          <p className="mt-2 text-sm text-pirate-gold">
            Thanks! I&apos;ll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="mt-2 text-sm text-red-400">
            Something went wrong. Try again or email directly.
          </p>
        )}
      </div>
    </form>
  );
}
