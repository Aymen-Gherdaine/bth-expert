import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaPerson } from "@/lib/schema";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { EquipeMembers } from "@/components/sections/EquipeMembers";
import { EquipeCtaBand } from "@/components/sections/EquipeCtaBand";

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
    path: "/equipe",
    title: dict.equipe.meta.title,
    description: dict.equipe.meta.description,
  });
}

export default async function EquipePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const eq = dict.equipe;

  const jsonLd = schemaPerson({
    name: "Amine Lahmer",
    jobTitle: "Gérant — Expert environnement",
    url: `https://bthexpert.com/${lang}/equipe`,
    description:
      "Ingénieur en environnement, fondateur et gérant de BTH Expert depuis 2009. Expert EIE et EDD agréé par le Ministère de l'Environnement algérien.",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ServiceHero
        eyebrow={eq.hero.eyebrow}
        heading={eq.hero.heading}
        subheading={eq.hero.subheading}
      />

      <EquipeMembers members={eq.members} partner={eq.partner} />

      <EquipeCtaBand lang={lang} cta={eq.cta} art="/generated/section-equipe.svg" />
    </>
  );
}
