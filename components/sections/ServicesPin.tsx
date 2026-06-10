"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import type { Locale } from "@/lib/i18n";

interface ServiceItem {
  abbr: string;
  title: string;
  description: string;
}

interface ServiceContent {
  sectionNumber: string;
  eyebrow: string;
  heading: string;
  items: ServiceItem[];
  itemCta: string;
  cta: string;
}

interface ServicesPinProps {
  lang: Locale;
  services: ServiceContent;
}

// Color rhythm — varied dark-green backgrounds so the scroll has visual change.
// Placeholders for real photography in Phase 2.
const BACKGROUNDS = [
  "radial-gradient(120% 100% at 50% 38%, #1d3b25 0%, #102013 68%, #0b160d 100%)",
  "linear-gradient(100deg, #2a4530 0%, #18301f 60%, #122418 100%)",
  "linear-gradient(155deg, #0d1a11 0%, #08130b 100%)",
  "radial-gradient(130% 120% at 72% 62%, #244c2d 0%, #1a2e1e 55%, #101f15 100%)",
  "linear-gradient(0deg, #2a4530 0%, #18311f 55%, #11221700 100%), linear-gradient(0deg, #14261b 0%, #14261b 100%)",
];

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export function ServicesPin({ lang, services }: ServicesPinProps) {
  const sectionRef = useRef<HTMLElement>(null);

  // Ken Burns — subtle scale settle as each block passes through the viewport.
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const layers = gsap.utils.toArray<HTMLElement>("[data-kenburns]");
      layers.forEach((el) => {
        gsap.fromTo(
          el,
          { scale: 1.06 },
          {
            scale: 1.0,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-white relative z-10">

      {/* ── Header — announces what follows ──────────────────────────── */}
      <div className={`${PADX} pt-24 md:pt-32 pb-14 md:pb-20`}>
        <h2
          className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
          style={{ fontSize: "var(--text-h2)" }}
        >
          Nos expertises
        </h2>
      </div>

      {/* ── Full-screen service blocks (GISI pattern) ───────────────── */}
      {services.items.map((item, i) => (
        <div
          key={item.abbr}
          className={`service-block relative overflow-hidden${
            i > 0 ? " -mt-10 lg:-mt-16 rounded-t-lg" : ""
          }`}
          style={{ zIndex: i + 1 }}
        >
          {/* Background gradient + Ken Burns */}
          <div
            data-kenburns
            aria-hidden
            className="absolute inset-0"
            style={{
              background: BACKGROUNDS[i % BACKGROUNDS.length],
              willChange: "transform",
            }}
          />
          {/* Legibility overlay — heaviest toward the bottom-left text */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top right, rgb(8 16 9 / 0.78) 0%, rgb(8 16 9 / 0.30) 50%, rgb(8 16 9 / 0) 78%)",
            }}
          />

          {/* Text — bottom-left, staggered reveal on entry */}
          <div className={`absolute inset-0 flex flex-col justify-end ${PADX} pb-16 lg:pb-24`}>
            <FadeInStagger className="max-w-2xl">
              <FadeInItem>
                <span
                  className="block font-display text-gold mb-5 lg:mb-7"
                  style={{
                    fontSize: "clamp(2.5rem, 4vw, 4.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </FadeInItem>
              <FadeInItem>
                <h3
                  className="font-display font-light text-cream tracking-[-0.02em] leading-[1.1] mb-5"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {item.title}
                </h3>
              </FadeInItem>
              <FadeInItem>
                <p
                  className="font-sans leading-[1.75] max-w-xl mb-8 text-[var(--color-on-brand-muted)]"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {item.description}
                </p>
              </FadeInItem>
              <FadeInItem>
                <Link
                  href={`/${lang}/services`}
                  className="inline-flex items-center gap-2 text-cream text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] w-fit"
                >
                  {services.itemCta} <span aria-hidden>→</span>
                </Link>
              </FadeInItem>
            </FadeInStagger>
          </div>
        </div>
      ))}
    </section>
  );
}
