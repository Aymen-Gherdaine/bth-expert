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

/** Split "200+" → { num: "200", suffix: "+" } so the count-up animates the
 *  numeral and re-appends the suffix at the end. */
function parseValue(value: string): { num: string; suffix: string } {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { num: m[1], suffix: m[2] } : { num: value, suffix: "" };
}

/**
 * Credibility band right after the hero (manifesto §2 signature): ink
 * numerals over warm cream, gold hairlines, count-up on scroll-in.
 * prefers-reduced-motion shows the final figures with no animation.
 */
export function StatsBand({ stats }: StatsBandProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = ref.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cells = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-stat]"));
      gsap.from(cells, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        stagger: 0.12,
        scrollTrigger: { trigger: section, start: "top 82%", once: true },
      });

      const nums = section.querySelectorAll<HTMLElement>("[data-num]");
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => {
          nums.forEach((el) => {
            const target = parseFloat(el.dataset.target || "0");
            const suffix = el.dataset.suffix || "";
            const obj = { v: 0 };
            gsap.to(obj, {
              v: target,
              duration: 1.5,
              ease: "expo.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.v));
              },
              onComplete: () => {
                el.textContent = String(target) + suffix;
              },
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
            return (
              <div key={s.label} data-stat>
                <span aria-hidden className="block w-11 h-px bg-gold mb-6" />
                <span
                  data-num
                  data-target={num}
                  data-suffix={suffix}
                  className="block font-display font-light text-ink leading-none tracking-[-0.03em]"
                  style={{ fontSize: "clamp(3rem, 4.5vw + 0.5rem, 5rem)" }}
                >
                  {s.value}
                </span>
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
