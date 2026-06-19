import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness, schemaBreadcrumb } from "@/lib/schema";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { OranBody } from "@/components/sections/OranBody";
import { OranCtaBand } from "@/components/sections/OranCtaBand";

const ORAN_LABEL: Record<string, string> = { fr: "Oran", ar: "وهران", en: "Oran" };

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
    path: "/oran",
    title: dict.oran.meta.title,
    description: dict.oran.meta.description,
  });
}

export default async function OranPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const o = dict.oran;

  const jsonLd = schemaLocalBusiness(lang);
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: ORAN_LABEL[lang] ?? ORAN_LABEL.fr, url: `https://bthexpert.com/${lang}/oran` },
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

      <ServiceHero
        eyebrow={o.hero.eyebrow}
        heading={o.hero.heading}
        subheading={o.hero.subheading}
      />

      <OranBody services={o.services} zones={o.zones} nap={o.nap} />

      <OranCtaBand lang={lang} cta={o.cta} art="/generated/section-oran.svg" />
    </>
  );
}
