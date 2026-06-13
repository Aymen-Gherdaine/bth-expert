"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";

void ScrollTrigger;

interface Milestone {
  year: string;
  title: string;
  description: string;
}

interface AboutTimelineProps {
  eyebrow: string;
  heading: string;
  milestones: Milestone[];
}

/**
 * Vertical history timeline on the deep-green band. A gold rail draws
 * top→bottom as the section enters the viewport, milestones reveal in
 * sequence. Logical properties (start/ps) keep it RTL-correct. Honours
 * prefers-reduced-motion (renders fully, no animation).
 */
export function AboutTimeline({ eyebrow, heading, milestones }: AboutTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const section = sectionRef.current;
      if (!section) return;

      const line = section.querySelector<HTMLElement>("[data-line]");
      const items = section.querySelectorAll<HTMLElement>("[data-milestone]");
      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: section, start: "top 70%", once: true },
      });

      if (line) {
        tl.fromTo(
          line,
          { scaleY: 0, transformOrigin: "top center" },
          { scaleY: 1, duration: 1.6, ease: "power2.inOut" },
          0
        );
      }
      tl.from(items, { y: 28, opacity: 0, duration: 0.8, stagger: 0.22 }, 0.15);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-brand-deep text-cream overflow-hidden">
      <Container>
        <div className="py-24 lg:py-32">
          <span
            className="block font-sans uppercase text-gold mb-6"
            style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
          >
            — {eyebrow}
          </span>
          <h2
            className="font-display font-light tracking-[-0.02em] leading-[1.15] text-[var(--color-on-brand-strong)] mb-16 lg:mb-20"
            style={{ fontSize: "var(--text-h2)" }}
          >
            {heading}
          </h2>

          <div className="relative">
            <div
              data-line
              aria-hidden
              className="absolute start-[5px] top-3 bottom-3 w-px bg-gold/30"
            />
            <ol className="space-y-12 lg:space-y-16">
              {milestones.map((m) => (
                <li key={m.year} data-milestone className="relative ps-10">
                  <span
                    aria-hidden
                    className="absolute start-0 top-1.5 size-[11px] rounded-full border-2 border-gold bg-brand-deep"
                  />
                  <span
                    className="block font-display text-gold mb-1.5"
                    style={{ fontSize: "1.5rem", letterSpacing: "0.01em" }}
                  >
                    {m.year}
                  </span>
                  <h3
                    className="font-display font-medium tracking-[-0.01em] text-[var(--color-on-brand-strong)] mb-2"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {m.title}
                  </h3>
                  <p
                    className="font-sans text-[var(--color-on-brand-muted)] leading-[1.7] max-w-2xl"
                    style={{ fontSize: "var(--text-body)" }}
                  >
                    {m.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Container>
    </section>
  );
}
