import Link from "next/link";
import Image from "next/image";
import { getDictionary, type Locale } from "@/lib/i18n";
import { Container } from "./Container";
import { Nav } from "./Nav";
import { LangSwitcher } from "./LangSwitcher";
import { HeaderScrollState } from "./HeaderScrollState";
import { MobileMenu } from "./MobileMenu";

interface HeaderProps {
  lang: Locale;
  overlay?: boolean;
}

/**
 * Two-tier institutional header (Cain Lamarre pattern):
 * - Utility topbar: phone + email left, languages right. Slides away on
 *   scroll (scroll-driven animation, see globals.css `.header-topbar`).
 * - Main bar: logo + nav only — no CTA button, premium through space.
 * On overlay pages both tiers sit transparent over the dark hero, then
 * the main bar solidifies to cream on scroll (header-solidify).
 */
export async function Header({ lang, overlay = false }: HeaderProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <div
        id="site-header"
        data-overlay={overlay ? "true" : "false"}
        data-solid="false"
        className="fixed inset-x-0 top-0 z-50"
      >
        <HeaderScrollState />

        {/* ── Utility topbar — collapses on scroll ─────────────────── */}
        <div
          data-overlay={overlay ? "true" : "false"}
          className={[
            "header-topbar h-9 overflow-hidden",
            overlay
              ? "border-b border-cream/10"
              : "bg-white/95 border-b border-line/40",
          ].join(" ")}
        >
          <Container className="h-full">
            <div className="flex items-center justify-between h-full">
              <div
                className={[
                  "flex items-center gap-6 font-sans",
                  overlay ? "text-cream/75" : "text-muted",
                ].join(" ")}
                style={{ fontSize: "0.75rem", letterSpacing: "0.04em" }}
              >
                <a
                  href="tel:+213670708138"
                  className="hover:text-gold transition-colors duration-[var(--duration-fast)]"
                >
                  +213 (670) 70 81 38
                </a>
                <a
                  href="mailto:info@bthexpert.dz"
                  className="hidden sm:inline hover:text-gold transition-colors duration-[var(--duration-fast)]"
                >
                  info@bthexpert.dz
                </a>
              </div>
              <LangSwitcher currentLocale={lang} isDark={overlay} />
            </div>
          </Container>
        </div>

        {/* ── Main bar — logo + nav, solidifies on scroll ──────────── */}
        <header
          data-overlay={overlay ? "true" : "false"}
          className={[
            "h-16 lg:h-[4.5rem]",
            overlay
              ? "bg-transparent border-b border-transparent"
              : "bg-white/95 border-b border-line/50",
          ].join(" ")}
        >
          <Container className="h-full">
            <div className="flex items-center justify-between h-full">

              <Link
                href={`/${lang}`}
                className="header-item header-logo flex items-center gap-3"
                style={{ "--enter-delay": "0ms" } as React.CSSProperties}
              >
                <div className="relative h-9 lg:h-11">
                  <Image
                    src="/bth-expert-logo-dark-transparent.svg"
                    alt="BTH Expert"
                    height={44}
                    width={157}
                    className="header-logo-dark h-full w-auto"
                    priority
                  />
                  <Image
                    src="/bth-expert-logo-light-transparent.svg"
                    alt=""
                    height={44}
                    width={157}
                    className="header-logo-light absolute inset-0 h-full w-auto opacity-0"
                    priority
                  />
                </div>
              </Link>

              <Nav
                lang={lang}
                dict={dict}
                className="header-item"
                style={{ "--enter-delay": "60ms" } as React.CSSProperties}
              />

              <MobileMenu
                items={[
                  { href: `/${lang}/services`, label: dict.nav.services },
                  { href: `/${lang}/secteurs`, label: dict.nav.secteurs },
                  { href: `/${lang}/projets`, label: dict.nav.projets },
                  { href: `/${lang}/a-propos`, label: dict.nav.apropos },
                  { href: `/${lang}/equipe`, label: dict.nav.equipe },
                  { href: `/${lang}/contact`, label: dict.nav.contact },
                ]}
                phone="+213 (670) 70 81 38"
                email="info@bthexpert.dz"
                ctaLabel={dict.nav.quote}
                ctaHref={`/${lang}/contact`}
              />

            </div>
          </Container>
        </header>

      </div>

      {/* Spacer: push content below fixed header on non-overlay pages.
          Overlay pages (cinematic hero) sit intentionally under. */}
      {!overlay && <div aria-hidden className="h-[6.25rem] lg:h-[6.75rem]" />}
    </>
  );
}
