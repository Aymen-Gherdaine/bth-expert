type Variant = "default" | "narrow" | "prose";

/**
 * Gouttière horizontale standard des sections (source unique).
 * Importée telle quelle par les sections qui posent leur propre layout sans
 * passer par <Container> (grilles full-bleed, fonds décalés…).
 */
export const SECTION_PX =
  "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default: "",
  narrow:  "max-w-[var(--container-narrow)]",
  prose:   "max-w-[var(--container-prose)]",
};

export function Container({ children, className = "", variant = "default" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full ${SECTION_PX} ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
