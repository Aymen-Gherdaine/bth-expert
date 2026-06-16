"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * Hero gold filet — traces in from the left on page load, before the
 * headline words stagger in (which start at delay=0.1s via RevealText).
 */
export function HeroFilet({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(ref.current, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.85,
        ease: "expo.out",
      });
    },
    { scope: ref }
  );

  return <span ref={ref} aria-hidden className={className} />;
}
