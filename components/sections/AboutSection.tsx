"use client";

import { useRef } from "react";
import Link from "next/link";
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

      // ── Manifesto — words ink in one by one as the user scrolls ────
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

      // ── Domain rows — hairline traces in, then label rises ─────────
      const domains = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-about-domain]")
      );
      domains.forEach((row, i) => {
        const rule  = row.querySelector<HTMLElement>("[data-domain-rule]");
        const label = row.querySelector<HTMLElement>("[data-domain-label]");
        if (!rule || !label) return;
        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: row, start: "top 88%", once: true },
          })
          .from(rule, { scaleX: 0, transformOrigin: "left center", duration: 0.9 }, i * 0.05)
          .from(label, { opacity: 0, y: 18, duration: 0.7 }, i * 0.05 + 0.25);
      });

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
            y: "-6%",
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
            y: "-5%",
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
    // Cream credential section — the warm body opens here, right after the
    // cinematic hero. Dark green is reserved for punctuation (hero, zones).
    <section
      ref={sectionRef}
      className="bg-cream-soft overflow-hidden"
    >
      <div className="w-full px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-28 lg:py-40">

        {/* Gold traced line */}
        <div
          ref={lineRef}
          className="h-px mb-14 lg:mb-16"
          style={{ backgroundColor: "var(--color-gold)", opacity: 0.5 }}
        />

        <span
          data-about-eyebrow
          className="block font-sans uppercase text-gold mb-10"
          style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
        >
          À PROPOS
        </span>

        {/* Manifesto — ink words light up over the warm cream */}
        <h2
          data-about-manifesto
          className="font-display font-light text-ink tracking-[-0.025em] leading-[1.16] max-w-6xl"
          style={{ fontSize: "clamp(2rem, 3.2vw + 0.75rem, 3.9rem)" }}
        >
          Un bureau d&apos;études agréé par le Ministère de
          l&apos;Environnement, au service de l&apos;industrie algérienne
          depuis 2009 — pour que chaque projet avance, en conformité.
        </h2>

        {/* Domains index + supporting copy — typography only, no imagery */}
        <div className="mt-20 lg:mt-28 lg:grid lg:grid-cols-12 lg:gap-16">

          <div className="lg:col-span-5 mb-14 lg:mb-0">
            {[
              "Environnement",
              "Sécurité industrielle",
              "Hygiène & santé au travail",
            ].map((domain, i) => (
              <div key={domain} data-about-domain className="py-6 lg:py-7">
                <div
                  data-domain-rule
                  className="h-px mb-6"
                  style={{ backgroundColor: "var(--color-line)" }}
                />
                <div data-domain-label className="flex items-baseline gap-5">
                  <span
                    className="font-display text-gold tabular-nums"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="font-display font-light text-ink tracking-[-0.02em]"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {domain}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 lg:col-start-8 flex flex-col justify-center">
            <p
              data-about-body
              className="font-sans leading-[1.7] mb-6"
              style={{
                fontSize: "clamp(1.0625rem, 0.5vw + 0.95rem, 1.3125rem)",
                color: "var(--color-ink-soft)",
              }}
            >
              BTH Expert est une société agréée de conseil et
              d&apos;ingénierie environnementale, intervenant dans les
              domaines de l&apos;environnement, de la sécurité et de
              l&apos;hygiène en région Ouest algérienne.
            </p>
            <p
              data-about-body
              className="font-sans leading-[1.7] mb-10"
              style={{
                fontSize: "clamp(1.0625rem, 0.5vw + 0.95rem, 1.3125rem)",
                color: "var(--color-ink-soft)",
              }}
            >
              Études d&apos;impact, audits HSE, plans de gestion
              environnementale — des livrables rigoureux, prêts à déposer
              auprès des autorités compétentes.
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

        {/* Stat band — ink numerals over warm cream, neutral hairlines */}
        <div className="mt-24 lg:mt-32 grid grid-cols-1 sm:grid-cols-3 gap-y-12 gap-x-10">
          {STATS.map((s) => (
            <div key={s.label} data-about-stat>
              <div
                className="h-px mb-7"
                style={{ backgroundColor: "var(--color-line)" }}
              />
              <span
                className="block font-display font-light text-ink leading-none tracking-[-0.03em]"
                style={{ fontSize: "clamp(3.5rem, 5.5vw + 1rem, 6.5rem)" }}
              >
                {s.value}
              </span>
              <span
                className="mt-4 block font-sans uppercase"
                style={{
                  fontSize: "var(--text-caption)",
                  letterSpacing: "0.18em",
                  color: "var(--color-muted)",
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
