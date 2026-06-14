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
 * Word-by-word reveal with a true clipping mask (manifesto §2): each word
 * rises from behind an overflow-hidden wrapper — translateY only, no opacity
 * fade. SplitText's `mask` option (GSAP 3.13+) builds the per-word masks.
 * prefers-reduced-motion shows the text as-is.
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

      const split = new SplitText(ref.current, { type: "words", mask: "words" });
      gsap.from(split.words, {
        yPercent: 100,
        duration: 1,
        stagger: 0.06,
        delay,
        ease: "expo.out",
      });

      return () => split.revert();
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref as never} className={className} style={style}>
      {children}
    </Tag>
  );
}
