"use client";

import { useEffect, useState } from "react";
import type Lenis from "lenis";

const RADIUS = 23;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Premium scroll-to-top control.
 * - Appears (fade + rise + scale) once past the first viewport.
 * - Thin gold ring tracks scroll progress around the button.
 * - Smooth return via Lenis when present, native smooth scroll otherwise.
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(y / max, 1) : 0);
      setVisible(y > window.innerHeight * 0.9);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.4 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Revenir en haut de la page"
      data-visible={visible}
      className="scroll-top group fixed bottom-7 right-6 lg:bottom-9 lg:right-9 z-40 grid h-[52px] w-[52px] place-items-center rounded-full"
    >
      {/* Progress ring */}
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 52 52" aria-hidden>
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="rgba(201,169,110,0.18)"
          strokeWidth="1.5"
        />
        <circle
          cx="26"
          cy="26"
          r={RADIUS}
          fill="none"
          stroke="var(--color-gold)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>

      {/* Core */}
      <span className="relative grid h-[44px] w-[44px] place-items-center rounded-full bg-brand-deep/85 text-cream [backdrop-filter:blur(6px)] transition-colors duration-300 ease-[var(--ease-out-expo)] group-hover:bg-gold group-hover:text-brand-deep">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:-translate-y-0.5"
          aria-hidden
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </span>
    </button>
  );
}
