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
  const imgRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const img = imgRef.current;
    if (!img) return;

    gsap.fromTo(
      img,
      { opacity: 0, scale: 1.05 },
      {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: img, start: "top 80%", once: true },
      }
    );
  });

  return (
    <section className="bg-cream-warm relative z-10">
      <div className="pt-24 lg:pt-32 pb-28 lg:pb-40">

        {/* Image — full-width mobile, 10/12 desktop */}
        <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="relative w-full lg:w-10/12 overflow-hidden rounded-lg">
            <div
              ref={imgRef}
              className="w-full aspect-[4/3] lg:aspect-[3/2]"
              style={{
                background:
                  "linear-gradient(160deg, #1a4a20 0%, #0d2812 35%, #0a1a0c 100%)",
              }}
            />
            {/* Gradient at image bottom — eases transition to text block */}
            <div
              className="absolute inset-x-0 bottom-0 h-40 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, #efe7d6 0%, transparent 100%)",
              }}
            />
          </div>
        </div>

        {/* Text block — below image on mobile, overlaps image on desktop */}
        <div className="mt-10 lg:-mt-28 relative z-10 px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
          <div className="max-w-xl">
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
                  Un bureau d&apos;études agréé par le Ministère de
                  l&apos;Environnement
                </h2>
              </FadeInItem>

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
