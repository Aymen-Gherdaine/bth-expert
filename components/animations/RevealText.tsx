"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, SplitText } from "@/lib/gsap";

interface RevealTextProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  as?: React.ElementType;
}

/**
 * Word-by-word reveal with a true clipping mask: each word rises from behind
 * an overflow-hidden wrapper. SplitText `mask` option builds per-word clips.
 * Safety net: if GSAP is throttled on slow mobile and the animation never
 * fires, a setTimeout forces yPercent:0 so text is never permanently hidden.
 */
export function RevealText({
  children,
  className,
  style,
  delay = 0,
  as: Tag = "div",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // `aria: "none"` stops SplitText from writing an aria-label onto the
      // host element. On the eyebrow/subheading (plain <div>, generic role)
      // that label is a *prohibited* ARIA attribute (axe aria-prohibited-attr);
      // the split words keep the real text nodes, so screen readers still read
      // the full phrase.
      const split = new SplitText(ref.current, { type: "words", mask: "words", aria: "none" });

      // Safety: force visibility if animation is blocked (mobile JS throttling).
      // Fires 2.5s after the delay — well past any realistic animation duration.
      const safetyId = window.setTimeout(() => {
        gsap.set(split.words, { yPercent: 0 });
      }, (delay + 2.5) * 1000);

      gsap.from(split.words, {
        yPercent: 100,
        duration: 1,
        stagger: 0.06,
        delay,
        ease: "expo.out",
        onComplete: () => window.clearTimeout(safetyId),
      });

      return () => {
        window.clearTimeout(safetyId);
        split.revert();
      };
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
