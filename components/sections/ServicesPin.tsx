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

export function ServicesPin({ lang, services }: ServicesPinProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bodyRef    = useRef<HTMLDivElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!bodyRef.current || !leftRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        // Pin left visual column while right services scroll
        ScrollTrigger.create({
          trigger: bodyRef.current,
          start: "top top",
          end: "bottom top",
          pin: leftRef.current,
          pinSpacing: false,
        });

        // Stagger reveal per service block
        serviceRefs.current.forEach((el) => {
          if (!el) return;
          const eyebrow = el.querySelector<HTMLElement>(".svc-eyebrow");
          const title   = el.querySelector<HTMLElement>(".svc-title");
          const desc    = el.querySelector<HTMLElement>(".svc-desc");
          const link    = el.querySelector<HTMLElement>(".svc-link");

          const targets = [eyebrow, title, desc, link].filter(
            (t): t is HTMLElement => t !== null
          );
          gsap.set(targets, { opacity: 0, y: 28 });

          ScrollTrigger.create({
            trigger: el,
            start: "top top",
            once: true,
            onEnter: () => {
              if (eyebrow) gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.5,  ease: "expo.out" });
              if (title)   gsap.to(title,   { opacity: 1, y: 0, duration: 0.75, ease: "expo.out", delay: 0.10 });
              if (desc)    gsap.to(desc,    { opacity: 1, y: 0, duration: 0.70, ease: "expo.out", delay: 0.20 });
              if (link)    gsap.to(link,    { opacity: 1, y: 0, duration: 0.5,  ease: "expo.out", delay: 0.32 });
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-cream-warm">

      {/* ── Section header ──────────────────────────────────────────── */}
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-[length:var(--text-caption)] text-gold tracking-widest">
            {services.sectionNumber}
          </span>
          <span className="h-px w-8 bg-gold/30 shrink-0" />
          <span className="text-[length:var(--text-caption)] uppercase tracking-widest text-muted">
            {services.eyebrow}
          </span>
        </div>
        <h2
          className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05] max-w-2xl"
          style={{ fontSize: "clamp(2.25rem, 5vw + 0.5rem, 5rem)" }}
        >
          {services.heading}
        </h2>
      </div>

      {/* ── Mobile: static placeholder above service list ────────────── */}
      <div
        className="lg:hidden w-full overflow-hidden"
        aria-hidden
        style={{ aspectRatio: "4/3" }}
      >
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at 30% 40%, var(--color-brand-soft) 0%, var(--color-brand-deep) 60%)",
          }}
        />
      </div>

      {/* ── Pin scroll body ─────────────────────────────────────────── */}
      <div
        ref={bodyRef}
        className="lg:grid"
        style={{ gridTemplateColumns: "5fr 7fr" }}
      >
        {/* Left: pinned visual (desktop only) */}
        <div
          ref={leftRef}
          className="hidden lg:flex items-center h-screen self-start px-10 xl:px-12 2xl:px-16"
          aria-hidden
        >
          <div
            className="w-full rounded-sm overflow-hidden"
            style={{
              aspectRatio: "3/4",
              maxHeight: "75vh",
              background:
                "radial-gradient(ellipse at 30% 40%, var(--color-brand-soft) 0%, var(--color-brand-deep) 60%)",
            }}
          />
        </div>

        {/* Right: service blocks */}
        <div className="lg:border-s lg:border-line/30">
          {services.items.map((item, i) => (
            <div
              key={item.abbr}
              ref={(el) => { serviceRefs.current[i] = el; }}
              className="flex flex-col justify-center px-6 sm:px-8 lg:px-12 xl:px-16 py-16 lg:min-h-screen border-b border-line/20 last:border-b-0"
            >
              <span
                className="svc-eyebrow block font-display text-gold mb-8"
                style={{
                  fontSize: "clamp(3rem, 5vw, 6rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className="svc-title font-display font-light text-ink tracking-[-0.02em] leading-[1.1] mb-6"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {item.title}
              </h3>
              <p
                className="svc-desc font-sans text-ink-soft leading-[1.75] max-w-lg mb-8"
                style={{ fontSize: "var(--text-body)" }}
              >
                {item.description}
              </p>
              <Link
                href={`/${lang}/services`}
                className="svc-link inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] w-fit"
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
