import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService, schemaFAQ, schemaBreadcrumb } from "@/lib/schema";
import { ServicePageBody } from "@/components/sections/ServicePageBody";

const PATH = "/services/etude-impact-environnemental";

const heroMeta = [
  { label: "Cadre", value: "Décret 07-144" },
  { label: "Livrable", value: "Rapport EIE" },
  { label: "Dépôt", value: "DEW / DIM" },
];

const faq = [
  {
    q: "Quand l'étude d'impact est-elle obligatoire ?",
    a: "Dès que votre projet figure sur la liste réglementaire des travaux soumis à étude d'impact (décret exécutif 07-144). L'EIE conditionne l'autorisation de construire ou d'exploiter.",
  },
  {
    q: "Combien de temps prend une EIE ?",
    a: "Selon l'ampleur et la sensibilité du site, de quelques semaines à quelques mois. Nous cadrons le délai dès la consultation initiale.",
  },
  {
    q: "Qui valide le rapport final ?",
    a: "Les autorités de wilaya — Direction de l'Environnement (DEW) et Direction de l'Industrie et des Mines (DIM).",
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
    title: dict.eie.meta.title,
    description: dict.eie.meta.description,
  });
}

export default async function EIEPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  const jsonLd = schemaService({
    name: "Étude d'Impact sur l'Environnement (EIE)",
    url: `https://bthexpert.com/${lang}${PATH}`,
    description: dict.eie.meta.description,
    serviceType: "Étude d'Impact Environnemental",
  });
  const jsonLdFaq = schemaFAQ(faq.map((i) => ({ question: i.q, answer: i.a })));
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.services, url: `https://bthexpert.com/${lang}/services` },
    { name: dict.eie.hero.heading, url: `https://bthexpert.com/${lang}${PATH}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ServicePageBody lang={lang} service={dict.eie} heroMeta={heroMeta} faq={faq} />
    </>
  );
}
