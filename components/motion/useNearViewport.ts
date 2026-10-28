"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Latches to `true` the first time `ref` comes within `rootMargin` of the
 * viewport, then stops observing.
 *
 * Why: every below-the-fold section used to build its GSAP timelines,
 * ScrollTriggers and SplitText splits during hydration. Each of those reads
 * computed styles right after another wrote inline ones, forcing a style +
 * layout pass per call — together a single ~1.3 s main-thread task on a
 * throttled mobile CPU (the Lighthouse TBT). Gating `useGSAP` on this hook
 * moves that work to just before each section is seen, in small separate
 * tasks. Nothing changes visually: these sections only animate on scroll.
 *
 * @param ref        Element to watch (usually the section root).
 * @param rootMargin How far ahead of the viewport to fire. Default: half a
 *                   viewport below, so hidden "from" states are applied
 *                   before the section scrolls into view.
 */
export function useNearViewport(
  ref: RefObject<Element | null>,
  rootMargin = "0px 0px 50% 0px"
): boolean {
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin, near]);

  return near;
}
