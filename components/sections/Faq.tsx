"use client";

import { SECTION_PX } from "@/components/layout/Container";
import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqProps {
  heading: string;
  items: FaqItem[];
}

/**
 * Accordion FAQ. Smooth height via the grid-rows 0fr→1fr trick (no measured
 * heights), gold "+" rotates to "×". Logical properties for RTL. The
 * heading is a real h2: no eyebrow, no hairline.
 */
export function Faq({ heading, items }: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream-soft">
      <div className={`${SECTION_PX} py-20 lg:py-28`}>
        <h2 className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15] text-[length:var(--text-h2)] mb-12">{heading}</h2>

        <div className="max-w-3xl border-t border-line">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-start"
                >
                  <span
                    className="font-display font-light text-ink tracking-[-0.01em] leading-[1.3]"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-display text-gold-ink leading-none text-2xl transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                    style={{ transform: isOpen ? "rotate(45deg)" : "none" }}
                  >
                    +
                  </span>
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-7 max-w-2xl font-sans text-muted leading-[1.7] text-[length:var(--text-body)]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
