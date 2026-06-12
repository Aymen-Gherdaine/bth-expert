"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

/**
 * Cover pattern: the hero stays pinned and perfectly still (sticky, z-0)
 * while the next section scrolls over it and hides it. The only motion is
 * a progressive dim that pushes the hero into the background as it gets
 * covered — depth without displacement.
 */
export function HeroCurtain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    const dim = dimRef.current;
    if (!el || !dim) return;

    gsap.fromTo(
      dim,
      { opacity: 0 },
      {
        opacity: 0.45,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      }
    );
  });

  return (
    <div ref={ref} className="sticky top-0 z-0 overflow-hidden">
      {children}
      {/* Dim layer — deepens as the next section covers the hero */}
      <div
        ref={dimRef}
        aria-hidden
        className="absolute inset-0 z-20 pointer-events-none bg-brand-deep opacity-0"
      />
    </div>
  );
}
