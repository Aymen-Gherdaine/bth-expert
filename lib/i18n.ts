import "server-only";
import { notFound } from "next/navigation";
import type frDict from "@/dictionaries/fr.json";

export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const isRtl = (locale: Locale): boolean => locale === "ar";

/**
 * Valide qu'une string est une locale supportée.
 * Sinon déclenche un 404 (Next.js notFound).
 * Le middleware empêche normalement ce cas, mais on garde la sécurité runtime.
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