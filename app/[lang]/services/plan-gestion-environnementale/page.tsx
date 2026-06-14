import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService } from "@/lib/schema";
import { ServicePageBody } from "@/components/sections/ServicePageBody";

const PATH = "/services/plan-gestion-environnementale";

const heroMeta = [
  { label: "Phase", value: "Travaux → exploitation" },
  { label: "Suit", value: "Mesures d'atténuation" },
  { label: "Livrable", value: "Plan opérationnel" },
];

const faq = [
  {
    q: "À quoi sert un PGE ?",
    a: "Il traduit les engagements de l'étude d'impact en mesures concrètes : atténuation, surveillance et suivi sur toute la durée de vie du projet.",
  },
  {
    q: "Qui est concerné ?",
    a: "Tout porteur de projet dont l'étude d'impact a prescrit des mesures de suivi, et les exploitants tenus de démontrer leurs engagements.",
  },
  {
    q: "Que contient le livrable ?",
    a: "Une matrice des mesures, un programme de surveillance, des indicateurs et un modèle de reporting exploitables par vos équipes.",
  },
];

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
      <ServicePageBody lang={lang} service={dict.pge} heroMeta={heroMeta} faq={faq} />
    </>
  );
}
