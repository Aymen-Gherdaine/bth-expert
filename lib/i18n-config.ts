// Pas de "server-only" — ce fichier est importable depuis les Client Components

export const locales = ["fr", "ar", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

export const localeNames: Record<Locale, string> = {
  fr: "Français",
  ar: "العربية",
  en: "English",
};

export const isRtl = (locale: Locale): boolean => locale === "ar";