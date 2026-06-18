import "server-only";
import type { Metadata } from "next";
import { locales, type Locale } from "./i18n-config";

const BASE_URL = "https://bthexpert.com";
const BRAND = "BTH Expert";

interface SeoParams {
  lang: Locale;
  /** Chemin sans la locale, ex: "/" ou "/services/etude-impact" */
  path: string;
  title: string;
  description: string;
  ogImage?: string;
}

function localePath(locale: string, path: string): string {
  return `${BASE_URL}/${locale}${path === "/" ? "" : path}`;
}

export function buildMetadata({
  lang,
  path,
  title,
  description,
  ogImage,
}: SeoParams): Metadata {
  const canonical = localePath(lang, path);

  // Les titres des pages statiques (dictionnaires) contiennent déjà la marque ;
  // ceux des pages dynamiques (blog, projets, secteurs) viennent du contenu et
  // ne l'ont pas. On normalise pour garantir « … — BTH Expert » exactement une
  // fois, et on bypasse le `template` du layout via `absolute`.
  const fullTitle = title.includes(BRAND) ? title : `${title} — ${BRAND}`;

  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = localePath(locale, path);
  }
  languages["x-default"] = localePath("fr", path);

  return {
    metadataBase: new URL(BASE_URL),
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "BTH Expert",
      locale: lang,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
