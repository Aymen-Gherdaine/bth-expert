import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { validateLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaArticle, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";
import {
  ficheSlugs,
  getFiche,
  getRessourcesLabels,
  listFiches,
  RESSOURCES_UPDATED_AT,
} from "@/lib/ressources";
import { RessourceDocument } from "@/components/sections/RessourceDocument";

export function generateStaticParams() {
  return locales.flatMap((lang) => ficheSlugs.map((slug) => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const fiche = getFiche(lang, slug);
  if (!fiche) notFound();
  return buildMetadata({
    lang,
    path: `/ressources/${slug}`,
    title: fiche.metaTitle,
    description: fiche.metaDescription,
  });
}

export default async function RessourcePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const fiche = getFiche(lang, slug);
  if (!fiche) notFound();
  const labels = getRessourcesLabels(lang);
  const all = listFiches(lang);
  const related = fiche.related
    .map((s) => all.find((f) => f.slug === s))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  const url = `https://bthexpert.com/${lang}/ressources/${slug}`;
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: labels.nav, url: `https://bthexpert.com/${lang}/ressources` },
    { name: fiche.title, url },
  ]);
  const jsonLdArticle = schemaArticle({
    title: fiche.metaTitle,
    url,
    description: fiche.metaDescription,
    datePublished: RESSOURCES_UPDATED_AT,
  });
  const jsonLdFaq = schemaFAQ(fiche.faq.map((i) => ({ question: i.q, answer: i.a })));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <RessourceDocument
        lang={lang}
        fiche={fiche}
        labels={labels}
        related={related}
        updatedAt={RESSOURCES_UPDATED_AT}
      />
    </>
  );
}
