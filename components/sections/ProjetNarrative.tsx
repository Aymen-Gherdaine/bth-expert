"use client";

import { SECTION_PX } from "@/components/layout/Container";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Beat {
  label: string;
  body: string;
}

interface ProjetNarrativeProps {
  beats: Beat[];
}

/**
 * Case-study narrative as a three-beat editorial sequence (contexte →
 * intervention → résultat), replacing the flat divide-y. Each beat carries a
 * monumental gold index numeral and a giant ghost numeral filling the void
 * where a photo would normally sit (same Pentagram move as ProjectsSection).
 * A gold rail traces the column as you scroll; rows reveal on entry and the
 * active beat lights while the others dim. GSAP carries the narration and
 * falls back to a static, full-opacity read under prefers-reduced-motion.
 */
export function ProjetNarrative({ beats }: ProjetNarrativeProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-beat]")
      );

      // ── Per-beat reveal — border trace, then numeral → text cascade ──
      rows.forEach((row) => {
        const border = row.querySelector<HTMLElement>("[data-beat-border]");
        const bits = row.querySelectorAll<HTMLElement>("[data-beat-bit]");
        if (bits.length === 0) return;

        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        });
        if (border) {
          tl.from(border, { scaleX: 0, transformOrigin: "left center", duration: 0.9 });
        }
        tl.from(bits, { y: 24, opacity: 0, duration: 0.7, stagger: 0.1 }, border ? 0.3 : 0);
      });

      // ── Active-beat dim + gold rail — desktop only (rail hidden < lg) ──
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const fillEl = section.querySelector<HTMLElement>("[data-rail-fill]");
        const rail = section.querySelector<HTMLElement>("[data-rail]");

        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 58%",
            end: "bottom 58%",
            onToggle: (self) => {
              if (!self.isActive) return;
              rows.forEach((r, j) =>
                gsap.to(r, { opacity: j === i ? 1 : 0.4, duration: 0.4, ease: "power2.out" })
              );
            },
          });
        });

        if (fillEl && rail) {
          gsap.fromTo(
            fillEl,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: { trigger: rail, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-cream-soft">
      <div className={`${SECTION_PX} pt-16 lg:pt-24 pb-20 lg:pb-28`}>
        {/* Gold rail spine — traces the full sequence on scroll (desktop) */}
        <div className="relative lg:grid lg:grid-cols-12 lg:gap-x-8">
          <span
            data-rail
            aria-hidden
            className="hidden lg:block absolute start-[calc(8.333%-0.5px)] top-2 bottom-2 w-px bg-line"
          >
            <span
              data-rail-fill
              className="absolute inset-x-0 top-0 h-full bg-gold origin-top"
              style={{ transform: "scaleY(0)" }}
            />
          </span>

          <ol className="lg:col-span-12">
            {beats.map((beat, i) => {
              const num = String(i + 1).padStart(2, "0");
              return (
                <li
                  key={beat.label}
                  data-beat
                  className="group relative grid grid-cols-12 gap-x-4 lg:gap-x-8 items-start py-12 lg:py-20 first:pt-0"
                >
                  {/* Top filet — traces in on scroll, gold sweeps on hover */}
                  <span
                    data-beat-border
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-line first:hidden"
                  />
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 z-10 h-px bg-gold scale-x-0 ltr:origin-left rtl:origin-right transition-[scale] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                  />

                  {/* Ghost numeral — movement fills the void, no image */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute end-[2%] top-1/2 -translate-y-1/2 ltr:-translate-x-6 rtl:translate-x-6 hidden lg:block font-display font-light leading-none tabular-nums text-brand/[0.06] opacity-0 transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] group-hover:opacity-100 group-hover:translate-x-0"
                    style={{ fontSize: "clamp(7rem, 5rem + 8vw, 13rem)" }}
                  >
                    {num}
                  </span>

                  {/* Index numeral */}
                  <span
                    data-beat-bit
                    className="col-span-2 lg:col-span-1 font-display font-light text-gold leading-none tabular-nums"
                    style={{ fontSize: "clamp(1.5rem, 1rem + 1.4vw, 2.25rem)" }}
                  >
                    <span className="inline-block transition-[scale] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:scale-[1.08]">
                      {num}
                    </span>
                  </span>

                  {/* Label */}
                  <h2
                    data-beat-bit
                    className="col-span-10 lg:col-span-3 lg:col-start-3 mt-1 lg:mt-0 font-display font-light text-ink tracking-[-0.02em] leading-[1.12] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                    style={{ fontSize: "var(--text-h2)" }}
                  >
                    {beat.label}
                  </h2>

                  {/* Body */}
                  <div
                    data-beat-bit
                    className="relative z-10 col-span-12 col-start-1 lg:col-span-6 lg:col-start-7 mt-6 lg:mt-0"
                  >
                    <p
                      className="font-sans text-ink-soft leading-[1.8]"
                      style={{ fontSize: "clamp(1.0625rem, 0.4vw + 0.95rem, 1.25rem)" }}
                    >
                      {beat.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
