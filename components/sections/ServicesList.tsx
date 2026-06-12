"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

interface ServiceItem {
  abbr: string;
  title: string;
  description: string;
}

interface ServiceContent {
  sectionNumber: string;
  eyebrow: string;
  heading: string;
  items: ServiceItem[];
  itemCta: string;
  cta: string;
}

interface ServicesListProps {
  lang: Locale;
  services: ServiceContent;
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

/**
 * Services — clean two-column typographic index on white (Cain Lamarre
 * "Expertises" pattern). Premium through type + spacing, no imagery.
 * Each service is a list ROW: gold editorial number, Fraunces title,
 * muted description, hover arrow. Rows reveal on scroll, top borders
 * trace in. Stands on its own until real photography exists.
 */
export function ServicesList({ lang, services }: ServicesListProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const section = sectionRef.current;
      if (!section) return;

      // ── Header — eyebrow → title → intro, staggered on entry ────────
      const header = section.querySelector<HTMLElement>("[data-services-header]");
      if (header) {
        const items = header.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: header, start: "top 80%", once: true },
        });
      }

      // ── Rows — border traces in, then content fades up, row by row ──
      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-service-row]")
      );
      rows.forEach((row, i) => {
        const border = row.querySelector<HTMLElement>("[data-row-border]");
        const content = row.querySelector<HTMLElement>("[data-row-content]");
        if (!border || !content) return;

        // Two-column layout: right column trails the left for a cascade.
        // Offset is a timeline position (not a tween/timeline `delay`), so a
        // ScrollTrigger that's already past `start` on load still completes —
        // rows can never stay stuck at opacity 0.
        const offset = (i % 2) * 0.08;

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
          })
          .from(
            border,
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.9,
            },
            offset
          )
          .from(
            content,
            { opacity: 0, y: 20, duration: 0.7 },
            offset + 0.35
          );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-white relative z-10">
      <div className={`${PADX} pt-12 lg:pt-16 pb-14 lg:pb-20`}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <div data-services-header>
          <span
            data-reveal
            className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-7"
          >
            <span aria-hidden className="w-8 h-px bg-gold" />
            {services.eyebrow}
          </span>

          <h2
            data-reveal
            className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05] max-w-2xl"
            style={{ fontSize: "var(--text-h2)" }}
          >
            Nos expertises
          </h2>

          <p
            data-reveal
            className="mt-6 max-w-xl font-sans text-muted leading-[1.7] text-[length:var(--text-body)]"
          >
            {services.heading}
          </p>
        </div>

        {/* ── List — two-column index of services ────────────────── */}
        <div className="mt-14 lg:mt-20 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-14 border-b border-line">
          {services.items.map((item, i) => (
            <Link
              key={item.abbr}
              href={`/${lang}/services`}
              data-service-row
              className="group relative block py-8 lg:py-10 px-3 lg:px-5 -mx-3 lg:-mx-5 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:bg-cream-soft"
            >
              {/* Top border — traces in via scaleX */}
              <span
                data-row-border
                aria-hidden
                className="absolute top-0 left-3 right-3 lg:left-5 lg:right-5 h-px bg-line"
              />

              <div data-row-content className="flex items-start gap-5 lg:gap-7">
                <span className="shrink-0 pt-1.5 w-9 font-display text-gold leading-none text-[length:var(--text-small)] tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex-1 min-w-0">
                  <h3
                    className="font-display font-light text-ink-soft tracking-[-0.02em] leading-[1.2] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-2.5 max-w-md font-sans text-muted leading-[1.6] text-[length:var(--text-small)]">
                    {item.description}
                  </p>
                </div>

                <span
                  aria-hidden
                  className="shrink-0 pt-1 font-sans text-lg text-muted transition-[transform,color] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 group-hover:text-brand"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Footer link — all services ─────────────────────────── */}
        <div className="mt-12 lg:mt-16">
          <Link
            href={`/${lang}/services`}
            className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] text-ink tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
          >
            {services.cta}
            <span
              aria-hidden
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
