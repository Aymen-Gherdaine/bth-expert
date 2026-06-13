import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import fr from "@/dictionaries/fr.json";

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
  });

  const chipCls =
    "inline-flex items-center rounded-full border border-line px-4 py-2 text-[var(--text-small)] text-ink-soft";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Container>
        <div className="pt-32 pb-24 md:pt-40 md:pb-32 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <p className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-8">
              {s.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[var(--text-h1)] text-ink mb-8">
              {item.title}
            </h1>
            <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {item.intro}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Enjeux clés ──────────────────────────────────────── */}
      <Container>
        <Section number="01" eyebrow={s.enjeuxLabel}>
          <div className="divide-y divide-line">
            {item.enjeux.map((enjeu, index) => (
              <div
                key={enjeu.title}
                className="py-8 lg:grid lg:grid-cols-12 lg:gap-8"
              >
                <div className="lg:col-span-1 mb-2 lg:mb-0">
                  <span className="font-display text-[var(--text-caption)] text-gold tracking-widest">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <div className="lg:col-span-4 mb-3 lg:mb-0">
                  <h3 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink">
                    {enjeu.title}
                  </h3>
                </div>
                <div className="lg:col-span-6 lg:col-start-6">
                  <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
                    {enjeu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      {/* ── Domaines couverts + prestations ──────────────────── */}
      <div className="border-t border-line bg-cream-deep">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-2 lg:gap-16">
              <div className="mb-12 lg:mb-0">
                <h2 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink mb-6">
                  {s.sousSecteursLabel}
                </h2>
                <ul className="flex flex-wrap gap-3">
                  {item.sousSecteurs.map((sub) => (
                    <li key={sub} className={chipCls}>
                      {sub}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink mb-6">
                  {s.prestationsLabel}
                </h2>
                <ul className="flex flex-wrap gap-3">
                  {item.prestations.map((p) => (
                    <li key={p} className={chipCls}>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
        </Container>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-6">
                {s.cta.heading}
              </h2>
              <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] mb-8">
                {s.cta.description}
              </p>
              <Button href={`/${lang}/contact`}>{s.cta.button}</Button>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
