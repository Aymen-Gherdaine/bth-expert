import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";

interface NavProps {
  lang: Locale;
  dict: Dictionary;
}

export function Nav({ lang, dict }: NavProps) {
  const items = [
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/projets`, label: dict.nav.projets },
    { href: `/${lang}/equipe`, label: dict.nav.equipe },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <nav className="hidden md:flex items-center gap-9">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="relative text-[0.9375rem] text-ink-soft hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)] after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-px after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}