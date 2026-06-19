import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness, schemaBreadcrumb } from "@/lib/schema";
import { TerrainHero } from "@/components/sections/TerrainHero";
import { ServicesIndexList } from "@/components/sections/ServicesIndexList";

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

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
    path: "/services",
    title: dict.services.meta.title,
    description: dict.services.meta.description,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const s = dict.services;
  const items = dict.home.services.items;

  const jsonLd = schemaLocalBusiness(lang);
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.services, url: `https://bthexpert.com/${lang}/services` },
  ]);

  const serviceLinks: Record<string, string> = {
    EIE: `/${lang}/services/etude-impact-environnemental`,
    EIA: `/${lang}/services/etude-impact-environnemental`,
    EDD: `/${lang}/services/etude-de-dangers`,
    HS: `/${lang}/services/etude-de-dangers`,
    HSE: `/${lang}/services/audit-hse`,
    PGE: `/${lang}/services/plan-gestion-environnementale`,
    EMP: `/${lang}/services/plan-gestion-environnementale`,
  };

  const indexItems = items.map((item) => ({
    ...item,
    href: serviceLinks[item.abbr] ?? null,
  }));

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

      {/* ── Hero — shared editorial light hero ─────────────────── */}
      <TerrainHero
        src="/generated/section-services.svg"
        eyebrow={s.hero.eyebrow}
        heading={s.hero.heading}
        subheading={s.hero.subheading}
      />

      {/* ── Service index — animated editorial register ────────── */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-24 lg:pb-32`}>
          <ServicesIndexList items={indexItems} />
        </div>
      </section>
    </>
  );
}
