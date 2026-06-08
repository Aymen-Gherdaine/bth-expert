import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";
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
    <>
      <header
        data-overlay={overlay ? "true" : "false"}
        className={[
          "fixed inset-x-0 top-0 z-50 h-14 lg:h-16",
          // Default state — solid on non-overlay pages; fallback for browsers
          // without animation-timeline support.
          overlay
            ? "bg-transparent border-b border-transparent"
            : "bg-cream-soft/90 [backdrop-filter:blur(12px)_saturate(1.4)] border-b border-line/60",
        ].join(" ")}
      >
        <Container className="h-full">
          <div className="flex items-center justify-between h-full">

            {/* Logo — text-ink for cream backgrounds; revisit for dark hero overlay */}
            <Link
              href={`/${lang}`}
              className="font-display text-xl tracking-tight text-ink"
            >
              BTH Expert
            </Link>

            <div className="flex items-center gap-7">
              <Nav lang={lang} dict={dict} />
              <LangSwitcher currentLocale={lang} />
              <Link
                href={`/${lang}/contact`}
                className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-sm bg-brand text-cream text-[0.9375rem] font-medium tracking-tight hover:bg-brand-soft hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
              >
                {dict.nav.quote}
              </Link>
            </div>

          </div>
        </Container>
      </header>

      {/* Spacer: push content below fixed header on non-overlay pages.
          Overlay pages (cinematic hero) sit intentionally under. */}
      {!overlay && <div aria-hidden className="h-14 lg:h-16" />}
    </>
  );
}
