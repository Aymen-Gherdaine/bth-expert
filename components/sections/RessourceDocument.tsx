import Link from "next/link";
import { SECTION_PX } from "@/components/layout/Container";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { Faq } from "@/components/sections/Faq";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import type { Fiche, RessourcesDict } from "@/lib/ressources";
import type { Locale } from "@/lib/i18n-config";

interface RessourceDocumentProps {
  lang: Locale;
  fiche: Fiche;
  labels: RessourcesDict;
  related: Fiche[];
  updatedAt: string;
}

const DATE_LOCALE: Record<Locale, string> = { fr: "fr-DZ", ar: "ar-DZ", en: "en-GB" };

const paragraphCls =
  "font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]";

const arrowLinkCls =
  "group inline-flex items-center gap-2 min-h-11 py-2 -my-2 font-sans font-medium text-brand text-[length:var(--text-small)] tracking-tight hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

/**
 * One regulatory sheet or the procedure guide. The light ServiceHero carries
 * the text's identity (reference, date, authority rail); the body is a
 * numbered ledger like the legal pages; FAQ feeds the FAQPage schema.
 */
export function RessourceDocument({ lang, fiche, labels, related, updatedAt }: RessourceDocumentProps) {
  const updated = new Date(updatedAt).toLocaleDateString(DATE_LOCALE[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const eyebrow = fiche.date ? `${fiche.typeLabel} · ${fiche.date}` : fiche.typeLabel;

  return (
    <>
      <ServiceHero eyebrow={eyebrow} heading={fiche.title} subheading={fiche.summary} meta={fiche.meta} />

      {/* ── Official title strip ───────────────────────────────────── */}
      <section className="bg-cream-warm">
        <div className={`${SECTION_PX} py-8 lg:py-10`}>
          <FadeIn className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-2">
              <span
                className="font-display font-light text-ink tracking-[-0.03em] leading-none tabular-nums"
                style={{ fontSize: "clamp(2rem, 2.4vw + 0.75rem, 3.25rem)" }}
                dir="ltr"
              >
                {fiche.ref}
              </span>
            </div>
            <p className="mt-4 lg:mt-0 lg:col-span-8 font-display font-light text-ink tracking-[-0.01em] leading-[1.3] text-[length:var(--text-h3)]">
              {fiche.officialTitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Ledger ────────────────────────────────────────────────── */}
      <section className="bg-cream-soft">
        <div className={`${SECTION_PX} pt-16 lg:pt-24 pb-20 lg:pb-28`}>
          <FadeInStagger className="border-t border-line">
            {fiche.sections.map((section, i) => (
              <FadeInItem key={section.heading}>
                <article className="grid gap-4 py-10 lg:py-14 border-b border-line lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-4 flex items-baseline gap-5">
                    <span
                      className="font-display text-gold-ink tabular-nums shrink-0"
                      style={{ fontSize: "var(--text-small)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2
                      className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15]"
                      style={{ fontSize: "var(--text-h2)" }}
                    >
                      {section.heading}
                    </h2>
                  </div>
                  <div className="lg:col-span-7 lg:col-start-6 space-y-5">
                    {section.paragraphs.map((text) => (
                      <p key={text} className={paragraphCls}>
                        {text}
                      </p>
                    ))}
                    {section.list.length > 0 && (
                      <ul className="space-y-3 ps-5 list-disc marker:text-gold-ink">
                        {section.list.map((item) => (
                          <li key={item} className={paragraphCls}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {section.after && <p className={paragraphCls}>{section.after}</p>}
                  </div>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>

          {/* ── Services + related texts ──────────────────────────── */}
          <div className="mt-16 lg:mt-24 grid gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-5">
              <FadeIn>
                <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]">
                  <span aria-hidden className="w-8 h-px bg-gold-ink" />
                  {labels.servicesHeading}
                </span>
                <ul className="mt-6 border-t border-line">
                  {fiche.services.map((svc) => (
                    <li key={svc.slug} className="border-b border-line">
                      <Link
                        href={`/${lang}/services/${svc.slug}`}
                        className="group flex items-center justify-between gap-6 py-4 min-h-11 font-display font-light text-ink tracking-[-0.01em] hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                        style={{ fontSize: "var(--text-h3)" }}
                      >
                        {svc.label}
                        <span
                          aria-hidden
                          className="font-sans text-gold-ink transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </FadeIn>
            </div>

            {related.length > 0 && (
              <div className="lg:col-span-6 lg:col-start-7">
                <FadeIn>
                  <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]">
                    <span aria-hidden className="w-8 h-px bg-gold-ink" />
                    {labels.relatedHeading}
                  </span>
                  <ul className="mt-6 border-t border-line">
                    {related.map((r) => (
                      <li key={r.slug} className="border-b border-line">
                        <Link
                          href={`/${lang}/ressources/${r.slug}`}
                          className="group flex items-baseline gap-5 py-4 min-h-11 hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                        >
                          <span
                            className="font-display text-gold-ink tabular-nums shrink-0 w-16"
                            style={{ fontSize: "var(--text-small)" }}
                            dir="ltr"
                          >
                            {r.ref}
                          </span>
                          <span
                            className="font-display font-light text-ink tracking-[-0.01em] leading-[1.25] group-hover:text-brand"
                            style={{ fontSize: "var(--text-h3)" }}
                          >
                            {r.title}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FadeIn>
              </div>
            )}
          </div>

          <FadeIn className="mt-14 lg:mt-20 max-w-2xl">
            <p className="font-sans text-muted text-[length:var(--text-caption)] leading-[1.6]">
              {labels.note}
            </p>
            <p className="mt-3 font-sans text-muted text-[length:var(--text-caption)]">
              {labels.updatedLabel}
              {" : "}
              <time dateTime={updatedAt}>{updated}</time>
            </p>
            <Link href={`/${lang}/ressources`} className={`${arrowLinkCls} mt-6`}>
              <span aria-hidden className="inline-block rtl:-scale-x-100">←</span>
              {labels.backLabel}
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      {fiche.faq.length > 0 && <Faq heading={labels.faqHeading} items={fiche.faq} />}

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="bg-cream-soft">
        <div className={`${SECTION_PX} pt-6 pb-24 lg:pb-32`}>
          <FadeIn className="border-t border-line pt-14 lg:pt-20 max-w-3xl">
            <h2
              className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "var(--text-h1)" }}
            >
              {labels.cta.heading}
            </h2>
            <p className="mt-6 max-w-xl font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
              {labels.cta.description}
            </p>
            <Link
              href={`/${lang}/contact`}
              className="mt-10 inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              {labels.cta.button}
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
