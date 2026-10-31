"use client";

import { SECTION_PX } from "@/components/layout/Container";
import { useRef, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { useNearViewport } from "@/components/motion/useNearViewport";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface StatItem {
  value: string;
  label: string;
  highlight?: boolean;
}

interface StatsContent {
  items: StatItem[];
}

interface StatsBandProps {
  stats: StatsContent;
}

/** Each digit slot is this many em tall — matches the line-height below. */
const SLOT_H = 1.1;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * True only on the client when motion is allowed. The server snapshot is
 * false, so the prerendered HTML carries the final value ("10+") — the text
 * crawlers index — and the 0–9 odometer stacks are mounted client-side only.
 */
function useCanAnimate(): boolean {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => !window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false
  );
}

function parseValue(value: string): { num: string; suffix: string; isNumeric: boolean } {
  const m = value.match(/^(\d+)(.*)$/);
  if (m) return { num: m[1], suffix: m[2], isNumeric: true };
  return { num: value, suffix: "", isNumeric: false };
}

/**
 * Credibility band — ink numerals, gold hairlines, odometer scroll on scroll-in.
 * Each digit slot contains a vertical stack of 0–9 and scrolls to its target
 * value: units settle first, tens next, hundreds last — natural counter feel.
 * Progressive enhancement: the server HTML renders the final digits only;
 * the stacks + animation are added on the client. Reduced-motion and no-JS
 * keep the static final value.
 */
export function StatsBand({ stats }: StatsBandProps) {
  const ref = useRef<HTMLElement>(null);
  const canAnimate = useCanAnimate();
  const near = useNearViewport(ref);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section || !canAnimate || !near) return;

      const cells = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-stat]"));

      // ── Cell entrance: fade + rise ─────────────────────────────────────
      gsap.from(cells, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      // Labels start hidden so they can reveal after the odometer settles
      const labels = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-stat-label]")
      );
      gsap.set(labels, { opacity: 0 });

      // ── Odometer: each digit scrolls to its value on scroll-in ─────────
      // Units stop first, hundreds stop last → natural mechanical counter feel.
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          cells.forEach((cell, cellIdx) => {
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
            // Label fades in after the longest digit has settled
            const label = cell.querySelector<HTMLElement>("[data-stat-label]");
            if (label) {
              const settleDuration = 1.0 + Math.max(0, tracks.length - 1) * 0.18;
              gsap.fromTo(
                label,
                { opacity: 0, y: 8 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  ease: "expo.out",
                  delay: settleDuration * 0.65 + cellIdx * 0.1,
                }
              );
            }
          });
        },
      });
    },
    { scope: ref, dependencies: [canAnimate, near], revertOnUpdate: true }
  );

  return (
    <section ref={ref} className="bg-cream-warm">
      <div className={`${SECTION_PX} py-16 lg:py-24`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8">
          {stats.items.map((s) => {
            const { num, suffix, isNumeric } = parseValue(s.value);
            const digits = num.split("");
            // A long word ("Accredited") at display size cannot fit a half
            // column on phones: give it the full row there.
            const wide = !isNumeric && s.value.length > 6;
            return (
              <div key={s.label} data-stat className={wide ? "col-span-2 lg:col-span-1" : undefined}>
                <span aria-hidden className="block w-11 h-px bg-gold-ink mb-6" />
                <div
                  className="block font-display font-light text-ink tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3rem, 4.5vw + 0.5rem, 5rem)", lineHeight: 1 }}
                >
                  {isNumeric ? (
                    /* Odometer slots — only for numeric values. role="img" makes
                       aria-label valid here and keeps screen readers on the real
                       value instead of the individual digit spans. */
                    <span role="img" aria-label={s.value} dir="ltr" className="inline-flex tabular-nums">
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
                            {canAnimate
                              ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                                  <span key={n} className="block">
                                    {n}
                                  </span>
                                ))
                              : digit}
                          </span>
                        </span>
                      ))}
                      {suffix && <span className="inline-block">{suffix}</span>}
                    </span>
                  ) : (
                    /* Plain text — non-numeric values (e.g. "Agréé", "Accredited") */
                    <span>{s.value}</span>
                  )}
                </div>
                <span
                  data-stat-label
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
