import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaArticle, schemaBreadcrumb } from "@/lib/schema";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ProjetNarrative } from "@/components/sections/ProjetNarrative";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { TerrainBackdrop } from "@/components/sections/Terrain";
import fr from "@/dictionaries/fr.json";

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export function generateStaticParams() {
  return fr.projets.items.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const item = dict.projets.items.find((p) => p.slug === slug);
  if (!item) return {};

  return buildMetadata({
    lang,
    path: `/projets/${slug}`,
    title: item.title,
    description: item.excerpt,
  });
}

export default async function ProjetPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const p = dict.projets;
  const item = p.items.find((x) => x.slug === slug);
  if (!item) notFound();

  const d = p.detail;
  const jsonLd = schemaArticle({
    title: item.title,
    url: `https://bthexpert.com/${lang}/projets/${slug}`,
    description: item.excerpt,
    datePublished: `${item.annee}-01-01`,
  });
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.projets, url: `https://bthexpert.com/${lang}/projets` },
    { name: item.title, url: `https://bthexpert.com/${lang}/projets/${slug}` },
  ]);

  const beats = [
    { label: d.contexteLabel, body: item.contexte },
    { label: d.demarcheLabel, body: item.demarche },
    { label: d.resultatLabel, body: item.resultat },
  ];

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

      {/* ── Hero — secteur breadcrumb above the shared editorial ServiceHero ─ */}
      <div className="bg-cream-soft">
        <div className={`${PADX} pt-16 lg:pt-24`}>
          <Link
            href={`/${lang}/secteurs/${item.secteurSlug}`}
            className="group inline-flex items-center gap-2 font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
          >
            <span
              aria-hidden
              className="w-6 h-px bg-gold transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:w-9"
            />
            {item.secteur}
          </Link>
        </div>
      </div>
      <ServiceHero eyebrow={item.secteur} heading={item.title} subheading={item.excerpt} />

      {/* ── Meta strip — secteur / mission chips / année, enlivened ───── */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-4 lg:pb-8`}>
          <div className="border-t border-line pt-10 lg:pt-12">
            <FadeInStagger className="grid gap-10 sm:grid-cols-3">
              <FadeInItem>
                <dt className="font-sans uppercase tracking-[0.14em] text-muted text-[length:var(--text-caption)] mb-3">
                  {d.secteurLabel}
                </dt>
                <dd
                  className="font-display font-light text-ink tracking-[-0.01em] leading-[1.2]"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  {item.secteur}
                </dd>
              </FadeInItem>

              <FadeInItem>
                <dt className="font-sans uppercase tracking-[0.14em] text-muted text-[length:var(--text-caption)] mb-3">
                  {d.missionLabel}
                </dt>
                <dd className="flex flex-wrap gap-2">
                  {item.mission.map((m) => (
                    <span
                      key={m}
                      className="inline-flex items-center rounded-full border border-line px-4 py-1.5 font-sans text-[length:var(--text-small)] text-ink-soft transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] hover:border-gold hover:text-ink"
                    >
                      {m}
                    </span>
                  ))}
                </dd>
              </FadeInItem>

              <FadeInItem>
                <dt className="font-sans uppercase tracking-[0.14em] text-muted text-[length:var(--text-caption)] mb-3">
                  {d.anneeLabel}
                </dt>
                <dd
                  className="font-display font-light text-ink tracking-[-0.01em] leading-[1.2] tabular-nums"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  {item.annee}
                </dd>
              </FadeInItem>
            </FadeInStagger>
          </div>
        </div>
      </section>

      {/* ── Narrative — contexte → intervention → résultat, 3-beat sequence ─ */}
      <ProjetNarrative beats={beats} />

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-20 lg:pb-28`}>
          <FadeIn>
            <p className="font-sans text-[length:var(--text-caption)] text-muted italic">
              {d.disclaimer}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── CTA — dark punctuation band over the project's artwork ── */}
      <section className="relative isolate overflow-hidden bg-brand-deep">
        <TerrainBackdrop src={`/generated/projet-${slug}.svg`} />
        <div className={`relative z-10 ${PADX} py-24 lg:py-32`}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <FadeIn className="lg:col-span-8">
              <span aria-hidden className="block w-14 h-px bg-gold mb-8" />
              <h2
                className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05] mb-6"
                style={{ fontSize: "clamp(2.25rem, 3.4vw + 1rem, 4.5rem)" }}
              >
                {d.cta.heading}
              </h2>
              <p className="font-sans text-cream/75 leading-[1.75] text-[length:var(--text-body)] mb-10 max-w-xl">
                {d.cta.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  {d.cta.button}
                </Link>
                <Link
                  href={`/${lang}/projets`}
                  className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] uppercase tracking-widest text-cream/60 hover:text-cream transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  <span
                    aria-hidden
                    className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:-translate-x-1"
                  >
                    ←
                  </span>
                  {d.backLabel}
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  );
}
