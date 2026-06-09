"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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

// Distinct dark-green gradients — swapped for real photos in Phase 2
const PLACEHOLDERS = [
  "linear-gradient(135deg, #1a4a20 0%, #0a1a0c 100%)",
  "linear-gradient(160deg, #0d2812 0%, #1e3d28 100%)",
  "linear-gradient(110deg, #152e16 0%, #2a3d22 100%)",
  "linear-gradient(148deg, #091608 0%, #1a2e1e 100%)",
];

export function ServicesPin({ lang, services }: ServicesPinProps) {
  const bodyRef      = useRef<HTMLDivElement>(null);
  const imgRefs      = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs     = useRef<(HTMLDivElement | null)[]>([]);
  const activeIdx    = useRef<number>(-1);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!bodyRef.current) return;

    const N = services.items.length;

    function goTo(idx: number) {
      const prev = activeIdx.current;
      if (idx === prev) return;
      activeIdx.current = idx;

      // Crossfade images
      imgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: i === idx ? 1 : 0,
          duration: i === idx ? 0.7 : 0.35,
          ease: "power2.inOut",
          overwrite: true,
        });
      });

      // Transition text blocks
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i === idx) {
          gsap.fromTo(
            el,
            { opacity: 0, y: 28 },
            { opacity: 1, y: 0, duration: 0.55, ease: "expo.out", overwrite: true }
          );
        } else {
          gsap.to(el, {
            opacity: 0,
            y: i < idx ? -20 : 20,
            duration: 0.3,
            ease: "power2.in",
            overwrite: true,
          });
        }
      });
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Init: first service visible, rest hidden
      imgRefs.current.forEach((el, i) =>
        el && gsap.set(el, { opacity: i === 0 ? 1 : 0 })
      );
      textRefs.current.forEach((el, i) =>
        el && gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 28 })
      );
      activeIdx.current = 0;

      ScrollTrigger.create({
        trigger: bodyRef.current,
        start: "top top",
        end: () => `+=${N * window.innerHeight}`,
        pin: true,
        pinSpacing: true,
        snap: {
          snapTo: 1 / (N - 1),
          duration: { min: 0.3, max: 0.6 },
          ease: "power2.inOut",
        },
        onUpdate(self) {
          const idx = Math.min(Math.round(self.progress * (N - 1)), N - 1);
          goTo(idx);
        },
      });

      return () => {
        activeIdx.current = -1;
      };
    });

    return () => mm.revert();
  });

  return (
    <section className="bg-cream-warm">

      {/* ── Section header ──────────────────────────────────────────── */}
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-24 md:pt-32 pb-16 md:pb-20">
        <h2
          className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
          style={{ fontSize: "var(--text-h2)" }}
        >
          {services.heading}
        </h2>
      </div>

      {/* ── Mobile: static vertical stack ───────────────────────────── */}
      <div className="lg:hidden divide-y divide-line/20">
        {services.items.map((item, i) => (
          <div key={item.abbr} className="pb-16">
            {/* Per-service placeholder image */}
            <div
              aria-hidden
              className="w-full mb-8"
              style={{
                aspectRatio: "4/3",
                background: PLACEHOLDERS[i % PLACEHOLDERS.length],
              }}
            />
            <div className="px-5 sm:px-6">
              <span
                className="block font-display text-gold mb-4"
                style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1 }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.1] mb-4"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {item.title}
              </h3>
              <p
                className="font-sans text-ink-soft leading-[1.75] mb-6"
                style={{ fontSize: "var(--text-body)" }}
              >
                {item.description}
              </p>
              <Link
                href={`/${lang}/services`}
                className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
              >
                {services.itemCta} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop: pinned two-column ───────────────────────────────── */}
      <div
        ref={bodyRef}
        className="hidden lg:grid h-screen"
        style={{ gridTemplateColumns: "5fr 7fr" }}
      >
        {/* Left: stacked placeholder images — frame stays fixed, content crossfades */}
        <div
          className="relative px-10 xl:px-12 2xl:px-16 flex items-center"
          aria-hidden
        >
          <div
            className="relative w-full rounded-sm overflow-hidden"
            style={{ aspectRatio: "3/4", maxHeight: "75vh" }}
          >
            {services.items.map((item, i) => (
              <div
                key={item.abbr}
                ref={(el) => { imgRefs.current[i] = el; }}
                className="absolute inset-0"
                style={{ background: PLACEHOLDERS[i % PLACEHOLDERS.length] }}
              />
            ))}
          </div>
        </div>

        {/* Right: stacked text blocks — one visible at a time */}
        <div className="relative border-s border-line/30">
          {services.items.map((item, i) => (
            <div
              key={item.abbr}
              ref={(el) => { textRefs.current[i] = el; }}
              className="absolute inset-0 flex flex-col justify-center px-12 xl:px-16"
            >
              <span
                className="block font-display text-gold mb-8"
                style={{
                  fontSize: "clamp(3rem, 5vw, 6rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.1] mb-6"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {item.title}
              </h3>
              <p
                className="font-sans text-ink-soft leading-[1.75] max-w-lg mb-8"
                style={{ fontSize: "var(--text-body)" }}
              >
                {item.description}
              </p>
              <Link
                href={`/${lang}/services`}
                className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] w-fit"
              >
                {services.itemCta} <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
