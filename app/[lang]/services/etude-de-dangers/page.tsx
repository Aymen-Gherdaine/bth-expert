import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService } from "@/lib/schema";
import { ServicePageBody } from "@/components/sections/ServicePageBody";

const PATH = "/services/etude-de-dangers";

const heroMeta = [
  { label: "Concerne", value: "Établissements classés" },
  { label: "Méthodes", value: "APR · HAZOP" },
  { label: "Livrable", value: "Rapport EDD" },
];

const faq = [
  {
    q: "Mon installation est-elle concernée ?",
    a: "Toute installation classée soumise à autorisation : stockage d'hydrocarbures, unités pétrochimiques, dépôts de produits dangereux, équipements sous pression.",
  },
  {
    q: "Que contient l'étude de dangers ?",
    a: "Identification des dangers, modélisation des scénarios majeurs (effets thermiques, surpression, toxiques), cartographie des zones d'effet et plan de maîtrise des risques.",
  },
  {
    q: "Faut-il la réviser ?",
    a: "Oui — à chaque modification substantielle de l'installation, des procédés ou des produits mis en œuvre.",
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
    title: dict.edd.meta.title,
    description: dict.edd.meta.description,
  });
}

export default async function EDDPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  const jsonLd = schemaService({
    name: "Étude de Dangers (EDD)",
    url: `https://bthexpert.com/${lang}${PATH}`,
    description: dict.edd.meta.description,
    serviceType: "Étude de Dangers",
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ServicePageBody lang={lang} service={dict.edd} heroMeta={heroMeta} faq={faq} />
    </>
  );
}
