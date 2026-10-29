import type { Metadata } from "next";
import { validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaBreadcrumb } from "@/lib/schema";
import { getLegalPage, LEGAL_UPDATED_AT } from "@/lib/legal-content";
import { LegalDocument } from "@/components/sections/LegalDocument";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const page = getLegalPage("mentions", lang);
  return buildMetadata({
    lang,
    path: `/${page.slug}`,
    title: page.metaTitle,
    description: page.metaDescription,
  });
}

export default async function MentionsLegalesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const page = getLegalPage("mentions", lang);
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: page.heading, url: `https://bthexpert.com/${lang}/${page.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <LegalDocument page={page} updatedAt={LEGAL_UPDATED_AT} lang={lang} />
    </>
  );
}
