"use client";

import { useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqProps {
  heading: string;
  items: FaqItem[];
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

/**
 * Accordion FAQ. Smooth height via the grid-rows 0fr→1fr trick (no measured
 * heights), gold "+" rotates to "×". Logical properties for RTL.
 */
export function Faq({ heading, items }: FaqProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-cream-soft">
      <div className={`${PADX} py-20 lg:py-28`}>
        <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)] mb-12">
          <span aria-hidden className="w-8 h-px bg-gold-ink" />
          {heading}
        </span>

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
