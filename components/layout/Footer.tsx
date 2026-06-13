import Link from "next/link";
import Image from "next/image";
import { Container } from "./Container";
import { LangSwitcher } from "./LangSwitcher";
import { getDictionary, type Locale } from "@/lib/i18n";

interface FooterProps {
  lang: Locale;
}

const linkClass =
  "hover:text-[var(--color-gold)] transition-colors duration-300 ease-[var(--ease-out-expo)]";

const columnHeaderClass =
  "text-xs uppercase tracking-widest text-gold mb-5 pt-4 border-t border-[color-mix(in_srgb,var(--color-cream)_15%,var(--color-brand-deep))]";

export async function Footer({ lang }: FooterProps) {
  const dict = await getDictionary(lang);
  const year = new Date().getFullYear();

  return (
    // GISI-style reveal: footer sticks to the viewport bottom behind the
    // z-indexed page content (<main>), which slides up to uncover it at
    // the end of the scroll. No fixed positioning, no measured heights.
    <footer className="sticky bottom-0 z-0 bg-brand-deep text-cream">
      <Container>
        <div className="pt-20 lg:pt-28 pb-16 grid gap-x-10 gap-y-14 grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4 lg:pe-12">
            <Image
              src="/bth-expert-logo-light-transparent.svg"
              alt="BTH Expert"
              width={530}
              height={149}
              className="h-12 w-auto mb-6 brightness-0 invert"
            />
            <p className="text-[var(--color-on-brand-muted)] text-sm leading-relaxed max-w-sm mb-8">
              {dict.metadata.homeDescription}
            </p>
            <div className="flex gap-6 text-sm text-[var(--color-on-brand-muted)]">
              {/* TODO: real profile URLs once the client provides them */}
              <a href="#" aria-label="LinkedIn" className={linkClass}>
                LinkedIn
              </a>
              <a href="#" aria-label="Facebook" className={linkClass}>
                Facebook
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3">
            <h4 className={columnHeaderClass}>{dict.footer.navigation}</h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-on-brand-muted)]">
              <li>
                <Link href={`/${lang}/equipe`} className={linkClass}>
                  {dict.footer.about}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/services`} className={linkClass}>
                  {dict.nav.services}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/projets`} className={linkClass}>
                  {dict.nav.projets}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className={linkClass}>
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Secteurs */}
          <div className="lg:col-span-2">
            <h4 className={columnHeaderClass}>{dict.nav.secteurs}</h4>{/* span balanced after removing Zones */}
            <ul className="space-y-2.5 text-sm text-[var(--color-on-brand-muted)]">
              {dict.footer.secteursList.map((secteur) => (
                <li key={secteur}>{secteur}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className={columnHeaderClass}>{dict.nav.contact}</h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-on-brand-muted)]">
              <li>
                <a href="mailto:info@bthexpert.dz" className={linkClass}>
                  info@bthexpert.dz
                </a>
              </li>
              <li>
                <a href="tel:+213670708138" className={linkClass}>
                  +213 670 70 81 38
                </a>
              </li>
              <li className="text-[var(--color-on-brand-faint)] text-xs leading-relaxed pt-2">
                40, Lotissement 119<br />
                Bir El Djir, Oran<br />
                Algérie
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[color-mix(in_srgb,var(--color-cream)_15%,var(--color-brand-deep))] py-6 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--color-on-brand-faint)]">
          <span>© {year} BTH Expert. {dict.footer.rights}.</span>
          <LangSwitcher currentLocale={lang} isDark />
        </div>
      </Container>
    </footer>
  );
}