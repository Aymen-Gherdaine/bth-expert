"use client";

import Link from "next/link";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

interface ServicesIndexItem {
  abbr: string;
  title: string;
  description: string;
  href: string | null;
}

interface ServicesIndexListProps {
  items: ServicesIndexItem[];
}

/**
 * Services index — editorial typographic register (manifesto Pattern 2).
 * Each expertise is a full-width row: a monumental index numeral, the abbr
 * eyebrow in gold, the title that warms to brand on hover, the description,
 * and a travelling arrow. Thin `line` filets separate the rows; scroll-reveal
 * comes from the shared FadeInStagger so it composes into the server page and
 * inherits the prefers-reduced-motion handling. No new assets, no new copy.
 */
export function ServicesIndexList({ items }: ServicesIndexListProps) {
  return (
    <FadeInStagger className="border-b border-line">
      {items.map((item, index) => {
        const numeral = String(index + 1).padStart(2, "0");

        const row = (
          <div className="group relative border-t border-line py-12 lg:py-16 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
            {/* Index numeral — monumental, dims to gold on hover */}
            <div className="lg:col-span-2 mb-6 lg:mb-0">
              <span
                aria-hidden
                className="font-display font-light text-muted/55 leading-none tabular-nums transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-gold"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.75rem)" }}
              >
                {numeral}
              </span>
            </div>

            {/* Abbr + title */}
            <div className="lg:col-span-5 mb-4 lg:mb-0">
              <span className="block font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-3">
                {item.abbr}
              </span>
              <h2
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {item.title}
              </h2>
            </div>

            {/* Description + travelling arrow */}
            <div className="lg:col-span-5 flex items-start gap-5">
              <p className="flex-1 font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                {item.description}
              </p>
              {item.href && (
                <span
                  aria-hidden
                  className="shrink-0 pt-0.5 font-sans text-lg text-muted transition-[transform,color] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5 rtl:-scale-x-100 group-hover:text-brand"
                >
                  →
                </span>
              )}
            </div>
          </div>
        );

        return (
          <FadeInItem key={item.abbr}>
            {item.href ? (
              <Link href={item.href} className="block">
                {row}
              </Link>
            ) : (
              row
            )}
          </FadeInItem>
        );
      })}
    </FadeInStagger>
  );
}
