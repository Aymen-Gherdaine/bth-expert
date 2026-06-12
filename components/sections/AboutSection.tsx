"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

interface AboutSectionProps {
  lang: Locale;
}

const STATS = [
  { value: "2009", label: "Année de fondation" },
  { value: "17", label: "Années d'expertise" },
  { value: "3", label: "Domaines d'intervention" },
];

export function AboutSection({ lang }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const section = sectionRef.current;
      if (!section) return;

      let split: SplitText | null = null;

      // ── Gold traced line (accent) ──────────────────────────────────
      const line = lineRef.current;
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.4,
            ease: "expo.out",
            scrollTrigger: { trigger: line, start: "top 85%", once: true },
          }
        );
      }

      // ── Text reveal — staggered eyebrow→title→body→CTA ─────────────
      const eyebrow  = section.querySelector<HTMLElement>("[data-about-eyebrow]");
      const titleEl  = section.querySelector<HTMLElement>("[data-about-title]");
      const bodies   = section.querySelectorAll<HTMLElement>("[data-about-body]");
      const cta      = section.querySelector<HTMLElement>("[data-about-cta]");

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      if (eyebrow) tl.from(eyebrow, { y: 16, opacity: 0, duration: 0.7 }, 0);

      // Title — word-by-word rise (same engine as RevealText).
      if (titleEl) {
        split = new SplitText(titleEl, { type: "words" });
        tl.from(
          split.words,
          { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.05 },
          0.1
        );
      }

      if (bodies.length) {
        tl.from(bodies, { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.4);
      }

      if (cta) tl.from(cta, { y: 16, opacity: 0, duration: 0.7 }, 0.55);

      // ── Image — clip-reveal, settle-in zoom, scroll parallax ───────
      const imgWrap  = section.querySelector<HTMLElement>("[data-about-image]");
      const imgInner = section.querySelector<HTMLElement>("[data-about-image-inner]");
      if (imgWrap && imgInner) {
        gsap.fromTo(
          imgWrap,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            duration: 1.4,
            ease: "expo.inOut",
            scrollTrigger: { trigger: imgWrap, start: "top 78%", once: true },
          }
        );
        gsap.fromTo(
          imgInner,
          { scale: 1.15 },
          {
            scale: 1,
            duration: 2.2,
            ease: "expo.out",
            scrollTrigger: { trigger: imgWrap, start: "top 78%", once: true },
          }
        );
        // Inner layer is oversized vertically (±8%) so the travel never shows an edge.
        gsap.fromTo(
          imgInner,
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: imgWrap,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // ── Stats — rise + count cadence ───────────────────────────────
      const stats = section.querySelectorAll<HTMLElement>("[data-about-stat]");
      if (stats.length) {
        gsap.from(stats, {
          y: 44,
          opacity: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.14,
          scrollTrigger: { trigger: stats[0], start: "top 88%", once: true },
        });
      }

      // ── Curtain-up retreat as Services scrolls over (parallax) ──────
      const mm = gsap.matchMedia();

      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          section,
          { y: 0, borderRadius: "0 0 0 0" },
          {
            y: "-12%",
            borderRadius: "0 0 10px 10px",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.fromTo(
          section,
          { y: 0, borderRadius: "0 0 0 0" },
          {
            y: "-10%",
            borderRadius: "0 0 14px 14px",
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });

      return () => {
        split?.revert();
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  return (
    // No explicit z-index — DOM order (ServicesList comes after) handles stacking
    <section
      ref={sectionRef}
      className="bg-cream-warm overflow-hidden"
    >
      <div className="w-full px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-24 lg:py-32">

        {/* Gold traced line */}
        <div
          ref={lineRef}
          className="h-px mb-14 lg:mb-16"
          style={{ backgroundColor: "var(--color-gold)", opacity: 0.35 }}
        />

        {/* Eyebrow + oversized editorial statement */}
        <span
          data-about-eyebrow
          className="block font-sans uppercase text-gold mb-8"
          style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
        >
          À PROPOS
        </span>
        <h2
          data-about-title
          className="font-display font-light text-ink tracking-[-0.025em] leading-[1.08] max-w-5xl"
          style={{ fontSize: "clamp(2.5rem, 4.5vw + 0.5rem, 4.75rem)" }}
        >
          Un bureau d&apos;études agréé par le Ministère de
          l&apos;Environnement
        </h2>

        {/* Image bleeding to the left viewport edge + text column right */}
        <div className="mt-16 lg:mt-24 lg:grid lg:grid-cols-12 lg:gap-16">

          <div className="lg:col-span-7 mb-12 lg:mb-0">
            <div
              data-about-image
              className="relative overflow-hidden aspect-[3/2] lg:aspect-[16/11] -ms-5 -me-5 sm:-ms-6 sm:-me-6 md:-ms-8 md:-me-8 lg:-ms-10 lg:me-0 xl:-ms-12 2xl:-ms-16"
            >
              {/* Oversized inner layer (±8%) gives the parallax travel headroom */}
              <div
                data-about-image-inner
                className="absolute inset-x-0"
                style={{ top: "-8%", bottom: "-8%" }}
              >
                <Image
                  src="/about-field.webp"
                  alt="Opérateur industriel sur site, contre-jour dans la vapeur"
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <p
              data-about-body
              className="font-sans text-ink-soft leading-[1.75] mb-5"
              style={{ fontSize: "var(--text-body)" }}
            >
              BTH Expert est une société agréée de conseil et
              d&apos;ingénierie environnementale, intervenant dans les
              domaines de l&apos;environnement, de la sécurité et de
              l&apos;hygiène en région Ouest algérienne.
            </p>
            <p
              data-about-body
              className="font-sans text-ink-soft leading-[1.75] mb-10"
              style={{ fontSize: "var(--text-body)" }}
            >
              Fondé en 2009, le bureau accompagne les industriels dans leur
              mise en conformité réglementaire — études d&apos;impact,
              audits HSE, plans de gestion environnementale — avec des
              livrables prêts à déposer auprès des autorités compétentes.
            </p>
            <Link
              data-about-cta
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              En savoir plus <span aria-hidden>→</span>
            </Link>
          </div>

        </div>

        {/* Stat band — oversized serif numerals, hairline-ruled */}
        <div className="mt-20 lg:mt-28 grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-10">
          {STATS.map((s) => (
            <div key={s.label} data-about-stat>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--color-gold)", opacity: 0.35 }}
              />
              <span
                className="block font-display font-light text-ink leading-none tracking-[-0.03em]"
                style={{ fontSize: "clamp(3.5rem, 5.5vw + 1rem, 6.5rem)" }}
              >
                {s.value}
              </span>
              <span
                className="mt-4 block font-sans uppercase text-ink-soft"
                style={{ fontSize: "var(--text-caption)", letterSpacing: "0.18em" }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
