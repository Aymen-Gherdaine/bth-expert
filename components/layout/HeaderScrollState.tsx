"use client";

import { useEffect } from "react";

/**
 * Toggles `data-solid` on the fixed header wrapper (#site-header) once the
 * user scrolls past the hero. A clean threshold flip (with CSS transitions)
 * instead of a scroll-timeline scrub — the bg, text, logo and topbar all
 * change together, with no half-transparent / half-cream mid-states.
 */
export function HeaderScrollState() {
  useEffect(() => {
    const el = document.getElementById("site-header");
    if (!el) return;

    let raf = 0;
    const apply = () => {
      raf = 0;
      // Flip near the end of the hero cover (85% of the first viewport).
      const solid = window.scrollY > window.innerHeight * 0.85;
      if (solid !== (el.dataset.solid === "true")) {
        el.dataset.solid = solid ? "true" : "false";
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    apply();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
