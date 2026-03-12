import { buildMetadata } from '@/lib/metadata';
import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { ContactForm } from '@/components/forms/ContactForm';
import { platformLinks } from '@/data/links';

export const metadata = buildMetadata({
  title: 'Contact',
  description:
    'Get in touch with Pirate Maxx for website design, graphics, stream branding, or gaming services. Collaboration and inquiries welcome.',
  path: '/contact',
});

export default function ContactPage() {
  return (
    <>
      <PageBanner
        title="Contact"
        subtitle="Inquiries, collaboration, or custom projects—reach out."
      />

      <Section background="charcoal">
        <Container size="narrow">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-bold text-white">
                Send a message
              </h2>
              <p className="mt-3 text-gray-400">
                Use the form for service inquiries, project quotes, or general collaboration. For a faster response, you can also reach out on socials.
              </p>
              <div className="mt-8">
                <p className="text-sm font-medium text-gray-500">Direct email (placeholder)</p>
                <p className="mt-1 text-pirate-gold">contact@piratemaxx.com</p>
              </div>
              <div className="mt-8">
                <p className="text-sm font-medium text-gray-500">Connect</p>
                <ul className="mt-2 flex flex-wrap gap-4">
                  {platformLinks.map((link) => (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-pirate-gold transition"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="rounded-lg border border-pirate-steel bg-pirate-black/50 p-6 sm:p-8">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
