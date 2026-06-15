import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { OranBody } from "@/components/sections/OranBody";
import { OranCtaBand } from "@/components/sections/OranCtaBand";

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

  const jsonLd = schemaLocalBusiness();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServiceHero
        eyebrow={o.hero.eyebrow}
        heading={o.hero.heading}
        subheading={o.hero.subheading}
      />

      <OranBody services={o.services} zones={o.zones} nap={o.nap} />

      <OranCtaBand lang={lang} cta={o.cta} />
    </>
  );
}
