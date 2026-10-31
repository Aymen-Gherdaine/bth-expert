import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaBreadcrumb } from "@/lib/schema";
import { listContentByDate } from "@/lib/content";
import { listFiches } from "@/lib/ressources";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { RessourcesIndex } from "@/components/sections/RessourcesIndex";

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
    path: "/ressources",
    title: dict.ressources.meta.title,
    description: dict.ressources.meta.description,
  });
}

export default async function RessourcesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const r = dict.ressources;
  const fiches = listFiches(r);
  const textes = fiches.filter((f) => f.kind === "texte");
  const guide = fiches.find((f) => f.kind === "guide") ?? null;
  const posts = (await listContentByDate(lang, "blog")).slice(0, 3);

  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: r.nav, url: `https://bthexpert.com/${lang}/ressources` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <ServiceHero
        eyebrow={r.hero.eyebrow}
        heading={r.hero.heading}
        subheading={r.hero.subheading}
        meta={textes.map((f) => ({ label: f.typeLabel, value: f.ref }))}
      />
      <RessourcesIndex
        lang={lang}
        labels={r}
        textes={textes}
        guide={guide}
        posts={posts}
        readMore={dict.blog.readMore}
        empty={dict.blog.empty}
      />
    </>
  );
}
