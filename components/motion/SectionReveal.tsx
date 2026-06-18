"use client";

import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

void ScrollTrigger;

interface SectionRevealProps {
  children: ReactNode;
  className?: string;
}

export function SectionReveal({ children, className }: SectionRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        }
      );
    });

    mm.add("(min-width: 1024px)", () => {
      gsap.fromTo(
        el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        }
      );
    });

    return () => mm.revert();
  });

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
