import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";

interface NavProps {
  lang: Locale;
  dict: Dictionary;
}

export function Nav({ lang, dict }: NavProps) {
  const items = [
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/secteurs`, label: dict.nav.secteurs },
    { href: `/${lang}/equipe`, label: dict.nav.equipe },
    { href: `/${lang}/projets`, label: dict.nav.projets },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <nav className="hidden md:flex items-center gap-7">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="text-sm text-ink-soft hover:text-brand transition-colors duration-200"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}