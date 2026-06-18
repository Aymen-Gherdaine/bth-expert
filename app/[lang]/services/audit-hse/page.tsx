import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaService, schemaFAQ, schemaBreadcrumb } from "@/lib/schema";
import { ServicePageBody } from "@/components/sections/ServicePageBody";

const PATH = "/services/audit-hse";

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
    title: dict.hse.meta.title,
    description: dict.hse.meta.description,
  });
}

export default async function HSEPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  const jsonLd = schemaService({
    name: "Audit HSE & conformité réglementaire",
    url: `https://bthexpert.com/${lang}${PATH}`,
    description: dict.hse.meta.description,
    serviceType: "Audit HSE",
  });
  const jsonLdFaq = schemaFAQ(dict.hse.faq.map((i) => ({ question: i.q, answer: i.a })));
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.services, url: `https://bthexpert.com/${lang}/services` },
    { name: dict.hse.hero.heading, url: `https://bthexpert.com/${lang}${PATH}` },
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
      <ServicePageBody lang={lang} service={dict.hse} heroMeta={dict.hse.heroMeta} faq={dict.hse.faq} />
    </>
  );
}
