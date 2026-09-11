/**
 * Traduction FR → AR / EN via l'API Anthropic (TODO 3.5).
 *
 * Le français est l'unique source éditée à la main (Keystatic). Ce script
 * régénère entièrement dictionaries/ar.json et dictionaries/en.json à partir
 * de dictionaries/fr.json (lui-même généré par `npm run content:sync`), et
 * traduit les articles de blog publiés vers content/{ar,en}/blog/.
 *
 * Usage :
 *   npm run translate                 # AR + EN, dict + blog (n'écrase pas les articles déjà traduits)
 *   npm run translate -- --lang=ar    # une seule langue
 *   npm run translate -- --force      # retraduit aussi les articles de blog déjà traduits
 *
 * Nécessite ANTHROPIC_API_KEY (variable d'environnement).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { pathToFileURL } from "url";
import matter from "gray-matter";
import Anthropic from "@anthropic-ai/sdk";
import {
  collectStringLeaves,
  diffPlaceholders,
  diffStructure,
  hasSameStructure,
  rebuildWithTranslations,
  type JsonValue,
} from "./lib/i18n-tree";

const ROOT = process.cwd();
/**
 * Modèle par défaut. Doit supporter les sorties structurées
 * (`output_config.format`), sur lesquelles repose la garantie de structure —
 * claude-sonnet-4-6 ne les supporte pas.
 */
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";
/** Marge confortable : l'arabe consomme nettement plus de tokens que le français. */
const MAX_TOKENS = 16000;

type Lang = "ar" | "en";
const LANG_NAMES: Record<Lang, string> = { ar: "arabe", en: "anglais" };

const HASHES_FILE = path.join(ROOT, "dictionaries", ".translation-hashes.json");
type HashStore = Partial<Record<Lang, Record<string, string>>>;

interface GlossaryEntry {
  fr: string;
  ar: string;
  en: string;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const langArg = args.find((a) => a.startsWith("--lang="))?.split("=")[1];
  const langs: Lang[] = langArg === "ar" || langArg === "en" ? [langArg] : ["ar", "en"];
  const force = args.includes("--force");
  return { langs, force };
}

function loadGlossary(): GlossaryEntry[] {
  const file = path.join(ROOT, "scripts", "glossary.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

function glossaryPrompt(glossary: GlossaryEntry[], lang: Lang): string {
  const lines = glossary.map((e) => `- "${e.fr}" → "${e[lang]}"`);
  return lines.join("\n");
}

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquant");
  return new Anthropic({ apiKey });
}

/**
 * Envoie une requête contrainte par un schéma JSON et retourne la réponse
 * désérialisée. `output_config.format` garantit que la réponse est un JSON
 * valide conforme au schéma — plus de balises markdown à éplucher ni de clé
 * inventée par le modèle.
 */
async function requestJson(
  client: Anthropic,
  system: string,
  payload: unknown,
  schema: Record<string, unknown>
): Promise<unknown> {
  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: MAX_TOKENS,
    system,
    messages: [{ role: "user", content: JSON.stringify(payload, null, 2) }],
    output_config: { format: { type: "json_schema", schema } },
  });

  if (message.stop_reason === "max_tokens") {
    throw new Error(
      `Réponse tronquée à ${MAX_TOKENS} tokens : découper la section ou augmenter MAX_TOKENS.`
    );
  }
  if (message.stop_reason === "refusal") {
    throw new Error(`Requête refusée par le modèle : ${message.stop_details?.explanation ?? ""}`);
  }

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Réponse Anthropic sans contenu texte");
  }
  return JSON.parse(textBlock.text);
}

/** Empreinte stable d'une section de fr.json (détection de changement source). */
export function hashSection(section: unknown): string {
  return crypto.createHash("sha256").update(JSON.stringify(section)).digest("hex");
}

function loadHashes(): HashStore {
  if (!fs.existsSync(HASHES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(HASHES_FILE, "utf-8")) as HashStore;
  } catch {
    return {};
  }
}

function saveHashes(hashes: HashStore): void {
  fs.writeFileSync(HASHES_FILE, JSON.stringify(hashes, null, 2) + "\n");
}

interface SectionPlan {
  key: string;
  hash: string;
  translate: boolean;
}

/**
 * Décide, section par section, ce qui doit être (re)traduit : une section est
 * ignorée si sa source fr.json est inchangée (même hash), qu'une traduction
 * existe déjà ET que cette traduction a la même forme que la source. C'est ce
 * qui élimine la retraduction systématique des 17 sections à chaque exécution.
 *
 * Le contrôle de forme sert d'auto-réparation : une section traduite
 * autrefois avec une clé dérivée reste sinon figée dans le cache de hash,
 * puisque sa source française, elle, n'a pas bougé.
 */
export function planDictionaryTranslation(
  fr: Record<string, JsonValue>,
  existing: Record<string, JsonValue>,
  oldHashes: Record<string, string>,
  force: boolean
): SectionPlan[] {
  return Object.keys(fr).map((key) => {
    const hash = hashSection(fr[key]);
    const unchanged =
      !force &&
      oldHashes[key] === hash &&
      existing[key] !== undefined &&
      hasSameStructure(fr[key], existing[key]);
    return { key, hash, translate: !unchanged };
  });
}

/**
 * Traduit une section du dictionnaire.
 *
 * Le modèle ne voit jamais l'arborescence : on lui envoie une table plate
 * `chemin → texte français` et un schéma qui n'autorise exactement que ces
 * chemins en sortie. L'objet final est ensuite reconstruit à partir de la
 * source française, donc sa forme est correcte par construction.
 */
async function translateJsonSection(
  client: Anthropic,
  section: JsonValue,
  lang: Lang,
  glossary: GlossaryEntry[]
): Promise<JsonValue> {
  const leaves = collectStringLeaves(section);
  if (leaves.length === 0) return rebuildWithTranslations(section, {}).value;

  const system = `Tu traduis du contenu d'un site web pour BTH Expert (bureau d'études environnemental agréé en Algérie) du français vers le ${LANG_NAMES[lang]}.

On te donne un objet plat : chaque clé est un chemin technique, chaque valeur est le texte français à traduire.

Règles strictes :
- Renvoie exactement les mêmes clés, avec pour chaque clé la traduction de la valeur. Les clés sont des identifiants techniques : ne les traduis pas, ne les renomme pas, n'en ajoute ni n'en supprime.
- Recopie tels quels les espaces réservés entre accolades comme "{current}" ou "{total}", ainsi que les chemins et URLs (commençant par "/" ou "http").
- Applique strictement ce glossaire métier pour rester cohérent avec le reste du site :
${glossaryPrompt(glossary, lang)}
- Pour l'arabe : rédige un arabe professionnel clair et direct (arabe standard moderne), en phrases courtes. Évite le style littéraire, ornemental ou poétique et les tournures alambiquées (pas de « في كنف », « مقروناً بتجذُّر », etc.) — privilégie le vocabulaire courant des affaires. Le texte sera affiché en RTL, donc ne change pas la ponctuation ni les sigles latins (ex: "EIE", "HSE") qui doivent rester en caractères latins.`;

  const schema = {
    type: "object",
    properties: Object.fromEntries(leaves.map((leaf) => [leaf.path, { type: "string" }])),
    required: leaves.map((leaf) => leaf.path),
    additionalProperties: false,
  };
  const payload = Object.fromEntries(leaves.map((leaf) => [leaf.path, leaf.value]));

  const translations = (await requestJson(client, system, payload, schema)) as Record<
    string,
    unknown
  >;

  const { value, missing } = rebuildWithTranslations(section, translations);
  if (missing.length > 0) {
    throw new Error(
      `Traduction ${lang} incomplète — ${missing.length} chaîne(s) manquante(s) : ${missing
        .slice(0, 5)
        .join(", ")}`
    );
  }
  return value;
}

async function translateDictionary(
  client: Anthropic,
  lang: Lang,
  glossary: GlossaryEntry[],
  force: boolean,
  hashes: HashStore
) {
  const frPath = path.join(ROOT, "dictionaries", "fr.json");
  const fr = JSON.parse(fs.readFileSync(frPath, "utf-8")) as Record<string, JsonValue>;

  const outPath = path.join(ROOT, "dictionaries", `${lang}.json`);
  const existing: Record<string, JsonValue> = fs.existsSync(outPath)
    ? JSON.parse(fs.readFileSync(outPath, "utf-8"))
    : {};

  const plan = planDictionaryTranslation(fr, existing, hashes[lang] ?? {}, force);

  const translated: Record<string, JsonValue> = {};
  const newHashes: Record<string, string> = {};
  let translatedCount = 0;
  let skippedCount = 0;

  for (const { key, hash, translate } of plan) {
    if (!translate) {
      translated[key] = existing[key];
      newHashes[key] = hash;
      skippedCount++;
      continue;
    }
    console.log(`[translate:${lang}] section "${key}"...`);
    translated[key] = await translateJsonSection(client, fr[key], lang, glossary);
    newHashes[key] = hash;
    translatedCount++;
  }

  // Dernier filet avant écriture : le dictionnaire complet — sections
  // retraduites comme sections reprises du cache — doit avoir la forme de
  // fr.json. On préfère échouer que publier un dictionnaire qui cassera le
  // build (ou, pire, une page en production).
  const structureIssues = diffStructure(fr, translated);
  const placeholderIssues =
    structureIssues.length === 0 ? diffPlaceholders(fr, translated) : [];
  if (structureIssues.length > 0 || placeholderIssues.length > 0) {
    const details = [...structureIssues, ...placeholderIssues].slice(0, 10).join("\n  - ");
    throw new Error(
      `Dictionnaire ${lang} non conforme à fr.json — rien n'a été écrit :\n  - ${details}`
    );
  }

  // Recompose la table de hash (purge au passage les sections supprimées).
  hashes[lang] = newHashes;

  fs.writeFileSync(outPath, JSON.stringify(translated, null, 2) + "\n");
  console.log(
    `[translate:${lang}] écrit ${outPath} (${translatedCount} traduit(s), ${skippedCount} inchangé(s))`
  );
}

interface BlogFrontmatter {
  title: string;
  description: string;
  date?: string;
  author?: string;
  status?: string;
  tags?: string[];
  faq?: { q: string; a: string }[];
  [key: string]: unknown;
}

async function translateBlogBody(
  client: Anthropic,
  lang: Lang,
  glossary: GlossaryEntry[],
  frontmatter: BlogFrontmatter,
  body: string
): Promise<{ frontmatter: BlogFrontmatter; body: string }> {
  const system = `Tu traduis un article de blog de BTH Expert (bureau d'études environnemental agréé en Algérie) du français vers le ${LANG_NAMES[lang]}.

Règles strictes :
- Traduis le titre, la description, les tags, la FAQ (questions et réponses) et le corps de l'article en Markdown.
- Conserve la structure Markdown (titres "##", listes, gras) et les liens internes, en remplaçant uniquement le préfixe de langue "/fr/" par "/${lang}/" dans les chemins (ex: "/fr/contact" → "/${lang}/contact"). Ne change rien d'autre dans ces chemins.
- Applique ce glossaire métier pour rester cohérent avec le reste du site :
${glossaryPrompt(glossary, lang)}
- Si la langue cible est l'arabe : style professionnel clair et direct, phrases courtes, sans emphase littéraire ni tournures ornementales.
- Renvoie autant de tags et autant d'entrées de FAQ que la source, dans le même ordre.`;

  const payload = {
    title: frontmatter.title,
    description: frontmatter.description,
    tags: frontmatter.tags ?? [],
    faq: frontmatter.faq ?? [],
    body,
  };

  const schema = {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      tags: { type: "array", items: { type: "string" } },
      faq: {
        type: "array",
        items: {
          type: "object",
          properties: { q: { type: "string" }, a: { type: "string" } },
          required: ["q", "a"],
          additionalProperties: false,
        },
      },
      body: { type: "string" },
    },
    required: ["title", "description", "tags", "faq", "body"],
    additionalProperties: false,
  };

  const result = (await requestJson(client, system, payload, schema)) as {
    title: string;
    description: string;
    tags: string[];
    faq: { q: string; a: string }[];
    body: string;
  };

  // Le schéma garantit les types, pas le cardinal des tableaux : un tag ou une
  // question de FAQ perdus se verraient en production, pas au build.
  if (result.tags.length !== payload.tags.length) {
    throw new Error(
      `Traduction ${lang} : ${payload.tags.length} tag(s) attendu(s), ${result.tags.length} reçu(s)`
    );
  }
  if (result.faq.length !== payload.faq.length) {
    throw new Error(
      `Traduction ${lang} : ${payload.faq.length} entrée(s) de FAQ attendue(s), ${result.faq.length} reçue(s)`
    );
  }

  return {
    frontmatter: {
      ...frontmatter,
      title: result.title,
      description: result.description,
      tags: result.tags,
      faq: result.faq,
    },
    body: result.body,
  };
}

function frontmatterToYaml(fm: BlogFrontmatter): string {
  const lines: string[] = [];
  lines.push(`title: ${JSON.stringify(fm.title)}`);
  lines.push(`description: ${JSON.stringify(fm.description)}`);
  if (fm.date) lines.push(`date: "${fm.date}"`);
  if (fm.author) lines.push(`author: ${JSON.stringify(fm.author)}`);
  if (fm.image) lines.push(`image: ${JSON.stringify(fm.image)}`);
  if (fm.tags && fm.tags.length > 0) {
    lines.push(`tags: ${JSON.stringify(fm.tags)}`);
  }
  if (fm.faq && fm.faq.length > 0) {
    lines.push("faq:");
    for (const item of fm.faq) {
      lines.push(`  - q: ${JSON.stringify(item.q)}`);
      lines.push(`    a: ${JSON.stringify(item.a)}`);
    }
  }
  return lines.join("\n");
}

async function translateBlogPosts(
  client: Anthropic,
  lang: Lang,
  glossary: GlossaryEntry[],
  force: boolean
) {
  const frDir = path.join(ROOT, "content", "fr", "blog");
  if (!fs.existsSync(frDir)) return;

  const outDir = path.join(ROOT, "content", lang, "blog");
  fs.mkdirSync(outDir, { recursive: true });

  const slugs = fs
    .readdirSync(frDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  for (const slug of slugs) {
    const frFile = path.join(frDir, `${slug}.md`);
    const { data, content } = matter(fs.readFileSync(frFile, "utf-8"));
    const frontmatter = data as BlogFrontmatter;

    if (frontmatter.status === "draft") {
      console.log(`[translate:${lang}] "${slug}" est un brouillon — ignoré.`);
      continue;
    }

    const outFile = path.join(outDir, `${slug}.md`);
    if (fs.existsSync(outFile) && !force) {
      console.log(`[translate:${lang}] "${slug}" déjà traduit — ignoré (--force pour retraduire).`);
      continue;
    }

    console.log(`[translate:${lang}] article "${slug}"...`);
    const { frontmatter: translatedFm, body } = await translateBlogBody(
      client,
      lang,
      glossary,
      frontmatter,
      content
    );

    const file = `---\n${frontmatterToYaml(translatedFm)}\n---\n\n${body.trim()}\n`;
    fs.writeFileSync(outFile, file);
    console.log(`[translate:${lang}] écrit ${outFile}`);
  }
}

async function main() {
  const { langs, force } = parseArgs();
  const glossary = loadGlossary();
  const client = getClient();
  const hashes = loadHashes();

  for (const lang of langs) {
    await translateDictionary(client, lang, glossary, force, hashes);
    await translateBlogPosts(client, lang, glossary, force);
  }

  saveHashes(hashes);
}

// N'exécute main() que lancé directement (pas à l'import, ex. depuis un test).
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
