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
    <footer className="bg-brand text-cream mt-32">
      <Container>
        <div className="py-20 grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="font-display text-2xl tracking-wide mb-4">
              BTH <em className="not-italic text-gold">Expert</em>
            </div>
            <p className="text-cream/60 text-sm leading-relaxed max-w-sm">
              {dict.metadata.homeDescription}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              {dict.nav.contact}
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <a href="mailto:info@bthexpert.dz" className="hover:text-gold transition-colors">
                  info@bthexpert.dz
                </a>
              </li>
              <li>
                <a href="tel:+213670708138" className="hover:text-gold transition-colors">
                  +213 670 70 81 38
                </a>
              </li>
              <li className="text-cream/60 text-xs leading-relaxed pt-2">
                40, Lotissement 119<br />
                Bir El Djir, Oran<br />
                Algérie
              </li>
            </ul>
          </div>

          {/* Zones d'intervention */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gold mb-4">
              {dict.footer.zones}
            </h4>
            <ul className="space-y-2 text-sm text-cream/80">
              <li>
                <Link href={`/${lang}/oran`} className="hover:text-gold transition-colors">
                  Oran
                </Link>
              </li>
              <li className="text-cream/60 text-xs leading-relaxed pt-1">
                Mostaganem · Tlemcen<br />
                Sidi Bel Abbès · Relizane<br />
                Mascara · Aïn Témouchent
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="border-t border-cream/10 py-6 flex items-center justify-between text-xs text-cream/40">
          <span>© {year} BTH Expert. {dict.footer.rights}.</span>
          <span className="hidden sm:inline">Bir El Djir, Oran · Algérie</span>
        </div>
      </Container>
    </footer>
  );
}