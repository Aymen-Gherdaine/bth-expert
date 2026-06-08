import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
import { HeaderShell } from "./HeaderShell";
import { Container } from "./Container";
import { Nav } from "./Nav";
import { LangSwitcher } from "./LangSwitcher";

interface HeaderProps {
  lang: Locale;
  overlay?: boolean;
}

export async function Header({ lang, overlay = false }: HeaderProps) {
  const dict = await getDictionary(lang);

  return (
    <HeaderShell overlay={overlay}>
      <Container className="h-full">
        <div className="flex items-center justify-between h-full">

          {/* Logo — text-ink works on cream; revisit for dark hero overlay in a later step */}
          <Link
            href={`/${lang}`}
            className="font-display font-medium text-xl lg:text-2xl tracking-tight text-ink transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:text-brand-soft"
          >
            BTH Expert
          </Link>

          {/* Right cluster */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Nav lang={lang} dict={dict} />
            <LangSwitcher currentLocale={lang} />
            <Link
              href={`/${lang}/contact`}
              className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-sm bg-brand text-cream text-[0.9375rem] font-medium tracking-tight transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:bg-brand-soft hover:tracking-[0.01em]"
            >
              {dict.nav.quote}
            </Link>
          </div>

        </div>
      </Container>
    </HeaderShell>
  );
}
