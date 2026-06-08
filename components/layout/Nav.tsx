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
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/projets`, label: dict.nav.projets },
    { href: `/${lang}/equipe`, label: dict.nav.equipe },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <nav className={`hidden md:flex items-center gap-9 ${className ?? ""}`} style={style}>
      {items.map((item) => (
        <NavLink key={item.href} href={item.href}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
