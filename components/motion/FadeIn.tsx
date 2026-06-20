"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// Révélations au scroll en GSAP (le moteur dominant du site) — remplace
// framer-motion pour éviter de charger un second runtime d'animation.
// L'API publique (FadeIn / FadeInStagger / FadeInItem) est inchangée.
const EASE = "expo.out";
const START = "top 94%";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  scale?: boolean;
  className?: string;
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.75,
  y = 0,
  scale = false,
  className,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current;
      if (!el) return;

      gsap.from(el, {
        opacity: 0,
        y,
        scale: scale ? 0.97 : 1,
        duration,
        delay,
        ease: EASE,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
}

export function FadeInStagger({ children, className }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current;
      if (!el) return;

      const items = el.querySelectorAll<HTMLElement>("[data-fade-item]");
      if (!items.length) return;

      gsap.from(items, {
        opacity: 0,
        duration: 0.65,
        ease: EASE,
        stagger: 0.09,
        scrollTrigger: { trigger: el, start: START, once: true },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function FadeInItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-fade-item className={className}>
      {children}
    </div>
  );
}
