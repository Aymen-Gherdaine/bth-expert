import "server-only";
import type { Metadata } from "next";
import { locales, type Locale } from "./i18n-config";

const BASE_URL = "https://bthexpert.com";

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

  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = localePath(locale, path);
  }
  languages["x-default"] = localePath("fr", path);

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "BTH Expert",
      locale: lang,
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}
