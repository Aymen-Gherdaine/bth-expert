"use client";

import { useRef, useEffect } from "react";

interface ScrollPulseProps {
  className?: string;
}

/**
 * Scroll indicator arrow — pauses its infinite CSS animation when off-screen
 * to avoid wasting a GPU compositor layer while the hero is hidden.
 */
export function ScrollPulse({ className }: ScrollPulseProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.display = "none";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <span ref={ref} aria-hidden className={className} />;
}
