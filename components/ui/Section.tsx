interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  tight?: boolean;
}

export function Section({ children, className = "", id, tight = false }: SectionProps) {
  const py = tight ? "py-16 md:py-24" : "py-24 md:py-32 lg:py-40";

  return (
    <section id={id} className={`${py} ${className}`}>
      {children}
    </section>
  );
}
