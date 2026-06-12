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

      const split = new SplitText(ref.current, { type: "words" });
      gsap.from(split.words, {
        yPercent: 110,
        opacity: 0,
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
