import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'gold' | 'crimson';
  className?: string;
}

const variantClasses = {
  default: 'bg-pirate-steel text-gray-300',
  gold: 'bg-pirate-gold/20 text-pirate-gold',
  crimson: 'bg-pirate-crimson/20 text-red-300',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
