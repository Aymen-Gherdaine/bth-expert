"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Lenis owns the scroll position, so the browser's own restoration can't
    // reach it — manage it explicitly (see the route-change reset below).
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";

    // Reduce layout recalcs: batch callbacks, skip mobile resize triggers
    ScrollTrigger.config({ limitCallbacks: true, ignoreMobileResize: true });
    // Skip expensive per-frame updates when scrolling faster than 3000px/s
    ScrollTrigger.defaults({ fastScrollEnd: 3000 });

    const lenis = new Lenis({ duration: 1.0 });
    lenis.on("scroll", ScrollTrigger.update);
    // Expose for programmatic scrolls (e.g. the scroll-to-top button)
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  // New route = start at the top. Without this, Lenis holds the previous
  // scroll position, so links to another page (and the logo) landed mid-page.
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
