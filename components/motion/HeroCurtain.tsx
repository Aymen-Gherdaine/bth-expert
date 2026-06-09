"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

export function HeroCurtain({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    // Mobile: translateY + opacity only
    mm.add("(max-width: 1023px)", () => {
      gsap.to(el, {
        y: "-15%",
        opacity: 0.65,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // Desktop: translateY + scale + opacity
    mm.add("(min-width: 1024px)", () => {
      gsap.to(el, {
        y: "-10%",
        scale: 0.95,
        opacity: 0.6,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    return () => mm.revert();
  });

  return (
    <div ref={ref} className="sticky top-0 z-0">
      {children}
    </div>
  );
}
