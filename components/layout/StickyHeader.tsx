"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { LangSwitcher } from "./LangSwitcher";
import type { Locale } from "@/lib/i18n";

interface NavItem {
  href: string;
  label: string;
}

interface StickyHeaderProps {
  lang: Locale;
  navItems: NavItem[];
  ctaLabel: string;
  ctaHref: string;
}

export function StickyHeader({
  lang,
  navItems,
  ctaLabel,
  ctaHref,
}: StickyHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const light = !scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-[var(--ease-out-expo)] ${
        scrolled ? "bg-cream border-b border-line" : "bg-transparent"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link
            href={`/${lang}`}
            className={`font-display text-xl lg:text-2xl tracking-tight transition-colors duration-500 ease-[var(--ease-out-expo)] ${
              light ? "text-cream" : "text-brand"
            }`}
          >
            BTH Expert
          </Link>

          <div className="flex items-center gap-5 lg:gap-8">
            <nav className="hidden md:flex items-center gap-7 lg:gap-9">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-[0.9rem] transition-colors duration-500 ease-[var(--ease-out-expo)] ${
                    light
                      ? "text-cream/60 hover:text-cream"
                      : "text-ink-soft hover:text-brand"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <LangSwitcher currentLocale={lang} isDark={light} />

            <Link
              href={ctaHref}
              className={`hidden sm:inline-flex items-center px-5 py-2.5 rounded-sm text-[0.875rem] font-medium tracking-tight transition-all duration-500 ease-[var(--ease-out-expo)] ${
                light
                  ? "border border-cream/25 text-cream hover:border-cream hover:bg-cream hover:text-brand"
                  : "bg-brand text-cream hover:bg-brand-soft"
              }`}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}
