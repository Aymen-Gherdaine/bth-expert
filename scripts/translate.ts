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

const ROOT = process.cwd();
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

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

function extractJson(text: string): string {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  return fenced ? fenced[1].trim() : trimmed;
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
 * ignorée si sa source fr.json est inchangée (même hash) ET qu'une traduction
 * existe déjà. `force` retraduit tout. C'est ce qui élimine la retraduction
 * systématique des 17 sections à chaque exécution.
 */
export function planDictionaryTranslation(
  fr: Record<string, unknown>,
  existing: Record<string, unknown>,
  oldHashes: Record<string, string>,
  force: boolean
): SectionPlan[] {
  return Object.keys(fr).map((key) => {
    const hash = hashSection(fr[key]);
    const unchanged = !force && oldHashes[key] === hash && existing[key] !== undefined;
    return { key, hash, translate: !unchanged };
  });
}

/**
 * Traduit un objet JSON (valeurs uniquement, structure et clés identiques).
 */
async function translateJsonSection(
  client: Anthropic,
  section: unknown,
  lang: Lang,
  glossary: GlossaryEntry[]
): Promise<unknown> {
  const system = `Tu traduis du contenu d'un site web pour BTH Expert (bureau d'études environnemental agréé en Algérie) du français vers le ${LANG_NAMES[lang]}.

Règles strictes :
- Conserve exactement la même structure JSON (mêmes clés, même nombre d'éléments dans les tableaux). Ne traduis JAMAIS les clés, seulement les valeurs de type chaîne.
- Ne traduis jamais les valeurs qui sont des chemins/URLs (commençant par "/" ou "http"), ni les espaces réservés entre accolades comme "{current}" ou "{total}" — recopie-les tels quels.
- Applique strictement ce glossaire métier pour rester cohérent avec le reste du site :
${glossaryPrompt(glossary, lang)}
- Pour l'arabe : rédige un arabe professionnel clair et direct (arabe standard moderne), en phrases courtes. Évite le style littéraire, ornemental ou poétique et les tournures alambiquées (pas de « في كنف », « مقروناً بتجذُّر », etc.) — privilégie le vocabulaire courant des affaires. Le texte sera affiché en RTL, donc ne change pas la ponctuation ni les sigles latins (ex: "EIE", "HSE") qui doivent rester en caractères latins.
- Réponds UNIQUEMENT avec le JSON traduit, sans balises markdown, sans commentaire.`;

  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: JSON.stringify(section, null, 2) }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Réponse Anthropic sans contenu texte");
  }
  return JSON.parse(extractJson(textBlock.text));
}

async function translateDictionary(
  client: Anthropic,
  lang: Lang,
  glossary: GlossaryEntry[],
  force: boolean,
  hashes: HashStore
) {
  const frPath = path.join(ROOT, "dictionaries", "fr.json");
  const fr = JSON.parse(fs.readFileSync(frPath, "utf-8")) as Record<string, unknown>;

  const outPath = path.join(ROOT, "dictionaries", `${lang}.json`);
  const existing: Record<string, unknown> = fs.existsSync(outPath)
    ? JSON.parse(fs.readFileSync(outPath, "utf-8"))
    : {};

  const plan = planDictionaryTranslation(fr, existing, hashes[lang] ?? {}, force);

  const translated: Record<string, unknown> = {};
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
- Réponds UNIQUEMENT avec un JSON de la forme {"title": "...", "description": "...", "tags": ["..."], "faq": [{"q": "...", "a": "..."}], "body": "..."}, sans balises markdown autour du JSON, sans commentaire.`;

  const payload = {
    title: frontmatter.title,
    description: frontmatter.description,
    tags: frontmatter.tags ?? [],
    faq: frontmatter.faq ?? [],
    body,
  };

  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 8192,
    system,
    messages: [{ role: "user", content: JSON.stringify(payload, null, 2) }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Réponse Anthropic sans contenu texte");
  }
  const result = JSON.parse(extractJson(textBlock.text)) as {
    title: string;
    description: string;
    tags: string[];
    faq: { q: string; a: string }[];
    body: string;
  };

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
