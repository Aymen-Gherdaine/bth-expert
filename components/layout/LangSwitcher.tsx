"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n-config"; 

interface LangSwitcherProps {
  currentLocale: Locale;
}

export function LangSwitcher({ currentLocale }: LangSwitcherProps) {
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(`/${currentLocale}`, "") || "/";

  return (
    <div className="flex items-center gap-1 text-xs">
      {locales.map((locale, i) => (
        <span key={locale} className="flex items-center">
          {i > 0 && <span className="text-line mx-2">·</span>}
          <Link
            href={`/${locale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`}
            className={`uppercase tracking-wider transition-colors ${
              locale === currentLocale
                ? "text-brand font-medium"
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