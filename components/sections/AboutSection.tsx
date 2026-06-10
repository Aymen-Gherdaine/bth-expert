"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

interface AboutSectionProps {
  lang: Locale;
}

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

      // ── Text reveal — column rise + staggered eyebrow→title→body→CTA ─
      const cols     = section.querySelectorAll<HTMLElement>("[data-about-col]");
      const eyebrow  = section.querySelector<HTMLElement>("[data-about-eyebrow]");
      const titleEl  = section.querySelector<HTMLElement>("[data-about-title]");
      const bodies   = section.querySelectorAll<HTMLElement>("[data-about-body]");
      const cta       = section.querySelector<HTMLElement>("[data-about-cta]");

      const tl = gsap.timeline({
        defaults: { ease: "expo.out" },
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      // Whole text column: subtle translateY + fade as it enters.
      tl.from(cols, { y: 30, opacity: 0, duration: 0.9 }, 0);

      // Eyebrow first.
      if (eyebrow) tl.from(eyebrow, { y: 16, opacity: 0, duration: 0.7 }, 0);

      // Title — word-by-word reveal (same engine as RevealText).
      if (titleEl) {
        split = new SplitText(titleEl, { type: "words" });
        tl.from(
          split.words,
          { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.05 },
          0.1
        );
      }

      // Body — fade + translateY, lightly staggered.
      if (bodies.length) {
        tl.from(bodies, { y: 20, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.3);
      }

      // CTA last.
      if (cta) tl.from(cta, { y: 16, opacity: 0, duration: 0.7 }, 0.45);

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
      className="bg-cream-warm min-h-screen flex flex-col justify-center overflow-hidden"
    >
      <div className="w-full px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-24 lg:py-32">

        {/* Gold traced line */}
        <div
          ref={lineRef}
          className="h-px mb-16 lg:mb-20"
          style={{ backgroundColor: "var(--color-gold)", opacity: 0.35 }}
        />

        <div className="lg:grid lg:grid-cols-12 lg:gap-16">

          {/* Left: eyebrow + heading */}
          <div data-about-col className="lg:col-span-5 mb-12 lg:mb-0">
            <span
              data-about-eyebrow
              className="block font-sans uppercase text-gold mb-8"
              style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
            >
              À PROPOS
            </span>
            <h2
              data-about-title
              className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2]"
              style={{ fontSize: "var(--text-h2)" }}
            >
              Un bureau d&apos;études agréé par le Ministère de
              l&apos;Environnement
            </h2>
          </div>

          {/* Right: body + CTA */}
          <div
            data-about-col
            className="lg:col-span-6 lg:col-start-7 flex flex-col justify-end"
          >
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
      </div>
    </section>
  );
}
