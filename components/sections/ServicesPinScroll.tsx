"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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

interface ServicesPinScrollProps {
  lang: Locale;
  services: ServiceContent;
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

/**
 * Services — signature pin-scroll (manifesto Pattern 1, DOMINANT).
 * The left visual stays fixed (CSS sticky — robust with Lenis, no fragile
 * pin-spacer) while the service rows scroll past it. GSAP carries the
 * storytelling: the active number crossfades, inactive rows dim, and a
 * gold rail traces the reading progress. Reduced-motion falls back to a
 * clean static two-column with the first service shown active.
 */
export function ServicesPinScroll({ lang, services }: ServicesPinScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // ── Header — eyebrow → title → intro on entry ──────────────────
      const head = section.querySelectorAll<HTMLElement>("[data-reveal]");
      if (head.length && !reduce) {
        gsap.from(head, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: head[0], start: "top 80%", once: true },
        });
      }

      if (reduce) return; // sticky handles the layout; skip the choreography

      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-row]")
      );
      const numEl = section.querySelector<HTMLElement>("[data-active-num]");
      const labelEl = section.querySelector<HTMLElement>("[data-active-label]");
      const fillEl = section.querySelector<HTMLElement>("[data-progress]");

      // ── Active service drives the pinned panel (number + abbr) ──────
      const setActive = (i: number) => {
        rows.forEach((r, j) =>
          gsap.to(r, {
            opacity: j === i ? 1 : 0.32,
            duration: 0.4,
            ease: "power2.out",
          })
        );
        if (numEl) {
          numEl.textContent = String(i + 1).padStart(2, "0");
          gsap.fromTo(
            numEl,
            { opacity: 0, yPercent: 12 },
            { opacity: 1, yPercent: 0, duration: 0.5, ease: "expo.out" }
          );
        }
        if (labelEl) {
          labelEl.textContent = services.items[i]?.abbr ?? "";
          gsap.fromTo(
            labelEl,
            { opacity: 0 },
            { opacity: 1, duration: 0.5, ease: "expo.out" }
          );
        }
      };

      rows.forEach((row, i) => {
        // Reveal the row once
        gsap.from(row, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
          onComplete: () => gsap.set(row, { clearProps: "opacity,transform" }),
        });

        // Activate when the row crosses the reading line
        ScrollTrigger.create({
          trigger: row,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (self) => {
            if (self.isActive) setActive(i);
          },
        });
      });

      // First row active by default (until scroll picks another)
      setActive(0);

      // ── Gold progress rail traces across the column ─────────────────
      const rightCol = section.querySelector<HTMLElement>("[data-rows]");
      if (fillEl && rightCol) {
        gsap.fromTo(
          fillEl,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: rightCol,
              start: "top 60%",
              end: "bottom 70%",
              scrub: true,
            },
          }
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-cream relative z-10">
      <div className={`${PADX} pt-20 lg:pt-28 pb-24 lg:pb-32`}>
        {/* ── Header ─────────────────────────────────────────────── */}
        <span
          data-reveal
          className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-7"
        >
          <span aria-hidden className="w-8 h-px bg-gold" />
          {services.eyebrow}
        </span>
        <h2
          data-reveal
          className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05] max-w-3xl"
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

        {/* ── Pin grid ───────────────────────────────────────────── */}
        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* LEFT — sticky visual the rows scroll past */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] max-h-[34rem] w-full overflow-hidden rounded-[var(--radius-lg)] bg-brand-deep">
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(120% 90% at 65% 25%, #26432f 0%, #15271a 50%, #0a130d 100%)",
                  }}
                />
                {/* Active number — updates as you scroll */}
                <span
                  data-active-num
                  aria-hidden
                  className="absolute left-7 bottom-20 font-display font-light text-cream/90 leading-none"
                  style={{ fontSize: "8rem", letterSpacing: "-0.03em" }}
                >
                  01
                </span>
                <span
                  data-active-label
                  aria-hidden
                  className="absolute left-8 bottom-10 font-sans uppercase tracking-[0.22em] text-gold text-[length:var(--text-caption)]"
                >
                  {services.items[0]?.abbr}
                </span>
                {/* Progress rail */}
                <span
                  aria-hidden
                  className="absolute right-7 top-8 bottom-8 w-px bg-cream/15 overflow-hidden"
                >
                  <span
                    data-progress
                    className="absolute inset-x-0 top-0 h-full bg-gold origin-top"
                    style={{ transform: "scaleY(0)" }}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — service rows */}
          <div data-rows className="lg:col-span-7 lg:col-start-6 border-b border-line">
            {services.items.map((item, i) => (
              <Link
                key={item.abbr}
                href={`/${lang}/services`}
                data-row
                className="group relative block border-t border-line py-8 lg:py-10"
              >
                <div className="flex items-start gap-5 lg:gap-7">
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
        </div>

        {/* ── Footer link ────────────────────────────────────────── */}
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
