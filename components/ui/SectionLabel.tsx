import type { ReactNode } from "react";

interface SectionLabelProps {
  children: ReactNode;
  /**
   * Running number of the block within its page ("02"). When given, the
   * label is set as a numbered running head, without the hairline.
   */
  index?: string;
  /** On a dark band, use the bright gold; on cream, the accessible gold ink. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * The small caption that opens a block.
 *
 * Two registers, on purpose: the hairline eyebrow belongs to the openers
 * (heroes, home chapters, dark bands), the numbered running head to the
 * blocks inside a page. Before this component every block used the hairline,
 * twenty times across the site, and the device stopped meaning anything.
 */
export function SectionLabel({ children, index, tone = "light", className = "" }: SectionLabelProps) {
  const color = tone === "dark" ? "text-gold" : "text-gold-ink";
  const rule = tone === "dark" ? "bg-gold" : "bg-gold-ink";

  if (index) {
    return (
      <span
        className={`inline-flex items-baseline gap-3 font-sans uppercase tracking-[0.2em] ${color} text-[length:var(--text-caption)] ${className}`}
      >
        <span aria-hidden className="font-display normal-case tracking-normal tabular-nums text-[length:var(--text-small)]">
          {index}
        </span>
        {children}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] ${color} text-[length:var(--text-caption)] ${className}`}
    >
      <span aria-hidden className={`w-8 h-px ${rule}`} />
      {children}
    </span>
  );
}
