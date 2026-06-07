import { StickyHeader } from "./StickyHeader";
import { getDictionary, type Locale } from "@/lib/i18n";

interface HeaderProps {
  lang: Locale;
}

export async function Header({ lang }: HeaderProps) {
  const dict = await getDictionary(lang);

  const navItems = [
    { href: `/${lang}/services`, label: dict.nav.services },
    { href: `/${lang}/equipe`, label: dict.nav.equipe },
    { href: `/${lang}/contact`, label: dict.nav.contact },
  ];

  return (
    <StickyHeader
      lang={lang}
      navItems={navItems}
      ctaLabel={dict.nav.quote}
      ctaHref={`/${lang}/contact`}
    />
  );
}