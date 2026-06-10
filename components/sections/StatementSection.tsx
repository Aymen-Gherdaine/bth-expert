"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

interface StatementSectionProps {
  lang: Locale;
}

/**
 * Statement environnemental — the page's DARK PUNCTUATION.
 * Full-bleed brand surface, left-aligned Fraunces statement with the
 * signature italic on "environnementale", line-by-line scroll reveal.
 * The right side is intentional dark empty space.
 */
export function StatementSection({ lang }: StatementSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const filetRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const heading = headingRef.current;
      if (!heading) return;

      // Split by LINES (more cinematic than words on a long statement),
      // mask each line so it rises out of a clipped band.
      const split = new SplitText(heading, { type: "lines", mask: "lines" });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: "top 68%", once: true },
      });

      tl.from(filetRef.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "expo.out",
      })
        .from(
          split.lines,
          { yPercent: 110, duration: 1, stagger: 0.12, ease: "expo.out" },
          "-=0.6"
        )
        .from(
          supportRef.current,
          { opacity: 0, y: 16, duration: 0.8, ease: "expo.out" },
          "-=0.15"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 12, duration: 0.7, ease: "expo.out" },
          "-=0.5"
        );

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-brand overflow-hidden">
      {/* Left padding mirrors the container; right side stays empty dark space */}
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-32 lg:py-48">
        <div className="max-w-[50rem]">
          {/* Gold filet — the single gold accent, traces in */}
          <span
            ref={filetRef}
            aria-hidden
            className="block w-20 h-px bg-gold mb-12 lg:mb-14"
          />

          <h2
            ref={headingRef}
            className="font-display font-light text-cream tracking-[-0.03em] leading-[1.06] text-[length:var(--text-display)]"
          >
            Chaque projet industriel commence par une question{" "}
            <span className="italic">environnementale</span>.
          </h2>

          <p
            ref={supportRef}
            className="mt-10 lg:mt-12 max-w-xl font-sans text-[length:var(--text-body)] text-[var(--color-on-brand-muted)] leading-[1.75]"
          >
            BTH Expert transforme vos obligations réglementaires en avantage
            concurrentiel — études conformes, livrables prêts à déposer.
          </p>

          <div ref={ctaRef} className="mt-10">
            <Link
              href={`/${lang}/services`}
              className="inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] text-gold tracking-tight hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              Découvrir nos services <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
