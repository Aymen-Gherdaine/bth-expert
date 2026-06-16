import type { Dictionary, Locale } from "@/lib/i18n";
import { NavLink } from "./NavLink";

interface NavProps {
  lang: Locale;
  dict: Dictionary;
  className?: string;
  style?: React.CSSProperties;
}

export function Nav({ lang, dict, className, style }: NavProps) {
  const items = [
    { href: `/${lang}/a-propos`, label: dict.nav.apropos },
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/secteurs`, label: dict.nav.secteurs },
    { href: `/${lang}/projets`, label: dict.nav.projets },
    { href: `/${lang}/equipe`, label: dict.nav.equipe },
    { href: `/${lang}/blog`, label: dict.nav.blog },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <nav className={`hidden md:flex items-center gap-10 ${className ?? ""}`} style={style}>
      {items.map((item) => (
        <NavLink key={item.href} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
