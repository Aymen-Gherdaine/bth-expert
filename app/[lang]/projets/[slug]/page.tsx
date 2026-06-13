import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaArticle } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import fr from "@/dictionaries/fr.json";

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

  const chipCls =
    "inline-flex items-center rounded-full border border-line px-4 py-2 text-[var(--text-small)] text-ink-soft";

  const blocks = [
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

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Container>
        <div className="pt-32 pb-12 md:pt-40 md:pb-16 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <Link
              href={`/${lang}/secteurs/${item.secteurSlug}`}
              className="inline-block text-[var(--text-caption)] uppercase tracking-widest text-gold mb-8 hover:text-gold-deep transition-colors duration-[var(--duration-fast)]"
            >
              {item.secteur}
            </Link>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[var(--text-h1)] text-ink mb-8">
              {item.title}
            </h1>
            <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {item.excerpt}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Meta strip ───────────────────────────────────────── */}
      <div className="border-y border-line">
        <Container>
          <dl className="py-8 grid gap-8 sm:grid-cols-3">
            <div>
              <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-2">
                {d.secteurLabel}
              </dt>
              <dd className="text-[var(--text-body)] text-ink">{item.secteur}</dd>
            </div>
            <div>
              <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-2">
                {d.missionLabel}
              </dt>
              <dd className="flex flex-wrap gap-2">
                {item.mission.map((m) => (
                  <span key={m} className={chipCls}>
                    {m}
                  </span>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-2">
                {d.anneeLabel}
              </dt>
              <dd className="text-[var(--text-body)] text-ink">{item.annee}</dd>
            </div>
          </dl>
        </Container>
      </div>

      {/* ── Body: contexte / intervention / résultat ─────────── */}
      <Container>
        <Section tight>
          <div className="divide-y divide-line">
            {blocks.map((block) => (
              <div
                key={block.label}
                className="py-10 first:pt-0 lg:grid lg:grid-cols-12 lg:gap-16"
              >
                <div className="lg:col-span-4 mb-4 lg:mb-0">
                  <h2 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink">
                    {block.label}
                  </h2>
                </div>
                <div className="lg:col-span-7 lg:col-start-6">
                  <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
                    {block.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[var(--text-caption)] text-muted italic">
            {d.disclaimer}
          </p>
        </Section>
      </Container>

      {/* ── CTA + back ───────────────────────────────────────── */}
      <div className="border-t border-line bg-cream-deep">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <h2 className="font-display text-[var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-6">
                  {d.cta.heading}
                </h2>
                <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] mb-8">
                  {d.cta.description}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <Button href={`/${lang}/contact`}>{d.cta.button}</Button>
                  <Link
                    href={`/${lang}/projets`}
                    className="text-[var(--text-small)] uppercase tracking-widest text-muted hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                  >
                    ← {d.backLabel}
                  </Link>
                </div>
              </div>
            </div>
          </Section>
        </Container>
      </div>
    </>
  );
}
