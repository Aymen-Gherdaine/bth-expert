import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { ProjectsFilter } from "@/components/sections/ProjectsFilter";

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
    path: "/projets",
    title: dict.projets.meta.title,
    description: dict.projets.meta.description,
  });
}

export default async function ProjetsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const p = dict.projets;

  const jsonLd = schemaLocalBusiness();

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
              {p.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[var(--text-h1)] text-ink mb-8">
              {p.hero.heading}
            </h1>
            <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {p.hero.subheading}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Filterable project grid ───────────────────────────── */}
      <Container>
        <Section tight>
          <ProjectsFilter items={p.items} allLabel={p.filterAll} lang={lang} />
        </Section>
      </Container>
    </>
  );
}
