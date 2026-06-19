"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

interface ZonesContent {
  eyebrow: string;
  heading: string;
  address: string;
  phone: string;
  email: string;
  cta: string;
  coverage: string;
}

interface ZonesSectionProps {
  lang: Locale;
  content: ZonesContent;
}

/**
 * Zones d'intervention + Nous trouver — merged dark section.
 * The Algeria map sits contained on the right (brand-soft on brand-deep);
 * the Oran gold beacon is the home base, with coverage rays radiating
 * toward the other regions ("based in Oran, serving all of Algeria").
 * All contact info lives directly on the dark surface (no white card).
 *
 * Map path generated from public-domain GeoJSON (equirectangular
 * projection, cos(mid-lat) corrected). Oran sits at its exact
 * geographic position within the same projection.
 */

const ALGERIA_PATH =
  "M760 568.4L634.1 647.7L527.7 729.6L475.9 748.1L435.1 752.2L434.7 725.7L417.7 718.9L394.8 707L386.1 687.5L262.1 596.6L138.2 505.8L0 404.9L0.7 396.9L0.7 394.1L0.4 344.7L59.7 314L96.4 307.6L126.5 296.5L140.5 275.6L183.5 259.1L185.1 228.3L206.3 224.6L223 209.2L271 202.2L277.8 186L268.1 177.2L255.4 133.2L253.2 107.9L239.4 81.2L274.7 58.5L314.4 51.2L337.6 34L373 21.4L435.3 13.9L496 10.6L514.6 16.7L549.2 0.3L588.4 0L603.4 9.7L628.5 7.2L621 28.5L626.9 68.2L618.2 102.6L595.6 125.8L598.8 157.2L628.9 182L629.2 192.1L651.8 208.9L667.5 283.7L679.4 320.4L681.4 339.8L674.9 373.8L677.6 392.8L672.9 415.5L676.1 441.7L661.5 459.1L683.2 489.5L684.6 507.3L697.7 530.6L714.9 522.9L743.9 542.3L760 568.4Z";

const ORAN = { x: 295.8, y: 59.2 };
// Faint connector traced from the Oran beacon toward the contact text (left).
const CONNECTOR_PATH = "M295.8 59.2 C 200 130, 110 220, 12 318";

// Coverage rays — from the Oran base toward the rest of the country
// (Alger, Constantine, Hassi Messaoud, Tamanrasset, Adrar). Endpoints sit
// at plausible positions within the same equirectangular projection.
const COVERAGE_RAYS = [
  { d: "M295.8 59.2 Q 380 28, 452 22", end: { x: 452, y: 22 } },
  { d: "M295.8 59.2 Q 455 48, 598 36", end: { x: 598, y: 36 } },
  { d: "M295.8 59.2 Q 440 140, 560 235", end: { x: 560, y: 235 } },
  { d: "M295.8 59.2 Q 405 300, 478 555", end: { x: 478, y: 555 } },
  { d: "M295.8 59.2 Q 258 205, 245 350", end: { x: 245, y: 350 } },
];

export function ZonesSection({ lang, content }: ZonesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const addressRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<SVGSVGElement>(null);
  const mapPathRef = useRef<SVGPathElement>(null);
  const connectorRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const wilayasRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const heading = headingRef.current;
      const connector = connectorRef.current;
      if (!heading || !connector) return;

      const len = connector.getTotalLength();
      gsap.set(connector, { strokeDasharray: len });

      // Coverage rays start undrawn; reduced-motion never reaches this code,
      // so the static fallback is fully drawn rays + visible endpoint dots.
      const rays = gsap.utils.toArray<SVGPathElement>(".dz-ray");
      rays.forEach((ray) => {
        const rayLen = ray.getTotalLength();
        gsap.set(ray, { strokeDasharray: rayLen, strokeDashoffset: rayLen });
      });

      const split = new SplitText(heading, { type: "lines" });

      // ── Text — independent timeline, fires as soon as the section nears
      //    the viewport (the map choreography must never delay the copy).
      gsap
        .timeline({
          defaults: { ease: "expo.out" },
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%", once: true },
        })
        .from(eyebrowRef.current, { opacity: 0, y: 14, duration: 0.7 }, 0)
        .from(lineRef.current, { scaleX: 0, transformOrigin: "left center", duration: 0.8 }, 0.15)
        .from(split.lines, { opacity: 0, y: 28, duration: 0.95, stagger: 0.1 }, 0.2)
        .from(addressRef.current, { opacity: 0, y: 16, duration: 0.7 }, 0.55)
        .from(linksRef.current, { opacity: 0, y: 16, duration: 0.7 }, 0.7)
        .from(wilayasRef.current, { opacity: 0, y: 14, duration: 0.7 }, 0.85);

      // ── Map — fires when the SVG itself enters the viewport ──────────
      const tl = gsap.timeline({
        scrollTrigger: { trigger: mapRef.current, start: "top 85%", once: true },
      });

      tl.from(mapRef.current, {
        opacity: 0,
        scale: 1.05,
        transformOrigin: "right center",
        duration: 1.4,
        ease: "expo.out",
      })
        .from(
          mapPathRef.current,
          { opacity: 0, duration: 1.2, ease: "sine.out" },
          "<"
        )
        .from(
          glowRef.current,
          {
            scale: 0,
            opacity: 0,
            transformOrigin: "50% 50%",
            duration: 1.1,
            ease: "expo.out",
          },
          "-=0.8"
        )
        .from(
          [pulseRef.current, dotRef.current],
          { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.8, ease: "back.out(1.6)" },
          "-=0.6"
        )
        // Radial gold wave — expands once from Oran across the country
        .fromTo(
          ".dz-wave",
          { opacity: 0.4, scale: 0.15, transformOrigin: "50% 50%" },
          { opacity: 0, scale: 9, duration: 2.4, ease: "power1.out" },
          "-=0.3"
        )
        // Rays draw out from Oran toward each region, staggered
        .to(
          ".dz-ray",
          { strokeDashoffset: 0, duration: 1.3, stagger: 0.14, ease: "power2.inOut" },
          "<+0.1"
        )
        // Each endpoint lights up as its ray arrives
        .from(
          ".dz-ray-dot",
          { scale: 0, opacity: 0, transformOrigin: "50% 50%", duration: 0.5, stagger: 0.14, ease: "back.out(2)" },
          "<+0.9"
        )
        .from(connector, { strokeDashoffset: len, duration: 1.1, ease: "power2.inOut" }, "-=1.2")
        .call(() => {
          // Beacon loop — expanding ring + breathing core dot
          gsap.to(pulseRef.current, {
            scale: 2.8,
            opacity: 0,
            transformOrigin: "50% 50%",
            duration: 2.6,
            repeat: -1,
            ease: "sine.out",
          });
          gsap.to(dotRef.current, {
            scale: 1.35,
            transformOrigin: "50% 50%",
            duration: 1.6,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        });

      return () => split.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center overflow-hidden bg-brand-deep min-h-screen pt-20 pb-16 lg:py-32"
    >
      {/* ── Map — below text on mobile, atmospheric right-side on desktop ── */}
      <div
        aria-hidden
        className="flex order-2 justify-center mt-10 w-full max-w-[260px] mx-auto pointer-events-none select-none lg:order-none lg:max-w-none lg:mx-0 lg:mt-0 lg:absolute lg:inset-y-0 lg:right-32 xl:right-48 2xl:right-64 lg:w-[38%] xl:w-[36%] lg:items-center lg:justify-end"
      >
        <svg
          ref={mapRef}
          viewBox="0 0 760 753"
          role="img"
          aria-label="Carte de l'Algérie — BTH Expert intervient depuis Oran dans tout l'Ouest algérien"
          className="w-full overflow-visible"
        >
          <defs>
            <radialGradient id="dz-oran-glow">
              <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.55" />
              <stop offset="45%" stopColor="var(--color-gold)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Algeria silhouette — brand-soft on brand-deep so it clearly detaches */}
          <path
            ref={mapPathRef}
            d={ALGERIA_PATH}
            fill="var(--color-brand-soft)"
            opacity="0.9"
          />

          {/* Faint connector — beacon toward the contact text */}
          <path
            ref={connectorRef}
            d={CONNECTOR_PATH}
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Coverage rays — Oran base toward each region, drawn in on scroll */}
          {COVERAGE_RAYS.map((ray) => (
            <g key={ray.d}>
              <path
                className="dz-ray"
                d={ray.d}
                fill="none"
                stroke="var(--color-gold)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.4"
              />
              <circle
                className="dz-ray-dot"
                cx={ray.end.x}
                cy={ray.end.y}
                r="3.5"
                fill="var(--color-gold)"
                opacity="0.55"
              />
            </g>
          ))}

          {/* Radial gold wave — invisible at rest, pulsed once by the timeline */}
          <circle
            className="dz-wave"
            cx={ORAN.x}
            cy={ORAN.y}
            r="70"
            fill="url(#dz-oran-glow)"
            opacity="0"
          />

          {/* Oran — gold radial glow + pulsing beacon, drawn LAST so it sits on top */}
          <circle ref={glowRef} cx={ORAN.x} cy={ORAN.y} r="118" fill="url(#dz-oran-glow)" />
          <circle
            ref={pulseRef}
            cx={ORAN.x}
            cy={ORAN.y}
            r="12"
            fill="none"
            stroke="var(--color-gold)"
            strokeWidth="2"
            opacity="0.7"
          />
          <circle ref={dotRef} cx={ORAN.x} cy={ORAN.y} r="6.5" fill="var(--color-gold)" />
        </svg>
      </div>

      {/* ── Contact — integrated directly on the dark surface ── */}
      <div className="relative z-10 order-1 lg:order-none w-full px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        <div className="lg:w-[48%] lg:max-w-[34rem]">
          <p
            ref={eyebrowRef}
            className="font-sans text-[length:var(--text-caption)] uppercase tracking-[0.22em] text-gold"
          >
            — {content.eyebrow}
          </p>
          <span
            ref={lineRef}
            aria-hidden
            className="mt-5 mb-7 block h-px w-12 origin-left bg-gold/60"
          />

          <h2
            ref={headingRef}
            className="font-display font-light text-cream tracking-[-0.03em] leading-[1.12] pb-2 text-[length:var(--text-display)]"
          >
            {content.heading}
          </h2>

          <address
            ref={addressRef}
            className="not-italic mt-8 text-[length:var(--text-body)] text-cream/80 leading-[1.7] whitespace-pre-line"
          >
            {content.address}
          </address>

          <div
            ref={linksRef}
            className="mt-7 flex flex-col gap-2.5 text-[length:var(--text-small)]"
          >
            <a
              href={`tel:${content.phone.replace(/[\s()]/g, "")}`}
              className="w-fit text-cream/80 hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              {content.phone}
            </a>
            <a
              href={`mailto:${content.email}`}
              className="w-fit text-cream/80 hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              {content.email}
            </a>
            <Link
              href={`/${lang}/contact`}
              className="mt-4 inline-flex w-fit items-center gap-2 font-sans font-medium text-gold tracking-tight hover:gap-3 hover:text-cream transition-[gap,color] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              {content.cta} <span aria-hidden>→</span>
            </Link>
          </div>

          <div ref={wilayasRef} className="mt-9 pt-7 border-t border-cream/10">
            <p className="text-[length:var(--text-small)] text-cream/55 leading-[1.8] max-w-md">
              {content.coverage}
            </p>
            <Link
              href={`/${lang}/oran`}
              className="mt-4 inline-block text-[length:var(--text-small)] text-cream/35 hover:text-cream/60 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              Notre présence à Oran →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
