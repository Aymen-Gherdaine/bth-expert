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
  "text-xs uppercase tracking-widest text-gold mb-4 pt-4 border-t border-[color-mix(in_srgb,var(--color-cream)_15%,var(--color-brand-deep))]";

export async function Footer({ lang }: FooterProps) {
  const dict = await getDictionary(lang);
  const year = new Date().getFullYear();

  return (
    // GISI-style reveal: footer sticks to the viewport bottom behind the
    // z-indexed page content (<main>), which slides up to uncover it at
    // the end of the scroll. No fixed positioning, no measured heights.
    // Mobile: the footer is taller than the viewport, so `sticky bottom-0`
    // would pin its top off-screen (logo unreachable) AND bleed through the
    // translucent header — so the reveal is gated to lg, normal flow below.
    <footer className="relative lg:sticky bottom-0 z-0 bg-brand-deep text-cream">
      <Container>
        <div className="pt-12 lg:pt-28 pb-8 lg:pb-16 grid gap-x-8 gap-y-8 lg:gap-y-14 grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-4 lg:pe-12">
            <Image
              src="/bth-expert-logo-light-transparent.svg"
              alt="BTH Expert"
              width={530}
              height={149}
              className="h-10 lg:h-12 w-auto mb-5"
            />
            <p className="text-[var(--color-on-brand-muted)] text-sm leading-relaxed max-w-sm mb-6">
              {dict.metadata.homeDescription}
            </p>
            <div className="flex gap-6 text-sm text-[var(--color-on-brand-muted)]">
              <a href="#" aria-label="LinkedIn" className={linkClass}>
                LinkedIn
              </a>
              <a href="#" aria-label="Facebook" className={linkClass}>
                Facebook
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="col-span-1 lg:col-span-3">
            <h4 className={columnHeaderClass}>{dict.footer.navigation}</h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-on-brand-muted)]">
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
                <Link href={`/${lang}/equipe`} className={linkClass}>
                  {dict.nav.equipe}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/contact`} className={linkClass}>
                  {dict.nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Expertises — the four service pages (aligned to the comp) */}
          <div className="col-span-1 lg:col-span-2">
            <h4 className={columnHeaderClass}>Expertises</h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-on-brand-muted)]">
              <li>
                <Link href={`/${lang}/services/etude-impact-environnemental`} className={linkClass}>
                  Étude d&apos;impact
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/services/etude-de-dangers`} className={linkClass}>
                  Étude de dangers
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/services/audit-hse`} className={linkClass}>
                  Audit HSE
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/services/plan-gestion-environnementale`} className={linkClass}>
                  Plan de gestion
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 lg:col-span-3">
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
        <div className="border-t border-[color-mix(in_srgb,var(--color-cream)_15%,var(--color-brand-deep))] py-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-[var(--color-on-brand-faint)]">
          <span>© {year} BTH Expert. {dict.footer.rights}.</span>
          <LangSwitcher currentLocale={lang} isDark />
        </div>
      </Container>
    </footer>
  );
}