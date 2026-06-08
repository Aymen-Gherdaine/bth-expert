"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n-config"; 

interface LangSwitcherProps {
  currentLocale: Locale;
  isDark?: boolean;
}

export function LangSwitcher({ currentLocale, isDark = false }: LangSwitcherProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

  return (
    <div className="flex items-center gap-1 text-xs">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && (
            <span
              className={`lang-switcher-sep mx-2 transition-colors duration-500 ${
                isDark ? "text-cream/20" : "text-line"
              }`}
            >
              ·
            </span>
          )}
          <Link
            href={`/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
            className={`lang-switcher-locale uppercase tracking-wider transition-colors duration-500 ${
              locale === currentLocale
                ? isDark
                  ? "text-cream font-medium"
                  : "text-brand font-medium"
                : isDark
                  ? "text-cream/40 hover:text-cream"
                  : "text-muted hover:text-brand"
            }`}
          >
            {locale}
          </Link>
        </span>
      ))}
    </div>
  );
}