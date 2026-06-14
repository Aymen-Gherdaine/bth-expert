interface SectionProps {
  children: React.ReactNode;
  number?: string;
  eyebrow?: string;
  className?: string;
  id?: string;
  tight?: boolean;
}

export function Section({
  children,
  number,
  eyebrow,
  className = "",
  id,
  tight = false,
}: SectionProps) {
  const py = tight ? "py-16 md:py-24" : "py-24 md:py-32 lg:py-40";

  return (
    <section id={id} className={`${py} ${className}`}>
      {(number || eyebrow) && (
        <div className="flex items-baseline gap-4 mb-12 md:mb-16">
          {number && (
            <span className="font-display text-[length:var(--text-caption)] text-gold tracking-widest">
              {number}
            </span>
          )}
          {eyebrow && (
            <span className="text-[length:var(--text-caption)] uppercase tracking-widest text-muted">
              {eyebrow}
            </span>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
