import { SECTION_PX, Container } from "@/components/layout/Container";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import type { LegalPage } from "@/lib/legal-content";
import type { Locale } from "@/lib/i18n-config";

interface LegalDocumentProps {
  page: LegalPage;
  updatedAt: string;
  lang: Locale;
}

const DATE_LOCALE: Record<Locale, string> = { fr: "fr-DZ", ar: "ar-DZ", en: "en-GB" };

/**
 * Legal text, set like a contract page: short title block, dated, then
 * numbered articles in a prose measure. Server-rendered — the text is the
 * point here, not the motion.
 */
export function LegalDocument({ page, updatedAt, lang }: LegalDocumentProps) {
  const updated = new Date(updatedAt).toLocaleDateString(DATE_LOCALE[lang], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="bg-cream-soft">
        <div className={`${SECTION_PX} pt-20 lg:pt-28 pb-12 lg:pb-16`}>
          <Container variant="narrow" className="px-0 mx-0">
            <FadeIn>
              <span aria-hidden className="block w-14 h-px bg-gold mb-8" />
              <span
                className="block font-sans uppercase tracking-[0.2em] text-gold-ink mb-6"
                style={{ fontSize: "var(--text-caption)" }}
              >
                {page.eyebrow}
              </span>
              <h1
                className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "var(--text-h1)" }}
              >
                {page.heading}
              </h1>
              <p className="mt-6 font-sans text-muted text-[length:var(--text-small)]">
                {page.updatedLabel}
                {" : "}
                <time dateTime={updatedAt}>{updated}</time>
              </p>
            </FadeIn>
          </Container>
        </div>
      </section>

      <section className="bg-cream-soft">
        <div className={`${SECTION_PX} pb-24 lg:pb-32`}>
          <FadeInStagger className="max-w-[var(--container-narrow)] border-t border-line">
            {page.sections.map((section, i) => (
              <FadeInItem key={section.heading}>
                <article className="grid gap-4 py-10 lg:py-12 border-b border-line sm:grid-cols-12 sm:gap-8">
                  <div className="sm:col-span-4 flex items-baseline gap-4">
                    <span
                      className="font-display text-gold-ink tabular-nums"
                      style={{ fontSize: "var(--text-small)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2
                      className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {section.heading}
                    </h2>
                  </div>
                  <div className="sm:col-span-8 space-y-5">
                    {section.paragraphs.map((text) => (
                      <p
                        key={text}
                        className="font-sans text-ink-soft leading-[1.75] whitespace-pre-line text-[length:var(--text-body)]"
                      >
                        {text}
                      </p>
                    ))}
                  </div>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>
    </>
  );
}
