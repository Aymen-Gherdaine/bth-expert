"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Decorative cursor ring — lags 12ms behind the mouse to create a rubber-band
 * feel. Scales up over interactive elements (links, buttons). Desktop/fine-pointer
 * only; invisible on touch devices. Purely decorative, pointer-events: none.
 */
export function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Only for devices with a precise pointer (mouse, trackpad)
    if (!window.matchMedia("(pointer: fine) and (hover: hover)").matches) return;

    const ring = ringRef.current;
    if (!ring) return;

    gsap.to(ring, { opacity: 0.5, duration: 0.5, ease: "expo.out" });

    const onMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      // Position lags with rubber-band feel
      gsap.to(ring, {
        x,
        y,
        xPercent: -50,
        yPercent: -50,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });

      // Scale up on interactive targets
      const target = document.elementFromPoint(x, y);
      const isInteractive = !!target?.closest("a, button, [data-interactive]");
      gsap.to(ring, {
        scale: isInteractive ? 2.4 : 1,
        opacity: isInteractive ? 0.85 : 0.5,
        duration: 0.25,
        ease: "expo.out",
        overwrite: "auto",
      });
    };

    const onLeave = () =>
      gsap.to(ring, { opacity: 0, duration: 0.35, ease: "expo.out", overwrite: "auto" });
    const onEnter = () =>
      gsap.to(ring, { opacity: 0.5, duration: 0.35, ease: "expo.out", overwrite: "auto" });

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden
      className="fixed top-0 left-0 w-7 h-7 rounded-full border border-gold pointer-events-none z-[110] opacity-0"
      style={{ boxShadow: "0 0 14px rgba(201, 169, 110, 0.22)" }}
    />
  );
}
