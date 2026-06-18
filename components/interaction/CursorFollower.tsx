"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Decorative cursor ring — visible only inside dark (.bg-brand-deep) sections.
 * Gold ring on dark green = premium visual; hidden on light backgrounds.
 * RAF-throttled: one DOM read per frame max, no elementFromPoint (uses e.target).
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    let lastX = 0;
    let lastY = 0;
    let lastTarget: Element | null = null;
    let rafPending = false;

    const processMove = () => {
      rafPending = false;
      const target = lastTarget;
      const x = lastX;
      const y = lastY;

      const inDark = !!target?.closest(".bg-brand-deep, [data-cursor-dark]");
      const isInteractive = inDark && !!target?.closest("a, button, [data-interactive]");

      gsap.to(ring, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });

      gsap.to(ring, {
        scale: isInteractive ? 2.4 : 1,
        opacity: inDark ? (isInteractive ? 0.85 : 0.65) : 0,
        duration: 0.25,
        ease: "expo.out",
        overwrite: "auto",
      });
    };

    const onMove = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      lastTarget = e.target as Element;
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(processMove);
    };

    const onLeave = () =>
      gsap.to(ring, { opacity: 0, duration: 0.35, ease: "expo.out", overwrite: "auto" });

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="fixed top-0 left-0 w-7 h-7 rounded-full border border-gold pointer-events-none z-[110] opacity-0"
      style={{ boxShadow: "0 0 14px rgba(201, 169, 110, 0.35)" }}
    />
  );
}
