"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import type { Locale } from "@/lib/i18n";

// Silence unused-import lint — ScrollTrigger must be imported to activate
// type augmentation so the `scrollTrigger` gsap config key is recognised.
void ScrollTrigger;

interface AboutSectionProps {
  lang: Locale;
}

export function AboutSection({ lang }: AboutSectionProps) {
  const imgRef   = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const img = imgRef.current;
    if (img) {
      gsap.fromTo(
        img,
        { opacity: 0, scale: 1.04 },
        {
          opacity: 1,
          scale: 1,
          duration: 1.1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: img,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    const badge = badgeRef.current;
    if (badge) {
      badge.textContent = "0";
      const counter = { val: 0 };
      gsap.to(counter, {
        val: 100,
        duration: 1.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: badge,
          start: "top 85%",
          once: true,
        },
        onUpdate() {
          badge.textContent = Math.round(counter.val).toString();
        },
      });
    }
  });

  return (
    <section className="bg-cream-warm">
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-24 lg:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-center">

          {/* ── Image — first in DOM → above text on mobile ─────────── */}
          <div className="mb-12 lg:mb-0 lg:col-span-7 lg:col-start-6 lg:row-start-1">
            <div className="relative overflow-hidden rounded-lg">
              {/* Placeholder — replaced with real terrain photo in Phase 2 */}
              <div
                ref={imgRef}
                className="w-full aspect-[16/10] lg:aspect-[4/5]"
                style={{
                  background:
                    "linear-gradient(160deg, #1a4a20 0%, #0d2812 35%, #0a1a0c 100%)",
                }}
              />

              {/* 100+ badge */}
              <div
                className="absolute bottom-6 right-6 px-6 py-4 rounded-md"
                style={{ backgroundColor: "rgba(26, 46, 30, 0.82)" }}
              >
                <span
                  className="block font-display text-gold leading-none"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <span ref={badgeRef}>100</span>+
                </span>
                <span
                  className="block font-sans mt-1"
                  style={{
                    fontSize: "var(--text-caption)",
                    letterSpacing: "0.1em",
                    color: "rgba(245, 240, 232, 0.7)",
                  }}
                >
                  Projets réalisés
                </span>
              </div>
            </div>
          </div>

          {/* ── Text — second in DOM → below image on mobile ────────── */}
          <div className="lg:col-span-5 lg:col-start-1 lg:row-start-1">
            <FadeInStagger>

              <FadeInItem>
                <span
                  className="block font-sans uppercase text-gold mb-6"
                  style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
                >
                  À PROPOS
                </span>
              </FadeInItem>

              <FadeInItem>
                <h2
                  className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2] mb-8"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  Un bureau d&apos;études agréé par le Ministère de l&apos;Environnement
                </h2>
              </FadeInItem>

              <FadeInItem>
                <p
                  className="font-sans text-ink-soft leading-[1.75] mb-5"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  BTH Expert est une société agréée de conseil et d&apos;ingénierie
                  environnementale, intervenant dans les domaines de
                  l&apos;environnement, de la sécurité et de l&apos;hygiène en
                  région Ouest algérienne.
                </p>
              </FadeInItem>

              <FadeInItem>
                <p
                  className="font-sans text-ink-soft leading-[1.75] mb-10"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  Fondé en 2009, le bureau accompagne les industriels dans leur
                  mise en conformité réglementaire — études d&apos;impact, audits HSE,
                  plans de gestion environnementale — avec des livrables prêts à
                  déposer auprès des autorités compétentes.
                </p>
              </FadeInItem>

              <FadeInItem>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  Travaillons ensemble <span aria-hidden>→</span>
                </Link>
              </FadeInItem>

            </FadeInStagger>
          </div>

        </div>
      </div>
    </section>
  );
}
