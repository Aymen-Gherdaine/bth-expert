import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness, schemaBreadcrumb } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { TerrainHero } from "@/components/sections/TerrainHero";
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

  const jsonLd = schemaLocalBusiness(lang);
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.projets, url: `https://bthexpert.com/${lang}/projets` },
  ]);

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

      {/* ── Hero — shared editorial ServiceHero (was a flat pt-32 block) ─ */}
      <TerrainHero
        src="/generated/section-projets.svg"
        eyebrow={p.hero.eyebrow}
        heading={p.hero.heading}
        subheading={p.hero.subheading}
      />

      {/* ── Filterable project grid (unchanged: hover-lift cards + stagger) ─ */}
      <div className="bg-cream-soft">
        <Container>
          <Section tight>
            <ProjectsFilter items={p.items} allLabel={p.filterAll} lang={lang} />
          </Section>
        </Container>
      </div>
    </>
  );
}
