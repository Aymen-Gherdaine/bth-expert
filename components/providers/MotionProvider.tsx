"use client";

import { MotionConfig } from "framer-motion";

/**
 * Makes every framer-motion animation (FadeIn, FadeInStagger…) respect the
 * user's prefers-reduced-motion setting — transforms are dropped, only
 * opacity remains. The GSAP components already guard reduced-motion
 * themselves; this closes the gap for the framer-motion side (manifesto §5).
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
