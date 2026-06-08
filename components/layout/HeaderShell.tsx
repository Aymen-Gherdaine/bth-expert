"use client";

import { useState, useEffect } from "react";

interface HeaderShellProps {
  overlay?: boolean;
  children: React.ReactNode;
}

export function HeaderShell({ overlay = false, children }: HeaderShellProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid when scrolled, or always solid on non-overlay pages
  const solid = scrolled || !overlay;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 h-14 lg:h-16",
          "transition-[background-color,backdrop-filter,border-color]",
          "duration-[var(--duration-base)] ease-[var(--ease-out-expo)]",
          solid
            ? "bg-cream-soft/90 [backdrop-filter:blur(12px)_saturate(1.4)] border-b border-line/60"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
        data-state={solid ? "solid" : "transparent"}
      >
        {children}
      </header>
      {/* Spacer prevents layout jump on non-overlay pages.
          Overlay pages (hero full-bleed) sit deliberately under the header. */}
      {!overlay && <div aria-hidden className="h-14 lg:h-16" />}
    </>
  );
}
