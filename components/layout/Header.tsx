import Link from "next/link";
import Image from "next/image";
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
          overlay
            ? "bg-transparent border-b border-transparent"
            : "bg-cream-soft/90 [backdrop-filter:blur(12px)_saturate(1.4)] border-b border-line/60",
        ].join(" ")}
      >
        <Container className="h-full">
          <div className="flex items-center justify-between h-full">

            <Link
              href={`/${lang}`}
              className="header-item header-logo flex items-center gap-3"
              style={{ "--enter-delay": "0ms" } as React.CSSProperties}
            >
              <Image
                src="/logo.png"
                alt="BTH Expert"
                height={36}
                width={120}
                className="h-8 lg:h-9 w-auto"
                priority
              />
            </Link>

            <div className="flex items-center gap-7">
              <Nav
                lang={lang}
                dict={dict}
                className="header-item"
                style={{ "--enter-delay": "60ms" } as React.CSSProperties}
              />
              <div
                className="header-item"
                style={{ "--enter-delay": "120ms" } as React.CSSProperties}
              >
                <LangSwitcher currentLocale={lang} />
              </div>
              <Link
                href={`/${lang}/contact`}
                className="header-item hidden sm:inline-flex items-center px-5 py-2.5 rounded-sm bg-brand text-cream text-[0.9375rem] font-medium tracking-tight hover:bg-brand-soft hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                style={{ "--enter-delay": "180ms" } as React.CSSProperties}
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
