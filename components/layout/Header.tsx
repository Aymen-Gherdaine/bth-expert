import Link from "next/link";
import { Container } from "./Container";
import { Nav } from "./Nav";
import { LangSwitcher } from "./LangSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n";

interface HeaderProps {
  lang: Locale;
}

export async function Header({ lang }: HeaderProps) {
  const dict = await getDictionary(lang);

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-line">
      <Container>
        <div className="flex items-center justify-between h-20 lg:h-24">
          <Link
            href={`/${lang}`}
            className="font-display text-2xl tracking-tight text-brand"
          >
            BTH Expert
          </Link>

          <div className="flex items-center gap-8">
            <Nav lang={lang} dict={dict} />
            <LangSwitcher currentLocale={lang} />
            <Link
              href={`/${lang}/contact`}
              className="hidden sm:inline-flex items-center px-6 py-3 rounded-sm bg-brand text-cream text-[0.9375rem] font-medium tracking-tight hover:bg-brand-soft transition-[background-color] duration-300 ease-[var(--ease-out-expo)]"
            >
              {dict.nav.quote}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}