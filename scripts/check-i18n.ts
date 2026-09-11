/**
 * Validation structurelle des dictionnaires i18n (`npm run i18n:check`).
 *
 * Le français est la source unique : ar.json et en.json doivent avoir
 * exactement la même forme que fr.json. Ce script échoue avec un message
 * lisible avant que la dérive n'atteigne `next build`, où elle ne se
 * manifeste que par une erreur TypeScript illisible sur lib/i18n.ts.
 *
 * Lancé par le workflow de traduction avant tout commit : une traduction
 * structurellement fausse ne doit jamais arriver sur main.
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import { diffPlaceholders, diffStructure, type JsonValue } from "./lib/i18n-tree";

const ROOT = process.cwd();
const TARGET_LANGS = ["ar", "en"] as const;

function readDictionary(lang: string): JsonValue | null {
  const file = path.join(ROOT, "dictionaries", `${lang}.json`);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as JsonValue;
}

function main() {
  const fr = readDictionary("fr");
  if (fr === null) {
    console.error("[i18n:check] dictionaries/fr.json introuvable — lancer `npm run content:sync`.");
    process.exit(1);
  }

  let failed = false;

  for (const lang of TARGET_LANGS) {
    const dict = readDictionary(lang);
    if (dict === null) {
      console.error(`[i18n:check] ${lang}.json manquant.`);
      failed = true;
      continue;
    }

    const structure = diffStructure(fr, dict);
    const placeholders = structure.length === 0 ? diffPlaceholders(fr, dict) : [];

    if (structure.length === 0 && placeholders.length === 0) {
      console.log(`[i18n:check] ${lang}.json : conforme à fr.json.`);
      continue;
    }

    failed = true;
    for (const issue of structure) {
      console.error(`[i18n:check] ${lang}.json — structure : ${issue}`);
    }
    for (const issue of placeholders) {
      console.error(`[i18n:check] ${lang}.json — ${issue}`);
    }
  }

  if (failed) {
    console.error(
      "\n[i18n:check] Échec. Corriger la source française puis relancer `npm run translate -- --force`."
    );
    process.exit(1);
  }

  console.log("[i18n:check] Tous les dictionnaires sont conformes.");
}

// N'exécute main() que lancé directement (pas à l'import depuis un test).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
