import Link from "next/link";
import { Container } from "./Container";
import { getDictionary, type Locale } from "@/lib/i18n";

interface FooterProps {
  lang: Locale;
}

export async function Footer({ lang }: FooterProps) {
  const dict = await getDictionary(lang);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand text-cream mt-40 lg:mt-56">
      <Container>
        <div className="py-24 grid gap-16 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-6">
            <div className="font-display text-3xl tracking-tight mb-6">
              BTH Expert
            </div>
            <p className="text-[var(--color-on-brand-muted)] text-sm leading-relaxed max-w-sm">
              {dict.metadata.homeDescription}
            </p>
          </div>

          {/* Contact */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              {dict.nav.contact}
            </h4>
            <ul className="space-y-2.5 text-sm text-[var(--color-on-brand-muted)]">
              <li>
                <a href="mailto:info@bthexpert.dz" className="hover:text-[var(--color-gold)] transition-colors duration-300 ease-[var(--ease-out-expo)]">
                  info@bthexpert.dz
                </a>
              </li>
              <li>
                <a href="tel:+213670708138" className="hover:text-[var(--color-gold)] transition-colors duration-300 ease-[var(--ease-out-expo)]">
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

          {/* Zones d'intervention + Liens */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              {dict.footer.zones}
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-on-brand-muted)]">
              <li>
                <Link href={`/${lang}/oran`} className="hover:text-[var(--color-gold)] transition-colors duration-300 ease-[var(--ease-out-expo)]">
                  Oran
                </Link>
              </li>
              <li className="text-[var(--color-on-brand-faint)] text-xs leading-relaxed pt-1">
                Mostaganem · Tlemcen<br />
                Sidi Bel Abbès · Relizane<br />
                Mascara · Aïn Témouchent
              </li>
            </ul>

            <h4 className="text-xs uppercase tracking-widest text-gold mb-4 mt-8">
              Liens
            </h4>
            <ul className="space-y-2 text-sm text-[var(--color-on-brand-muted)]">
              <li>
                <Link href={`/${lang}/secteurs`} className="hover:text-[var(--color-gold)] transition-colors duration-300 ease-[var(--ease-out-expo)]">
                  {dict.nav.secteurs}
                </Link>
              </li>
              <li>
                <Link href={`/${lang}/blog`} className="hover:text-[var(--color-gold)] transition-colors duration-300 ease-[var(--ease-out-expo)]">
                  {dict.nav.blog}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-[color-mix(in_srgb,var(--color-cream)_15%,var(--color-brand))] py-6 flex items-center justify-between text-xs text-[var(--color-on-brand-faint)]">
          <span>© {year} BTH Expert. {dict.footer.rights}.</span>
          <span className="hidden sm:inline">Bir El Djir, Oran · Algérie</span>
        </div>
      </Container>
    </footer>
  );
}