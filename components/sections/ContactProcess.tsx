"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Container } from "@/components/layout/Container";
import type { Dictionary } from "@/lib/i18n";

void ScrollTrigger;

type ProcessDict = Dictionary["contact"]["process"];

interface ContactProcessProps {
  dict: ProcessDict;
}

export function ContactProcess({ dict }: ContactProcessProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const section = sectionRef.current;
      if (!section) return;

      const steps = section.querySelectorAll<HTMLElement>("[data-step]");
      const mm = gsap.matchMedia();

      // Desktop: gold line traces left→right, steps reveal as it passes them.
      mm.add("(min-width: 1024px)", () => {
        const line = section.querySelector<HTMLElement>("[data-line-h]");
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: section, start: "top 75%", once: true },
        });

        if (line) {
          tl.fromTo(
            line,
            { scaleX: 0, transformOrigin: "left center" },
            { scaleX: 1, duration: 1.8, ease: "power2.inOut" },
            0
          );
        }
        tl.from(
          steps,
          { y: 28, opacity: 0, duration: 0.9, stagger: 0.4 },
          0.1
        );
      });

      // Mobile: vertical line traces top→bottom alongside the stacked steps.
      mm.add("(max-width: 1023px)", () => {
        const line = section.querySelector<HTMLElement>("[data-line-v]");
        const tl = gsap.timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: section, start: "top 80%", once: true },
        });

        if (line) {
          tl.fromTo(
            line,
            { scaleY: 0, transformOrigin: "top center" },
            { scaleY: 1, duration: 1.8, ease: "power2.inOut" },
            0
          );
        }
        tl.from(
          steps,
          { y: 24, opacity: 0, duration: 0.8, stagger: 0.35 },
          0.1
        );
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-cream-warm overflow-hidden">
      <Container>
        <div className="py-24 lg:py-32">
          <span
            className="block font-sans uppercase text-gold mb-6"
            style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
          >
            — {dict.eyebrow}
          </span>
          <h2
            className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15]"
            style={{ fontSize: "var(--text-h2)" }}
          >
            {dict.heading}
          </h2>

          <div className="relative mt-16 lg:mt-20">
            {/* Desktop: horizontal gold line connecting the 4 steps */}
            <div
              data-line-h
              aria-hidden
              className="hidden lg:block absolute top-0 inset-x-0 h-px bg-gold/50"
            />
            {/* Mobile: vertical gold line alongside the stacked steps */}
            <div
              data-line-v
              aria-hidden
              className="lg:hidden absolute top-0 bottom-0 start-0 w-px bg-gold/50"
            />

            <ol className="ps-8 lg:ps-0 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-10">
              {dict.steps.map((step) => (
                <li key={step.number} data-step className="lg:pt-10">
                  <span
                    className="block font-display text-gold mb-4"
                    style={{ fontSize: "1.75rem", letterSpacing: "0.02em" }}
                  >
                    {step.number}
                  </span>
                  <h3
                    className="font-display font-medium text-ink tracking-[-0.01em] mb-3"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-sans text-ink-soft text-[var(--text-small)] leading-[1.7]">
                    {step.description}
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
