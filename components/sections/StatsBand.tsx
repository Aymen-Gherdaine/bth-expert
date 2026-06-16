"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface StatItem {
  value: string;
  label: string;
  highlight?: boolean;
}

interface StatsContent {
  eyebrow?: string;
  items: StatItem[];
}

interface StatsBandProps {
  stats: StatsContent;
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

/** Each digit slot is this many em tall — matches the line-height below. */
const SLOT_H = 1.1;

function parseValue(value: string): { num: string; suffix: string } {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { num: m[1], suffix: m[2] } : { num: value, suffix: "" };
}

/**
 * Credibility band — ink numerals, gold hairlines, odometer scroll on scroll-in.
 * Each digit slot contains a vertical stack of 0–9 and scrolls to its target
 * value: units settle first, tens next, hundreds last — natural counter feel.
 * Reduced-motion: slots jump directly to their final position (no animation).
 */
export function StatsBand({ stats }: StatsBandProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const cells = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-stat]"));

      // ── Reduced-motion: snap slots to final positions immediately ──────
      if (reduced) {
        section.querySelectorAll<HTMLElement>("[data-digit-track]").forEach((track) => {
          const target = parseInt(track.dataset.target ?? "0");
          gsap.set(track, { y: `${-(target * SLOT_H)}em` });
        });
        return;
      }

      // ── Cell entrance: fade + rise ─────────────────────────────────────
      gsap.from(cells, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      // ── Odometer: each digit scrolls to its value on scroll-in ─────────
      // Units stop first, hundreds stop last → natural mechanical counter feel.
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          cells.forEach((cell) => {
            const tracks = cell.querySelectorAll<HTMLElement>("[data-digit-track]");
            tracks.forEach((track, i) => {
              const target = parseInt(track.dataset.target ?? "0");
              // Rightmost digit (highest i) settles first (shortest duration)
              const duration = 1.0 + (tracks.length - 1 - i) * 0.18;
              gsap.fromTo(
                track,
                { y: 0 },
                { y: `${-(target * SLOT_H)}em`, duration, ease: "expo.out" }
              );
            });
          });
        },
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="bg-cream-warm">
      <div className={`${PADX} py-16 lg:py-24`}>
        {stats.eyebrow && (
          <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-12">
            <span aria-hidden className="w-8 h-px bg-gold" />
            {stats.eyebrow}
          </span>
        )}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {stats.items.map((s) => {
            const { num, suffix } = parseValue(s.value);
            const digits = num.split("");
            return (
              <div key={s.label} data-stat>
                <span aria-hidden className="block w-11 h-px bg-gold mb-6" />
                <div
                  className="block font-display font-light text-ink tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3rem, 4.5vw + 0.5rem, 5rem)", lineHeight: 1 }}
                >
                  {/* Screen-reader value (the visual slots are aria-hidden) */}
                  <span className="sr-only">{s.value}</span>

                  {/* Odometer slots */}
                  <span aria-hidden className="inline-flex tabular-nums">
                    {digits.map((digit, i) => (
                      <span
                        key={i}
                        className="inline-block overflow-hidden"
                        style={{ height: `${SLOT_H}em`, verticalAlign: "top" }}
                      >
                        <span
                          data-digit-track
                          data-target={digit}
                          className="block"
                          style={{ lineHeight: SLOT_H }}
                        >
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                            <span key={n} className="block">
                              {n}
                            </span>
                          ))}
                        </span>
                      </span>
                    ))}
                    {suffix && <span className="inline-block">{suffix}</span>}
                  </span>
                </div>
                <span
                  className="mt-4 block font-sans uppercase text-muted"
                  style={{ fontSize: "var(--text-caption)", letterSpacing: "0.16em" }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
