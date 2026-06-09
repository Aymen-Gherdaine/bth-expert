"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import type { Locale } from "@/lib/i18n";

void ScrollTrigger;

interface AboutSectionProps {
  lang: Locale;
}

export function AboutSection({ lang }: AboutSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Gold traced line on entry
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

    // Curtain-up retreat as Services scrolls over — mirrors HeroCurtain behavior
    const section = sectionRef.current;
    if (section) {
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

      return () => mm.revert();
    }
  });

  return (
    // No explicit z-index — DOM order (ServicesPin comes after) handles stacking
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
          <div className="lg:col-span-5 mb-12 lg:mb-0">
            <FadeInStagger>
              <FadeInItem>
                <span
                  className="block font-sans uppercase text-gold mb-8"
                  style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
                >
                  À PROPOS
                </span>
              </FadeInItem>
              <FadeInItem>
                <h2
                  className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2]"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  Un bureau d&apos;études agréé par le Ministère de
                  l&apos;Environnement
                </h2>
              </FadeInItem>
            </FadeInStagger>
          </div>

          {/* Right: body + CTA */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-end">
            <FadeInStagger>
              <FadeInItem>
                <p
                  className="font-sans text-ink-soft leading-[1.75] mb-5"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  BTH Expert est une société agréée de conseil et
                  d&apos;ingénierie environnementale, intervenant dans les
                  domaines de l&apos;environnement, de la sécurité et de
                  l&apos;hygiène en région Ouest algérienne.
                </p>
              </FadeInItem>
              <FadeInItem>
                <p
                  className="font-sans text-ink-soft leading-[1.75] mb-10"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  Fondé en 2009, le bureau accompagne les industriels dans leur
                  mise en conformité réglementaire — études d&apos;impact,
                  audits HSE, plans de gestion environnementale — avec des
                  livrables prêts à déposer auprès des autorités compétentes.
                </p>
              </FadeInItem>
              <FadeInItem>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  En savoir plus <span aria-hidden>→</span>
                </Link>
              </FadeInItem>
            </FadeInStagger>
          </div>

        </div>
      </div>
    </section>
  );
}
