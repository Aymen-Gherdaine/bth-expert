import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, validateLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaArticle, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";
import { getFiche, listFiches } from "@/lib/ressources";
import { RessourceDocument } from "@/components/sections/RessourceDocument";
import fr from "@/dictionaries/fr.json";

/** ISO date of the last editorial review of the fiches (printed on each page). */
const RESSOURCES_UPDATED_AT = "2026-10-29";

export function generateStaticParams() {
  // FR is the source of truth for the slug list; AR/EN mirror it.
  return locales.flatMap((lang) => fr.ressources.items.map((f) => ({ lang, slug: f.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const fiche = getFiche(dict.ressources, slug);
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
  const dict = await getDictionary(lang);
  const r = dict.ressources;
  const fiche = getFiche(r, slug);
  if (!fiche) notFound();
  const all = listFiches(r);
  const related = fiche.related
    .map((s) => all.find((f) => f.slug === s))
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  const url = `https://bthexpert.com/${lang}/ressources/${slug}`;
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: r.nav, url: `https://bthexpert.com/${lang}/ressources` },
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
      {fiche.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <RessourceDocument
        lang={lang}
        fiche={fiche}
        labels={r}
        related={related}
        updatedAt={RESSOURCES_UPDATED_AT}
      />
    </>
  );
}
