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

    // Mobile: translateY + bottom border-radius only
    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(
        el,
        { y: 0, borderRadius: "0 0 0 0" },
        {
          y: "-12%",
          borderRadius: "0 0 10px 10px",
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

    // Desktop: translateY + scale + bottom border-radius
    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        el,
        { y: 0, scale: 1, borderRadius: "0 0 0 0" },
        {
          y: "-8%",
          scale: 0.97,
          borderRadius: "0 0 14px 14px",
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

    return () => mm.revert();
  });

  return (
    <div ref={ref} className="sticky top-0 z-0 overflow-hidden">
      {children}
    </div>
  );
}
