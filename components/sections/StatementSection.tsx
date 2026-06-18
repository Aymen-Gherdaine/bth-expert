"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

interface StatementSectionProps {
  lang: Locale;
}

/**
 * Statement environnemental — white editorial pause before the dark map.
 * Left-aligned Fraunces statement with the signature italic on
 * "environnementale", line-by-line scroll reveal. The right side carries
 * a photo that reveals via clip-path wipe + settle-scale, with a light
 * scroll parallax on desktop.
 */
export function StatementSection({ lang }: StatementSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const filetRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const supportRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const photoInnerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const heading = headingRef.current;
      const photo = photoRef.current;
      const photoInner = photoInnerRef.current;
      if (!heading || !photo || !photoInner) return;

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
        // Photo: clip-path wipe from the left + inner image settles from 1.15
        .fromTo(
          photo,
          { clipPath: "inset(0 100% 0 0)" },
          { clipPath: "inset(0 0% 0 0)", duration: 1.3, ease: "expo.inOut" },
          "-=0.9"
        )
        .fromTo(
          photoInner,
          { scale: 1.15 },
          { scale: 1, duration: 1.6, ease: "expo.out" },
          "<"
        )
        .from(
          supportRef.current,
          { opacity: 0, y: 16, duration: 0.8, ease: "expo.out" },
          "-=1.2"
        )
        .from(
          ctaRef.current,
          { opacity: 0, y: 12, duration: 0.7, ease: "expo.out" },
          "-=0.5"
        );

      // Light scroll parallax on the photo, desktop only
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          photoInner,
          { yPercent: -4 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: photo,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        split.revert();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-cream-warm overflow-hidden">
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-28 lg:py-40">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center">
          {/* ── Statement ── */}
          <div className="lg:col-span-6">
            {/* Gold filet — the single gold accent, traces in */}
            <span
              ref={filetRef}
              aria-hidden
              className="block w-20 h-px bg-gold mb-12 lg:mb-14"
            />

            <h2
              ref={headingRef}
              className="font-display font-light text-ink tracking-[-0.03em] leading-[1.06] text-[length:var(--text-display)]"
            >
              Chaque projet industriel commence par une question{" "}
              <span className="italic">environnementale</span>.
            </h2>

            <p
              ref={supportRef}
              className="mt-10 lg:mt-12 max-w-xl font-sans text-[length:var(--text-body)] text-ink-soft leading-[1.75]"
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

          {/* ── Photo — clip-path wipe reveal, light parallax ── */}
          <div className="mt-14 lg:mt-0 lg:col-span-5 lg:col-start-8">
            <div
              ref={photoRef}
              className="relative aspect-[4/5] max-h-[34rem] w-full overflow-hidden rounded-sm"
            >
              {/* Oversized inner layer: slack for the parallax travel + settle-scale */}
              <div ref={photoInnerRef} className="absolute inset-[-6%]">
                <Image
                  src="/cimenterie-algerie.webp"
                  alt="Complexe industriel en Algérie — études environnementales BTH Expert"
                  fill
                  quality={75}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
