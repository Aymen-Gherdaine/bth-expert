/**
 * Runner local pour tester l'agent blog sans Netlify.
 *
 * Usage :
 *   ANTHROPIC_API_KEY=sk-ant-... tsx scripts/test-blog-agent.ts
 *
 * Génère l'article suivant dans /tmp/blog-test-<slug>.md (pas de commit GitHub).
 * Inspecte le fichier, vérifie le ton et le contenu, puis déclenche la vraie
 * fonction depuis Netlify quand tu es satisfait.
 */
import Anthropic from "@anthropic-ai/sdk";
import * as fs from "fs";
import * as path from "path";

const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const BLOG_DIR = path.join(process.cwd(), "content/fr/blog");
const TOPICS_PATH = path.join(process.cwd(), "netlify/functions/blog-topics.json");

interface Topic {
  slug: string;
  title: string;
  angle: string;
  image: string;
}

interface GeneratedArticle {
  description: string;
  tags: string[];
  faq: { q: string; a: string }[];
  body: string;
}

const WRITE_ARTICLE_TOOL = {
  name: "write_article",
  description: "Renvoie l'article de blog structuré.",
  input_schema: {
    type: "object" as const,
    properties: {
      description: { type: "string" },
      tags: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
      faq: {
        type: "array", minItems: 3, maxItems: 4,
        items: { type: "object", properties: { q: { type: "string" }, a: { type: "string" } }, required: ["q", "a"] },
      },
      body: { type: "string" },
    },
    required: ["description", "tags", "faq", "body"],
  },
};

const VOICE_EXAMPLE = `Deux dossiers identiques sur le papier, déposés à quelques semaines d'écart auprès de la même Direction de l'Environnement de Wilaya, peuvent connaître des sorts radicalement différents : l'un instruit sans complément, l'autre renvoyé avec une demande de pièces supplémentaires qui ajoute deux mois au calendrier. La différence tient rarement à la chance — elle tient au bureau d'études qui a préparé le dossier.

## 1. L'agrément ministériel, condition non négociable

En Algérie, seuls les bureaux d'études agréés par le Ministère de l'Environnement et de la Qualité de la Vie sont habilités à produire des rapports d'EIE et d'EDD recevables par l'administration.`;

const BANNED_PHRASES = ["dans le monde d'aujourd'hui","dans un monde en constante évolution","à l'ère de","il est essentiel de comprendre que","il est important de noter que","il convient de souligner que","force est de constater que","n'hésitez pas à","plonger dans","un véritable enjeu","au cœur de","véritable","incontournable","il ne fait aucun doute que","de plus en plus","en outre","en somme"];

const SYSTEM = `Tu écris pour le blog de BTH Expert, bureau d'études environnemental agréé en Algérie, basé à Oran. Le blog s'adresse à des porteurs de projets industriels, énergétiques, BTP et agricoles en Algérie qui cherchent à comprendre leurs obligations réglementaires.

Ton : professionnel, précis, pédagogique — jamais commercial ou survendu. N'invente jamais de référence légale si tu n'es pas certain qu'elle est exacte.

Voix à reproduire :
"""
${VOICE_EXAMPLE}
"""

Interdiction stricte : ${BANNED_PHRASES.map((p) => `"${p}"`).join(", ")}.

Structure : introduction concrète, 3 à 5 sections "## ...", conclusion avec lien [Contactez notre équipe](/fr/contact). 600 à 900 mots.`;

function extractToolInput(message: Anthropic.Message): GeneratedArticle {
  const toolUse = message.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") throw new Error("Réponse Anthropic sans tool_use");
  return toolUse.input as GeneratedArticle;
}

async function draftArticle(client: Anthropic, topic: Topic): Promise<GeneratedArticle> {
  console.log("  Passe 1 — premier jet...");
  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL, max_tokens: 4096, system: SYSTEM,
    tools: [WRITE_ARTICLE_TOOL], tool_choice: { type: "tool", name: "write_article" },
    messages: [{ role: "user", content: `Sujet : "${topic.title}"\n\nAngle : ${topic.angle}` }],
  });
  return extractToolInput(msg);
}

async function editArticle(client: Anthropic, topic: Topic, draft: GeneratedArticle): Promise<GeneratedArticle> {
  console.log("  Passe 2 — relecture éditoriale...");
  const msg = await client.messages.create({
    model: ANTHROPIC_MODEL, max_tokens: 4096,
    system: `${SYSTEM}\n\nTu agis comme rédacteur en chef : relis et améliore le premier jet (supprimer tics IA, varier les phrases, garder faits/structure/liens). Renvoie l'article complet via write_article.`,
    tools: [WRITE_ARTICLE_TOOL], tool_choice: { type: "tool", name: "write_article" },
    messages: [{ role: "user", content: `Sujet : "${topic.title}"\n\nAngle : ${topic.angle}\n\nPremier jet :\n${JSON.stringify(draft, null, 2)}` }],
  });
  return extractToolInput(msg);
}

function buildMarkdown(topic: Topic, article: GeneratedArticle): string {
  const date = new Date().toISOString().slice(0, 10);
  const faqYaml = article.faq.map((i) => `  - q: ${JSON.stringify(i.q)}\n    a: ${JSON.stringify(i.a)}`).join("\n");
  return `---\ntitle: ${JSON.stringify(topic.title)}\ndescription: ${JSON.stringify(article.description)}\ndate: "${date}"\nauthor: "BTH Expert"\nstatus: draft\nimage: ${JSON.stringify(topic.image)}\ntags: ${JSON.stringify(article.tags)}\nfaq:\n${faqYaml}\n---\n\n${article.body.trim()}\n`;
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) { console.error("❌  ANTHROPIC_API_KEY manquant.\nUsage : ANTHROPIC_API_KEY=sk-ant-... tsx scripts/test-blog-agent.ts"); process.exit(1); }

  const topicsRaw = JSON.parse(fs.readFileSync(TOPICS_PATH, "utf8"));
  const topics: Topic[] = Object.values(topicsRaw);
  const done = new Set(fs.readdirSync(BLOG_DIR).filter(f => f.endsWith(".md")).map(f => f.replace(".md", "")));
  const topic = topics.find(t => !done.has(t.slug));

  if (!topic) { console.log("✅  Tous les sujets ont déjà un article."); return; }

  console.log(`\n📝  Génération : "${topic.title}"`);
  console.log(`    slug : ${topic.slug}`);
  console.log(`    image : ${topic.image}\n`);

  const client = new Anthropic({ apiKey });
  const draft = await draftArticle(client, topic);
  const final = await editArticle(client, topic, draft);
  const markdown = buildMarkdown(topic, final);

  const outPath = `/tmp/blog-test-${topic.slug}.md`;
  fs.writeFileSync(outPath, markdown, "utf8");

  console.log(`\n✅  Article généré → ${outPath}`);
  console.log(`\n--- APERÇU (200 premiers caractères du body) ---`);
  console.log(final.body.slice(0, 200) + "...");
  console.log(`\n--- META ---`);
  console.log(`description (${final.description.length} chars): ${final.description}`);
  console.log(`tags: ${final.tags.join(", ")}`);
  console.log(`faq: ${final.faq.length} questions`);
  console.log(`\nPour publier : copie ${outPath} → content/fr/blog/${topic.slug}.md`);
  console.log("La vraie fonction (Netlify) fait la même chose + commit GitHub automatique.");
}

main().catch((e) => { console.error("❌", e); process.exit(1); });
