import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService, schemaBreadcrumb } from "@/lib/schema";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { TerrainBackdrop } from "@/components/sections/Terrain";
import fr from "@/dictionaries/fr.json";

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export function generateStaticParams() {
  return fr.secteurs.list.map((s) => ({ secteur: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; secteur: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, secteur } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const item = dict.secteurs.list.find((s) => s.slug === secteur);
  if (!item) return {};

  return buildMetadata({
    lang,
    path: `/secteurs/${secteur}`,
    title: item.title,
    description: item.tagline,
  });
}

export default async function SecteurPage({
  params,
}: {
  params: Promise<{ lang: string; secteur: string }>;
}) {
  const { lang: rawLang, secteur } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const s = dict.secteurs;
  const item = s.list.find((x) => x.slug === secteur);
  if (!item) notFound();

  const jsonLd = schemaService({
    name: item.title,
    url: `https://bthexpert.com/${lang}/secteurs/${secteur}`,
    description: item.tagline,
    serviceType: item.title,
    lang,
  });
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.secteurs, url: `https://bthexpert.com/${lang}/secteurs` },
    { name: item.title, url: `https://bthexpert.com/${lang}/secteurs/${secteur}` },
  ]);

  const chipCls =
    "inline-flex items-center rounded-full border border-line px-4 py-2 text-[length:var(--text-small)] text-ink-soft transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:border-gold hover:text-ink";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Hero — shared editorial light hero ───────────────── */}
      <ServiceHero
        eyebrow={s.hero.eyebrow}
        heading={item.title}
        subheading={item.intro}
      />

      {/* ── Enjeux clés — numbered editorial rhythm ──────────── */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-20 lg:pb-28`}>
          <div className="border-t border-line pt-16 lg:pt-20">
            <FadeIn>
              <span className="inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)]">
                <span aria-hidden className="w-8 h-px bg-gold" />
                {s.enjeuxLabel}
              </span>
            </FadeIn>

            <FadeInStagger className="mt-10 lg:mt-14 border-t border-line">
              {item.enjeux.map((enjeu, index) => (
                <FadeInItem key={enjeu.title}>
                  <div className="group border-b border-line py-9 lg:py-12 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
                    <div className="lg:col-span-2 mb-4 lg:mb-0">
                      <span
                        aria-hidden
                        className="font-display font-light text-gold/80 tabular-nums leading-none tracking-[-0.02em]"
                        style={{ fontSize: "clamp(2.25rem, 3vw + 1rem, 3.5rem)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="lg:col-span-4 mb-3 lg:mb-0">
                      <h3
                        className="font-display font-light text-ink tracking-[-0.02em] leading-[1.18]"
                        style={{ fontSize: "var(--text-h3)" }}
                      >
                        {enjeu.title}
                      </h3>
                    </div>
                    <div className="lg:col-span-6 lg:col-start-7 flex items-center">
                      <p className="font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                        {enjeu.description}
                      </p>
                    </div>
                  </div>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* ── Punctuation — dark band over the sector's bespoke artwork ── */}
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <TerrainBackdrop src={`/generated/sector-${secteur}.svg`} />
        <div className={`relative z-10 ${PADX} py-24 lg:py-32`}>
          <FadeIn>
            <span aria-hidden className="block w-14 h-px bg-gold mb-8" />
            <span className="block font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)]">
              {s.hero.eyebrow}
            </span>
          </FadeIn>
          <FadeIn delay={0.1}>
            <p
              className="mt-8 font-display font-light text-cream tracking-[-0.02em] leading-[1.3] max-w-4xl"
              style={{ fontSize: "var(--text-h2)" }}
            >
              {item.tagline}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Domaines couverts + prestations — chip blocks ────── */}
      <section className="bg-cream-deep">
        <div className={`${PADX} py-20 lg:py-28`}>
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <FadeIn className="mb-14 lg:mb-0">
              <h2
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.18] mb-7"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {s.sousSecteursLabel}
              </h2>
              <ul className="flex flex-wrap gap-3">
                {item.sousSecteurs.map((sub) => (
                  <li key={sub} className={chipCls}>
                    {sub}
                  </li>
                ))}
              </ul>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.18] mb-7"
                style={{ fontSize: "var(--text-h3)" }}
              >
                {s.prestationsLabel}
              </h2>
              <ul className="flex flex-wrap gap-3">
                {item.prestations.map((p) => (
                  <li key={p} className={chipCls}>
                    {p}
                  </li>
                ))}
              </ul>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="bg-cream-soft">
        <div className={`${PADX} py-20 lg:py-28`}>
          <div className="border-t border-line pt-16 lg:pt-20 lg:grid lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-7">
              <h2
                className="font-display font-light text-ink tracking-[-0.03em] leading-[1.1] mb-6"
                style={{ fontSize: "var(--text-h1)" }}
              >
                {s.cta.heading}
              </h2>
              <p className="font-sans text-ink-soft leading-[1.7] text-[length:var(--text-body)] mb-9 max-w-xl">
                {s.cta.description}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
              >
                {s.cta.button}
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
