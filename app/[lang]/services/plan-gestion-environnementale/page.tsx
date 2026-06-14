import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

const PATH = "/services/plan-gestion-environnementale";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  return buildMetadata({
    lang,
    path: PATH,
    title: dict.pge.meta.title,
    description: dict.pge.meta.description,
  });
}

export default async function PGEPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const e = dict.pge;

  const jsonLd = schemaService({
    name: "Plan de Gestion Environnementale (PGE)",
    url: `https://bthexpert.com/${lang}${PATH}`,
    description: dict.pge.meta.description,
    serviceType: "Plan de Gestion Environnementale",
  });

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
            <p className="text-[length:var(--text-caption)] uppercase tracking-widest text-muted mb-8">
              {e.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[length:var(--text-h1)] text-ink mb-8">
              {e.hero.heading}
            </h1>
            <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {e.hero.subheading}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Qui est concerné ─────────────────────────────────── */}
      <div className="border-t border-line">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 mb-8 lg:mb-0">
                <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink">
                  {e.why.heading}
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                  {e.why.description}
                </p>
              </div>
            </div>
          </Section>
        </Container>
      </div>

      {/* ── Méthodologie ─────────────────────────────────────── */}
      <Container>
        <Section number="01" eyebrow={e.methodology.heading}>
          <div className="divide-y divide-line">
            {e.methodology.steps.map((step) => (
              <div key={step.number} className="py-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <div className="lg:col-span-1 mb-2 lg:mb-0">
                  <span className="font-display text-[length:var(--text-caption)] text-gold tracking-widest">
                    {step.number}
                  </span>
                </div>
                <div className="lg:col-span-4 mb-3 lg:mb-0">
                  <h3 className="font-display text-[length:var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink">
                    {step.title}
                  </h3>
                </div>
                <div className="lg:col-span-6 lg:col-start-6">
                  <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </Container>

      {/* ── Livrable ─────────────────────────────────────────── */}
      <div className="border-t border-line bg-cream-deep">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 mb-8 lg:mb-0">
                <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink">
                  {e.deliverable.heading}
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                  {e.deliverable.description}
                </p>
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
              <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-6">
                {e.cta.heading}
              </h2>
              <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] mb-8">
                {e.cta.description}
              </p>
              <Button href={`/${lang}/contact`}>{e.cta.button}</Button>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
