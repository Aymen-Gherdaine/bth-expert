import Link from "next/link";
import { SECTION_PX } from "@/components/layout/Container";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { BlogList } from "@/components/sections/BlogList";
import type { ContentPage } from "@/lib/content";
import type { Fiche, RessourcesDict } from "@/lib/ressources";
import type { Locale } from "@/lib/i18n-config";

interface RessourcesIndexProps {
  lang: Locale;
  labels: RessourcesDict;
  textes: Fiche[];
  guide: Fiche | null;
  posts: ContentPage[];
  readMore: string;
  empty: string;
}

const arrowCls =
  "inline-flex items-center gap-2 min-h-11 font-sans font-medium text-brand text-[length:var(--text-small)] tracking-tight group-hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

/**
 * Resource centre index: the regulatory register (reference as the display
 * element), the procedure guide as a single wide plate, then the latest
 * blog articles. Three different rhythms on one page, on purpose.
 */
export function RessourcesIndex({ lang, labels, textes, guide, posts, readMore, empty }: RessourcesIndexProps) {
  return (
    <>
      {/* ── Textes ────────────────────────────────────────────────── */}
      <section className="bg-cream-soft">
        <div className={`${SECTION_PX} pb-20 lg:pb-28`}>
          <FadeIn className="lg:grid lg:grid-cols-12 lg:gap-12 mb-12 lg:mb-16">
            <span className="lg:col-span-4 inline-flex items-center gap-3 self-start font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]">
              <span aria-hidden className="w-8 h-px bg-gold-ink" />
              {labels.textesHeading}
            </span>
            <p className="mt-6 lg:mt-0 lg:col-span-6 lg:col-start-6 font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
              {labels.textesIntro}
            </p>
          </FadeIn>

          <FadeInStagger className="border-t border-line">
            {textes.map((f) => (
              <FadeInItem key={f.slug}>
                <Link
                  href={`/${lang}/ressources/${f.slug}`}
                  className="group grid gap-4 py-10 lg:py-12 border-b border-line lg:grid-cols-12 lg:gap-12"
                >
                  <div className="lg:col-span-3">
                    <p
                      className="font-display font-light text-ink tracking-[-0.03em] leading-none tabular-nums transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                      style={{ fontSize: "clamp(2.5rem, 3vw + 1rem, 4rem)" }}
                      dir="ltr"
                    >
                      {f.ref}
                    </p>
                    <p
                      className="mt-3 font-sans uppercase tracking-[0.14em] text-gold-ink"
                      style={{ fontSize: "var(--text-caption)" }}
                    >
                      {f.typeLabel} · {f.date}
                    </p>
                  </div>
                  <div className="lg:col-span-8 lg:col-start-5">
                    <h2
                      className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                      style={{ fontSize: "var(--text-h2)" }}
                    >
                      {f.title}
                    </h2>
                    <p className="mt-4 max-w-2xl font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                      {f.summary}
                    </p>
                    <span className={`${arrowCls} mt-5`}>
                      <span aria-hidden className="w-5 h-px bg-gold shrink-0 group-hover:w-7 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
                      {labels.readFiche}
                    </span>
                  </div>
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>

      {/* ── Guide ─────────────────────────────────────────────────── */}
      {guide && (
        <section className="bg-brand-deep text-cream">
          <div className={`${SECTION_PX} py-20 lg:py-28`}>
            <FadeIn className="lg:grid lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)]">
                  <span aria-hidden className="w-8 h-px bg-gold" />
                  {labels.guideHeading}
                </span>
                <ol className="mt-8 border-t border-cream/15">
                  {guide.sections.slice(0, 6).map((s, i) => (
                    <li key={s.heading} className="flex items-baseline gap-4 py-3 border-b border-cream/15">
                      <span className="font-display text-gold tabular-nums" style={{ fontSize: "var(--text-small)" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-sans text-cream/85 text-[length:var(--text-small)]">{s.heading}</span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mt-12 lg:mt-0 lg:col-span-7 lg:col-start-6">
                <h2
                  className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05]"
                  style={{ fontSize: "var(--text-h1)" }}
                >
                  {guide.title}
                </h2>
                <p className="mt-6 max-w-xl font-sans text-cream/75 leading-[1.75] text-[length:var(--text-body)]">
                  {guide.summary}
                </p>
                <Link
                  href={`/${lang}/ressources/${guide.slug}`}
                  className="mt-10 inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  {labels.readGuide}
                </Link>
              </div>
            </FadeIn>
          </div>
        </section>
      )}

      {/* ── Articles ──────────────────────────────────────────────── */}
      <section className="bg-cream-soft">
        <div className={`${SECTION_PX} pt-20 lg:pt-28 pb-24 lg:pb-32`}>
          <FadeIn className="flex flex-wrap items-baseline justify-between gap-6 mb-10 lg:mb-14">
            <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]">
              <span aria-hidden className="w-8 h-px bg-gold-ink" />
              {labels.articlesHeading}
            </span>
            <Link
              href={`/${lang}/blog`}
              className="group inline-flex items-center gap-2 min-h-11 font-sans font-medium text-brand text-[length:var(--text-small)] tracking-tight hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              {labels.articlesLink}
              <span aria-hidden className="inline-block rtl:-scale-x-100 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1">→</span>
            </Link>
          </FadeIn>
          <BlogList lang={lang} posts={posts} startIndex={0} empty={empty} readMore={readMore} />
        </div>
      </section>
    </>
  );
}
