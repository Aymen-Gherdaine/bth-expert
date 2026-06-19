"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

interface HeroBackgroundProps {
  src: string;
  alt?: string;
  /** Disable for below-the-fold uses (e.g. CTA section) so the image isn't preloaded. */
  priority?: boolean;
}

/**
 * Full-bleed hero image background.
 * - next/image fill + priority (LCP), object-cover.
 * - Ken Burns slow zoom via CSS (.hero-ken-burns) on the inner layer.
 * - Light scroll parallax via GSAP ScrollTrigger on the outer layer (desktop only).
 * Transforms are split across two elements (translate vs scale) so they never conflict.
 * The outer layer is oversized (inset -10%) so parallax travel never reveals an edge.
 */
export function HeroBackground({ src, alt = "", priority = true }: HeroBackgroundProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = parallaxRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Desktop only — parallax can feel janky on touch scroll.
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        el,
        { yPercent: 0 },
        {
          yPercent: 8, // ≤15% manifesto cap; 8% of a 120%-tall layer ≈ 9.6vh, < slack
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: 0.5,
          },
        }
      );
    });

    return () => mm.revert();
  });

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-brand-deep">
      {/* Parallax layer — oversized so translateY never exposes an edge */}
      <div
        ref={parallaxRef}
        className="absolute left-0 right-0"
        style={{ top: "-10%", bottom: "-10%" }}
      >
        {/* Ken Burns layer — CSS scale, isolated from the parallax translate above.
            will-change promotes a compositor layer during the 16s animation only. */}
        <div
          className="hero-ken-burns absolute inset-0"
          style={{ willChange: "transform" }}
          onAnimationEnd={(e) => { e.currentTarget.style.willChange = "auto"; }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            quality={65}
            sizes="100vw"
            placeholder="blur"
            blurDataURL="data:image/webp;base64,UklGRkIAAABXRUJQVlA4IDYAAABQAwCdASoUAAsAPzmEuVOvKKWisAgB4CcJZwAAUfUY2BvbgADrVcj8m36ktODUbCcngB4AAAA="
            className="object-cover object-[50%_58%]"
          />
        </div>
      </div>
    </div>
  );
}
