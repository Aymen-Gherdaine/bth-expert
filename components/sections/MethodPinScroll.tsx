"use client";

import { SECTION_PX } from "@/components/layout/Container";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface Step {
  number: string;
  title: string;
  description: string;
}

interface MethodPinScrollProps {
  heading: string;
  steps: Step[];
  image?: string;
  /** Localised "Méthode" eyebrow shown over the sticky image. */
  methodLabel: string;
}

/**
 * Methodology as the signature pin-scroll (manifesto Pattern 1): a sticky
 * image panel holds while the steps scroll past it. GSAP carries the
 * narration — the active step number crossfades, inactive steps dim, a gold
 * rail traces progress. This is the image-led moment of the otherwise light
 * service page. Reduced-motion falls back to a static two-column.
 */
export function MethodPinScroll({
  heading,
  steps,
  image = "/hero.webp",
  methodLabel,
}: MethodPinScrollProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

      if (reduce) return;

      const rows = gsap.utils.toArray<HTMLElement>(section.querySelectorAll("[data-step]"));

      // ── Step reveal — every viewport ───────────────────────────────
      rows.forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 24,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
          onComplete: () => gsap.set(row, { clearProps: "opacity,transform" }),
        });
      });

      // ── Pin choreography — desktop only (sticky panel is hidden < lg).
      // On mobile the steps simply stack and read at full opacity.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const numEl = section.querySelector<HTMLElement>("[data-active-num]");
        const fillEl = section.querySelector<HTMLElement>("[data-progress]");

        const setActive = (i: number) => {
          rows.forEach((r, j) =>
            gsap.to(r, { opacity: j === i ? 1 : 0.32, duration: 0.4, ease: "power2.out" })
          );
          if (numEl) {
            numEl.textContent = steps[i]?.number ?? String(i + 1).padStart(2, "0");
            gsap.fromTo(
              numEl,
              { opacity: 0, yPercent: 12 },
              { opacity: 1, yPercent: 0, duration: 0.5, ease: "expo.out" }
            );
          }
        };

        rows.forEach((row, i) => {
          ScrollTrigger.create({
            trigger: row,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (self.isActive) setActive(i);
            },
          });
        });

        setActive(0);

        const rightCol = section.querySelector<HTMLElement>("[data-steps]");
        if (fillEl && rightCol) {
          gsap.fromTo(
            fillEl,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top center",
              scrollTrigger: { trigger: rightCol, start: "top 60%", end: "bottom 70%", scrub: true },
            }
          );
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-cream relative z-10">
      <div className={`${SECTION_PX} py-20 lg:py-28`}>
        <span
          data-reveal
          className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-7"
        >
          <span aria-hidden className="w-8 h-px bg-gold" />
          {heading}
        </span>

        <div className="mt-10 lg:mt-14 lg:grid lg:grid-cols-12 lg:gap-14 xl:gap-16">
          {/* Image band on mobile, sticky panel the steps scroll past on desktop */}
          <div className="lg:col-span-5 mb-12 lg:mb-0">
            <div className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/2] lg:aspect-[4/5] max-h-[30rem] w-full overflow-hidden rounded-[var(--radius-lg)] bg-brand-deep">
                <Image
                  src={image}
                  alt=""
                  fill
                  quality={75}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover opacity-70"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgb(10 22 13 / 0.45) 0%, rgb(8 14 9 / 0.82) 100%)",
                  }}
                />
                {/* Big active number — desktop only; on mobile there is no
                    pin to drive it, so it would freeze on "01" and read as a
                    broken "step 1" label over the banner. */}
                <span
                  data-active-num
                  aria-hidden
                  className="hidden lg:block absolute start-7 bottom-12 font-display font-light text-cream/90 leading-none"
                  style={{ fontSize: "8rem", letterSpacing: "-0.03em" }}
                >
                  {steps[0]?.number ?? "01"}
                </span>
                <span
                  aria-hidden
                  className="absolute start-8 bottom-8 font-sans uppercase tracking-[0.22em] text-gold text-[length:var(--text-caption)]"
                >
                  {methodLabel}
                </span>
                <span
                  aria-hidden
                  className="hidden lg:block absolute end-7 top-8 bottom-8 w-px bg-cream/15 overflow-hidden"
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

          {/* Steps */}
          <div data-steps className="lg:col-span-7 lg:col-start-6 border-b border-line">
            {steps.map((step) => (
              <div key={step.number} data-step className="border-t border-line py-8 lg:py-14">
                <div className="flex items-start gap-5 lg:gap-7">
                  <span className="shrink-0 pt-1.5 w-9 font-display text-gold leading-none text-[length:var(--text-small)] tabular-nums">
                    {step.number}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-2.5 max-w-md font-sans text-muted leading-[1.6] text-[length:var(--text-small)]">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
