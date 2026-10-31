import type { Dictionary } from "./i18n";

/**
 * Centre de ressources : les fiches vivent dans Keystatic
 * (content/fr/ressources/*.yaml + singleton content/fr/site/ressources.yaml),
 * passent par `npm run content:sync` dans dictionaries/fr.json, puis par le
 * pipeline de traduction pour AR et EN. Ce module n'expose que des types et
 * des accesseurs sur la forme du dictionnaire.
 */

export type RessourcesDict = Dictionary["ressources"];
export type Fiche = RessourcesDict["items"][number];
export type FicheSection = Fiche["sections"][number];

export function listFiches(r: RessourcesDict): Fiche[] {
  return r.items;
}

export function getFiche(r: RessourcesDict, slug: string): Fiche | null {
  return r.items.find((f) => f.slug === slug) ?? null;
}

/** Fiches shown in the landing's regulatory register: texts with a home line. */
export function homeFiches(r: RessourcesDict): Fiche[] {
  return r.items.filter((f) => f.kind === "texte" && f.homeLine.trim() !== "");
}
