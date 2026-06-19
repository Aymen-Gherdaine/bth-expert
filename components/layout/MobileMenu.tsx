"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import type { Locale } from "@/lib/i18n";

interface MenuItem {
  href: string;
  label: string;
}

interface MobileMenuProps {
  items: MenuItem[];
  phone: string;
  email: string;
  ctaLabel: string;
  ctaHref: string;
  lang: Locale;
}

const A11Y: Record<Locale, { open: string; close: string }> = {
  fr: { open: "Ouvrir le menu", close: "Fermer le menu" },
  ar: { open: "فتح القائمة", close: "إغلاق القائمة" },
  en: { open: "Open menu", close: "Close menu" },
};

/**
 * Mobile navigation — a hamburger in the header that opens a full-screen
 * deep-green drawer with large serif links (staggered reveal), contact
 * details and a primary CTA. Locks Lenis/scroll while open; closes on
 * link tap, Escape, or the X. Hidden from md+ (desktop keeps the inline nav).
 */
export function MobileMenu({ items, phone, email, ctaLabel, ctaHref, lang }: MobileMenuProps) {
  const a11y = A11Y[lang];
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

  // Close whenever the route changes (state adjusted during render — the
  // React-recommended alternative to a setState-in-effect).
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  // Scroll lock (Lenis + native) and Escape-to-close while open.
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (!open) {
      lenis?.start();
      document.documentElement.style.overflow = "";
      return;
    }
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      {/* Toggle — sits in the header, inherits its animated color */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={a11y.open}
        aria-expanded={open}
        className="group relative z-[60] grid h-10 w-10 place-items-center -me-2"
      >
        {/* Strata mark — uneven contour lines (gold middle) echoing the
            topographic artwork; they align into a clean hamburger on
            hover/focus. */}
        <span className="flex h-[18px] w-6 flex-col items-start justify-between">
          <span className="h-px w-6 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
          <span className="h-px w-3.5 bg-gold transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:w-6 group-focus-visible:w-6" />
          <span className="h-px w-5 bg-current transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:w-6 group-focus-visible:w-6" />
        </span>
      </button>

      {/* Full-screen drawer */}
      <div
        className="mobile-menu fixed inset-0 z-[70] flex flex-col bg-brand-deep text-cream"
        data-open={open}
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between h-16 px-5 sm:px-6 border-b border-cream/10">
          <span
            className="font-display text-cream"
            style={{ fontSize: "1.25rem", letterSpacing: "-0.01em" }}
          >
            BTH Expert<span className="text-gold">.</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={a11y.close}
            className="relative grid h-10 w-10 place-items-center -me-2"
          >
            <span className="absolute h-px w-6 rotate-45 bg-cream" />
            <span className="absolute h-px w-6 -rotate-45 bg-cream" />
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 flex flex-col justify-center px-5 sm:px-6">
          {items.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="mobile-menu-link group flex items-baseline gap-4 py-4 border-b border-cream/10"
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
            >
              <span
                className="font-sans text-gold tabular-nums"
                style={{ fontSize: "0.8125rem" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-display font-light tracking-[-0.02em] leading-none"
                style={{ fontSize: "clamp(2rem, 9vw, 2.75rem)" }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Footer of the drawer — contact + CTA */}
        <div
          className="mobile-menu-link px-5 sm:px-6 pb-10 pt-6 space-y-5"
          style={{ transitionDelay: open ? `${120 + items.length * 70}ms` : "0ms" }}
        >
          <Link
            href={ctaHref}
            onClick={() => setOpen(false)}
            className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight"
          >
            {ctaLabel}
          </Link>
          <div className="flex flex-col gap-1.5 text-cream/70 text-sm">
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
            <a href={`mailto:${email}`}>{email}</a>
          </div>
        </div>
      </div>
    </div>
  );
}
