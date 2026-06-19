import Link from "next/link";
import { ServiceHero } from "./ServiceHero";
import { MethodPinScroll } from "./MethodPinScroll";
import { Faq } from "./Faq";
import { FadeIn } from "@/components/motion/FadeIn";
import type { Locale } from "@/lib/i18n";

interface MetaItem {
  label: string;
  value: string;
}

interface FaqItem {
  q: string;
  a: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
}

interface ServiceContent {
  hero: { eyebrow: string; heading: string; subheading: string };
  why: { heading: string; description: string };
  methodology: { heading: string; steps: Step[] };
  deliverable: { heading: string; description: string };
  cta: { heading: string; description: string; button: string };
}

interface ServicePageBodyProps {
  lang: Locale;
  service: ServiceContent;
  heroMeta?: MetaItem[];
  faq?: FaqItem[];
  faqHeading?: string;
  heroImage?: string;
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

const METHOD_LABEL: Record<Locale, string> = {
  fr: "Méthode",
  ar: "المنهجية",
  en: "Method",
};

const FAQ_HEADING: Record<Locale, string> = {
  fr: "Questions fréquentes",
  ar: "الأسئلة الشائعة",
  en: "Frequently asked questions",
};

/**
 * Shared premium body for the four service pages (option B): editorial light
 * hero + meta rail → POV contexte → methodology pin-scroll (image-led) → dark
 * livrable punctuation → FAQ → CTA.
 */
export function ServicePageBody({
  lang,
  service,
  heroMeta,
  faq,
  faqHeading,
  heroImage,
}: ServicePageBodyProps) {
  return (
    <>
      <ServiceHero
        eyebrow={service.hero.eyebrow}
        heading={service.hero.heading}
        subheading={service.hero.subheading}
        meta={heroMeta}
      />

      {/* Contexte — editorial asymmetric block (from `why`) */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-20 lg:pb-28`}>
          <div className="border-t border-line pt-16 lg:pt-20 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <div className="lg:col-span-4 mb-8 lg:mb-0">
              <FadeIn>
                <h2
                  className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15]"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {service.why.heading}
                </h2>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FadeIn>
                <p
                  className="font-sans text-ink-soft leading-[1.8]"
                  style={{ fontSize: "clamp(1.0625rem, 0.4vw + 0.95rem, 1.25rem)" }}
                >
                  {service.why.description}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Méthode — pin-scroll, image-led */}
      <MethodPinScroll
        heading={service.methodology.heading}
        steps={service.methodology.steps}
        image={heroImage}
        methodLabel={METHOD_LABEL[lang]}
      />

      {/* Livrable — dark punctuation band */}
      <section className="bg-brand-deep">
        <div className={`${PADX} py-24 lg:py-32`}>
          <FadeIn>
            <span aria-hidden className="block w-14 h-px bg-gold mb-8" />
            <span className="block font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)]">
              {service.deliverable.heading}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="mt-8 font-display font-light text-cream tracking-[-0.02em] leading-[1.3] max-w-4xl"
              style={{ fontSize: "var(--text-h2)" }}
            >
              {service.deliverable.description}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* FAQ — only when content is supplied */}
      {faq && faq.length > 0 && (
        <Faq heading={faqHeading ?? FAQ_HEADING[lang]} items={faq} />
      )}

      {/* CTA */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-24 lg:pb-32`}>
          <div className="border-t border-line pt-16 lg:pt-20 lg:grid lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-7">
              <h2
                className="font-display font-light text-ink tracking-[-0.03em] leading-[1.1] mb-6"
                style={{ fontSize: "var(--text-h1)" }}
              >
                {service.cta.heading}
              </h2>
              <p className="font-sans text-ink-soft leading-[1.7] text-[length:var(--text-body)] mb-9 max-w-xl">
                {service.cta.description}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] hover:scale-[1.02] active:scale-[0.98] transition-[background-color,letter-spacing,transform] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
              >
                {service.cta.button}
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
