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
    <header className="sticky top-0 z-50 bg-cream/85 backdrop-blur-md border-b border-line">
      <Container>
        <div className="flex items-center justify-between h-16">
          <Link href={`/${lang}`} className="font-display text-xl tracking-wide text-brand">
            BTH <em className="not-italic text-gold">Expert</em>
          </Link>

          <div className="flex items-center gap-7">
            <Nav lang={lang} dict={dict} />
            <LangSwitcher currentLocale={lang} />
            <Link
              href={`/${lang}/contact`}
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full bg-brand text-cream text-sm font-medium hover:bg-brand-deep transition-colors duration-200"
            >
              {dict.nav.quote}
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}