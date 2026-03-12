interface PageBannerProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageBanner({ title, subtitle, className = '' }: PageBannerProps) {
  return (
    <section className={`relative overflow-hidden bg-pirate-charcoal py-20 texture-overlay sm:py-24 ${className}`}>
      <div className="absolute inset-0">
        <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-pirate-crimson/15 blur-3xl" />
      </div>
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 text-lg text-gray-400">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
