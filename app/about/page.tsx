import { buildMetadata } from '@/lib/metadata';
import { PageBanner } from '@/components/ui/PageBanner';
import { Section } from '@/components/layout/Section';
import { Container } from '@/components/layout/Container';
import { CTASection } from '@/components/ui/CTASection';

export const metadata = buildMetadata({
  title: 'About',
  description:
    'Who is Pirate Maxx? Builder, gamer, entrepreneur. Gaming communities, streaming, web design, graphics, and digital brand building from the ground up.',
  path: '/about',
});

const sections = [
  {
    title: 'Who Is Pirate Maxx',
    content:
      'Pirate Maxx is a digital brand built around gaming, creation, and building. It’s not a persona—it’s an operator. Someone who plays, streams, designs websites, makes graphics, and helps others build their own presence. The name carries the idea of command: taking the helm, setting course, and getting things done.',
  },
  {
    title: 'What Pirate Maxx Builds',
    content:
      'Communities. Stream brands. Websites. Graphics. Game server badges and guild insignias. Creator identity kits. Landing pages. Whatever sits at the intersection of gaming culture and digital execution. If it lives online and needs to look and work like it means business, that’s the build space.',
  },
  {
    title: 'What the Brand Stands For',
    content:
      'Confidence without arrogance. Resilience—ships get hit; you repair and sail. Creativity applied to real projects, not just ideas. Leadership through doing: building in public, streaming, and putting work out there. The brand stands for the builder mentality: turn ideas into reality and help others do the same.',
  },
  {
    title: 'Why This Site Exists',
    content:
      'This site is the command deck. One place for streams, services, portfolio, and contact. For viewers who want to watch. For creators and communities who need a website, graphics, or branding. For anyone who wants to work with someone who gets gaming and gets design. No clutter. No gimmicks. Just the brand and the offer.',
  },
  {
    title: 'Mission',
    content:
      'To be the go-to operator for gaming-adjacent digital work: websites, graphics, stream branding, and community identity. To combine gaming culture with professional execution so creators and communities can look and operate like they mean it.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About Pirate Maxx"
        subtitle="Builder. Gamer. Entrepreneur. This is the brand and the mission."
      />
      <Section background="charcoal">
        <Container size="narrow">
          <div className="prose prose-invert prose-lg max-w-none space-y-16">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  {s.title}
                </h2>
                <p className="mt-4 text-gray-400 leading-relaxed">{s.content}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>
      <CTASection />
    </>
  );
}
