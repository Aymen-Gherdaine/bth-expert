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
            <div className="flex gap-3">
              {[
                {
                  label: "LinkedIn",
                  href: "#",
                  d: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z",
                },
                {
                  label: "Instagram",
                  href: "#",
                  d: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.39A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
                },
                {
                  label: "Facebook",
                  href: "#",
                  d: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex items-center justify-center size-9 rounded-full bg-[color-mix(in_srgb,var(--color-cream)_10%,transparent)] text-cream/70 hover:bg-gold hover:text-brand-deep transition-colors duration-300 ease-[var(--ease-out-expo)]"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
                    <path d={s.d} />
                  </svg>
                </a>
              ))}
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