export interface NavLink {
  href: string;
  label: string;
}

export const mainNav: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gaming', label: 'Gaming' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/links', label: 'Links' },
  { href: '/community/fans', label: 'Fans' },
  { href: '/contact', label: 'Contact' },
];
