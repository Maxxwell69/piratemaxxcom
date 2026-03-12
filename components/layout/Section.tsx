import { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: 'default' | 'narrow' | 'wide';
  id?: string;
  background?: 'default' | 'charcoal' | 'steel' | 'storm';
}

const bgClasses = {
  default: 'bg-pirate-black',
  charcoal: 'bg-pirate-charcoal',
  steel: 'bg-pirate-steel',
  storm: 'bg-pirate-storm',
};

export function Section({
  children,
  className = '',
  containerSize = 'default',
  id,
  background = 'default',
}: SectionProps) {
  return (
    <section id={id} className={`py-16 sm:py-20 lg:py-24 ${bgClasses[background]} ${className}`}>
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}
