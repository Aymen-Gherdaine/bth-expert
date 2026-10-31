import Link from "next/link";
import { SECTION_PX } from "@/components/layout/Container";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { homeFiches, type RessourcesDict } from "@/lib/ressources";
import type { Locale } from "@/lib/i18n-config";

interface ReglementationSectionProps {
  lang: Locale;
  ressources: RessourcesDict;
}

const linkCls =
  "group inline-flex items-center gap-2 min-h-11 py-2 -my-2 font-sans font-medium text-[length:var(--text-small)] tracking-tight hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

/**
 * Regulatory register on the landing: the texts behind our studies, read from
 * the Keystatic « Ressources » collection (one line per fiche, `homeLine`).
 *
 * Breaks the eyebrow → title → paragraph → arrow rhythm of the other
 * sections on purpose: the display element is the text reference itself
 * ("07-145"), set like a ledger. It is also the most useful block on the
 * page for an industrial reader, and the one no template can ship.
 */
export function ReglementationSection({ lang, ressources }: ReglementationSectionProps) {
  const c = ressources.homeSection;
  const entries = homeFiches(ressources);
  if (entries.length === 0) return null;

  return (
    <section className="bg-cream-warm">
      <div className={`${SECTION_PX} py-24 lg:py-36`}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* ── Left: sticky intro ─────────────────────────────────── */}
          <div className="lg:col-span-4">
            <FadeIn className="lg:sticky lg:top-32">
              <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]">
                <span aria-hidden className="w-8 h-px bg-gold-ink" />
                {c.eyebrow}
              </span>
              <h2
                className="mt-8 font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {c.heading}
              </h2>
              <p className="mt-6 max-w-md font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                {c.intro}
              </p>
              <p className="mt-8 font-sans text-muted text-[length:var(--text-caption)] leading-[1.6]">
                {c.note}
              </p>
            </FadeIn>
          </div>

          {/* ── Right: the ledger ──────────────────────────────────── */}
          <FadeInStagger className="mt-14 lg:mt-0 lg:col-span-8 border-t border-line">
            {entries.map((entry) => (
              <FadeInItem key={entry.slug}>
                <article className="grid gap-x-8 gap-y-4 py-8 lg:py-10 border-b border-line sm:grid-cols-12">
                  <div className="sm:col-span-3">
                    <p
                      className="font-display font-light text-ink tracking-[-0.03em] leading-none tabular-nums"
                      style={{ fontSize: "clamp(2.25rem, 2.6vw + 1rem, 3.5rem)" }}
                      dir="ltr"
                    >
                      {entry.ref}
                    </p>
                    <p
                      className="mt-3 font-sans uppercase tracking-[0.14em] text-gold-ink"
                      style={{ fontSize: "var(--text-caption)" }}
                    >
                      {entry.typeLabel} · {entry.date}
                    </p>
                  </div>
                  <div className="sm:col-span-9">
                    <h3
                      className="font-display font-medium text-ink tracking-[-0.01em] leading-[1.25]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {entry.title}
                    </h3>
                    <p className="mt-3 font-sans text-ink-soft leading-[1.7] text-[length:var(--text-small)]">
                      {entry.homeLine}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-2">
                      <Link href={`/${lang}/ressources/${entry.slug}`} className={`${linkCls} text-brand`}>
                        <span aria-hidden className="w-5 h-px bg-gold shrink-0 group-hover:w-7 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
                        {ressources.readFiche}
                        <span aria-hidden className="inline-block ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)]">→</span>
                      </Link>
                      {entry.services[0] && (
                        <Link href={`/${lang}/services/${entry.services[0].slug}`} className={`${linkCls} text-ink-soft`}>
                          <span aria-hidden className="w-5 h-px bg-gold shrink-0 group-hover:w-7 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
                          {entry.services[0].label}
                          <span aria-hidden className="inline-block ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)]">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}
