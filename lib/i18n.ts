import "server-only";
import { notFound } from "next/navigation";
import type frDict from "@/dictionaries/fr.json";
import { locales, type Locale } from "./i18n-config";

// Ré-exporte tout depuis i18n-config pour que les Server Components
// gardent un seul point d'import : @/lib/i18n
export * from "./i18n-config";

/**
 * Valide qu'une string est une locale supportée.
 * Sinon déclenche un 404 (Next.js notFound).
 */
export function validateLocale(lang: string): Locale {
  if (!locales.includes(lang as Locale)) notFound();
  return lang as Locale;
}

export type Dictionary = typeof frDict;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  fr: () => import("@/dictionaries/fr.json").then((m) => m.default),
  ar: () => import("@/dictionaries/ar.json").then((m) => m.default),
  en: () => import("@/dictionaries/en.json").then((m) => m.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();