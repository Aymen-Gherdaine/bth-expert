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
  const bodyRef   = useRef<HTMLDivElement>(null);
  const imgRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const activeIdx = useRef<number>(-1);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!bodyRef.current) return;

    const N = services.items.length;

    function goTo(idx: number) {
      const prev = activeIdx.current;
      if (idx === prev) return;
      activeIdx.current = idx;

      // Equal-duration crossfade — no gap where both are invisible
      imgRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: i === idx ? 1 : 0,
          duration: 0.65,
          ease: "power2.inOut",
          overwrite: true,
        });
      });

      // Same ease + same duration on both: opacity_in(t) + opacity_out(t) = 1.0 — no flash
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          opacity: i === idx ? 1 : 0,
          y: i === idx ? 0 : i < idx ? -24 : 24,
          duration: 0.45,
          ease: "power2.inOut",
          overwrite: true,
        });
      });
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // GSAP set overrides the initial CSS opacity-0 classes
      imgRefs.current.forEach((el, i) =>
        el && gsap.set(el, { opacity: i === 0 ? 1 : 0 })
      );
      textRefs.current.forEach((el, i) =>
        el && gsap.set(el, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 24 })
      );
      activeIdx.current = 0;

      // 200px per service — one wheel click (~100-120px) crosses the 100px threshold
      ScrollTrigger.create({
        trigger: bodyRef.current,
        start: "top top",
        end: () => `+=${(N - 1) * 200}`,
        pin: true,
        pinSpacing: true,
        snap: {
          snapTo: 1 / (N - 1),
          duration: { min: 0.35, max: 0.55 },
          ease: "power2.inOut",
        },
        onUpdate(self) {
          // Only fire when within 5% of a snap point — prevents oscillation
          // during Lenis deceleration and snap animation
          const rawP = self.progress * (N - 1);
          const idx  = Math.min(Math.round(rawP), N - 1);
          if (Math.abs(rawP - idx) < 0.05 && idx !== activeIdx.current) {
            goTo(idx);
          }
        },
      });

      return () => {
        activeIdx.current = -1;
      };
    });

    return () => mm.revert();
  });

  return (
    <section className="bg-white relative z-10">

      {/* ── Section header ───────────────────────────────────────────── */}
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="flex items-baseline gap-5 mb-10 md:mb-14">
          <span
            className="font-display text-gold"
            style={{ fontSize: "var(--text-h3)", letterSpacing: "-0.01em" }}
          >
            {services.sectionNumber}
          </span>
          <span
            className="font-sans uppercase text-muted tracking-[0.18em]"
            style={{ fontSize: "var(--text-small)" }}
          >
            {services.eyebrow}
          </span>
        </div>
        <h2
          className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
          style={{ fontSize: "clamp(2.25rem, 4vw + 0.75rem, 4.75rem)" }}
        >
          {services.heading}
        </h2>
      </div>

      {/* ── Mobile: static vertical stack ───────────────────────────── */}
      <div className="lg:hidden divide-y divide-line/20">
        {services.items.map((item, i) => (
          <div key={item.abbr} className="pb-16">
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
        {/* Left: stacked placeholder images */}
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
                // CSS initial state prevents hydration flash: non-first items hidden
                className={`absolute inset-0${i !== 0 ? " opacity-0" : ""}`}
                style={{ background: PLACEHOLDERS[i % PLACEHOLDERS.length] }}
              />
            ))}
          </div>
        </div>

        {/* Right: stacked text blocks */}
        <div className="relative border-s border-line/30">
          {services.items.map((item, i) => (
            <div
              key={item.abbr}
              ref={(el) => { textRefs.current[i] = el; }}
              // CSS initial state: non-first items hidden + offset
              className={`absolute inset-0 flex flex-col justify-center px-12 xl:px-16${i !== 0 ? " opacity-0 translate-y-6" : ""}`}
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
