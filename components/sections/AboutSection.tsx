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

      // ── Eyebrow ────────────────────────────────────────────────────
      const eyebrow = section.querySelector<HTMLElement>("[data-about-eyebrow]");
      if (eyebrow) {
        gsap.from(eyebrow, {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: eyebrow, start: "top 85%", once: true },
        });
      }

      // ── Manifesto — words light up one by one as the user scrolls ──
      const manifesto = section.querySelector<HTMLElement>("[data-about-manifesto]");
      if (manifesto) {
        split = new SplitText(manifesto, { type: "words" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: manifesto,
              start: "top 80%",
              end: "top 25%",
              scrub: true,
            },
          }
        );
      }

      // ── Image — quiet reveal ───────────────────────────────────────
      const figure = section.querySelector<HTMLElement>("[data-about-figure]");
      if (figure) {
        gsap.from(figure, {
          y: 36,
          opacity: 0,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: { trigger: figure, start: "top 85%", once: true },
        });
      }

      // ── Body + CTA — quiet rise once the manifesto is read ─────────
      const bodies = section.querySelectorAll<HTMLElement>("[data-about-body]");
      const cta    = section.querySelector<HTMLElement>("[data-about-cta]");
      if (bodies.length) {
        gsap.from(bodies, {
          y: 24,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.15,
          scrollTrigger: { trigger: bodies[0], start: "top 85%", once: true },
        });
      }
      if (cta) {
        gsap.from(cta, {
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: { trigger: cta, start: "top 90%", once: true },
        });
      }

      // ── Stats — rise in sequence ───────────────────────────────────
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
    // Night section, GISI-style — the page stays dark after the hero,
    // light arrives with Services. DOM order handles stacking.
    <section
      ref={sectionRef}
      className="bg-brand-deep overflow-hidden"
    >
      <div className="w-full px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-28 lg:py-40">

        {/* Gold traced line */}
        <div
          ref={lineRef}
          className="h-px mb-14 lg:mb-16"
          style={{ backgroundColor: "var(--color-gold)", opacity: 0.3 }}
        />

        <span
          data-about-eyebrow
          className="block font-sans uppercase text-gold mb-10"
          style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
        >
          À PROPOS
        </span>

        {/* Manifesto — cream words light up over the night green */}
        <h2
          data-about-manifesto
          className="font-display font-light text-cream tracking-[-0.025em] leading-[1.16] max-w-6xl"
          style={{ fontSize: "clamp(2rem, 3.2vw + 0.75rem, 3.9rem)" }}
        >
          Un bureau d&apos;études agréé par le Ministère de
          l&apos;Environnement, au service de l&apos;industrie algérienne
          depuis 2009 — pour que chaque projet avance, en conformité.
        </h2>

        {/* Figure + supporting copy — small captioned image, GISI restraint */}
        <div className="mt-20 lg:mt-28 lg:grid lg:grid-cols-12 lg:gap-16">

          <figure data-about-figure className="lg:col-span-4 mb-14 lg:mb-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src="/about-industry.webp"
                alt="Silhouette d'un complexe industriel au crépuscule"
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                quality={80}
                className="object-cover"
              />
            </div>
            <figcaption
              className="mt-4 font-sans"
              style={{
                fontSize: "var(--text-caption)",
                color: "var(--color-on-brand-faint)",
                letterSpacing: "0.04em",
              }}
            >
              L&apos;industrie et son environnement — le cœur de notre métier
            </figcaption>
          </figure>

          <div className="lg:col-span-5 lg:col-start-7 flex flex-col justify-center">
            <p
              data-about-body
              className="font-sans leading-[1.75] mb-5"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-on-brand-muted)",
              }}
            >
              BTH Expert est une société agréée de conseil et
              d&apos;ingénierie environnementale, intervenant dans les
              domaines de l&apos;environnement, de la sécurité et de
              l&apos;hygiène en région Ouest algérienne.
            </p>
            <p
              data-about-body
              className="font-sans leading-[1.75] mb-10"
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-on-brand-muted)",
              }}
            >
              Études d&apos;impact, audits HSE, plans de gestion
              environnementale — des livrables rigoureux, prêts à déposer
              auprès des autorités compétentes.
            </p>
            <Link
              data-about-cta
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-2 text-cream text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              En savoir plus <span aria-hidden>→</span>
            </Link>
          </div>

        </div>

        {/* Stat band — cream numerals over night green, gold hairlines */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-10">
          {STATS.map((s) => (
            <div key={s.label} data-about-stat>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--color-gold)", opacity: 0.3 }}
              />
              <span
                className="block font-display font-light text-cream leading-none tracking-[-0.03em]"
                style={{ fontSize: "clamp(3.5rem, 5.5vw + 1rem, 6.5rem)" }}
              >
                {s.value}
              </span>
              <span
                className="mt-4 block font-sans uppercase"
                style={{
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.18em",
                  color: "var(--color-on-brand-faint)",
                }}
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
