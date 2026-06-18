/**
 * Agent IA blog — Netlify Scheduled Function (TODO 3.4).
 *
 * S'exécute le 1er de chaque mois, choisit le prochain sujet non traité dans
 * `blog-topics.json`, génère un article en deux passes (premier jet, puis
 * relecture éditoriale qui élimine les tics de rédaction IA — cf.
 * `draftArticle`/`editArticle`), et le commit directement dans
 * `content/fr/blog/{slug}.md` avec `status: draft` — il n'apparaît jamais
 * sur le site public (cf. lib/content.ts) tant qu'un humain ne le repasse
 * pas en "Publié" depuis l'admin Keystatic (/keystatic). L'image de couverture
 * vient du champ `image` du sujet (illustration déjà existante dans
 * `/public/generated`, pas de génération d'image).
 *
 * Variables d'environnement requises (à définir sur Netlify) :
 * - ANTHROPIC_API_KEY        : clé API Anthropic
 * - BLOG_AGENT_GITHUB_TOKEN  : PAT GitHub avec accès en écriture au dépôt (contents)
 * Optionnelles :
 * - GITHUB_REPO              : "owner/repo" (défaut: Aymen-Gherdaine/bth-expert)
 * - BLOG_AGENT_BRANCH        : branche cible (défaut: main)
 * - ANTHROPIC_MODEL          : id de modèle (défaut: claude-sonnet-4-6)
 */
import type { Config } from "@netlify/functions";
import Anthropic from "@anthropic-ai/sdk";
import topics from "./blog-topics.json" with { type: "json" };

const GITHUB_REPO = process.env.GITHUB_REPO ?? "Aymen-Gherdaine/bth-expert";
const GITHUB_BRANCH = process.env.BLOG_AGENT_BRANCH ?? "main";
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";
const BLOG_DIR = "content/fr/blog";

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
      description: {
        type: "string",
        description: "Meta description SEO, 140 à 160 caractères, en français.",
      },
      tags: {
        type: "array",
        items: { type: "string" },
        minItems: 2,
        maxItems: 5,
      },
      faq: {
        type: "array",
        minItems: 3,
        maxItems: 4,
        items: {
          type: "object",
          properties: {
            q: { type: "string" },
            a: { type: "string" },
          },
          required: ["q", "a"],
        },
      },
      body: {
        type: "string",
        description: "Corps de l'article en Markdown, sans frontmatter.",
      },
    },
    required: ["description", "tags", "faq", "body"],
  },
};

// Extrait réel d'un article déjà publié — calibre la voix attendue (rythme,
// niveau de précision, ton) plutôt que de la décrire abstraitement.
const VOICE_EXAMPLE = `Deux dossiers identiques sur le papier, déposés à quelques semaines d'écart auprès de la même Direction de l'Environnement de Wilaya, peuvent connaître des sorts radicalement différents : l'un instruit sans complément, l'autre renvoyé avec une demande de pièces supplémentaires qui ajoute deux mois au calendrier. La différence tient rarement à la chance — elle tient au bureau d'études qui a préparé le dossier.

## 1. L'agrément ministériel, condition non négociable

En Algérie, seuls les bureaux d'études agréés par le Ministère de l'Environnement et de la Qualité de la Vie sont habilités à produire des rapports d'EIE et d'EDD recevables par l'administration. Avant toute discussion technique ou commerciale, vérifiez que l'agrément du bureau est valide et couvre bien le type d'étude dont votre projet a besoin — un agrément pour l'EIE ne couvre pas automatiquement l'EDD.`;

const BANNED_PHRASES = [
  "dans le monde d'aujourd'hui",
  "dans un monde en constante évolution",
  "à l'ère de",
  "il est essentiel de comprendre que",
  "il est important de noter que",
  "il convient de souligner que",
  "force est de constater que",
  "n'hésitez pas à",
  "plonger dans",
  "un véritable enjeu",
  "au cœur de",
  "véritable",
  "incontournable",
  "il ne fait aucun doute que",
  "de plus en plus",
  "en outre",
  "en somme",
];

const SHARED_VOICE_GUIDANCE = `Tu écris pour le blog de BTH Expert, bureau d'études environnemental agréé en Algérie, basé à Oran. Le blog s'adresse à des porteurs de projets industriels, énergétiques, BTP et agricoles en Algérie qui cherchent à comprendre leurs obligations réglementaires (étude d'impact, étude de dangers, audit HSE, plan de gestion environnementale).

Ton : professionnel, précis, pédagogique — jamais commercial ou survendu. N'invente jamais de référence légale (numéro de décret, de loi, délai chiffré) si tu n'es pas certain qu'elle est exacte ; dans le doute, reste général plutôt que de citer un texte précis. Le contenu sera relu par un expert avant publication, mais doit être le plus fiable possible.

Voix à reproduire — extrait réel d'un article déjà publié sur ce blog, à utiliser comme référence de rythme et de ton (pas comme contenu à copier) :
"""
${VOICE_EXAMPLE}
"""

Ce qui caractérise cette voix : une accroche concrète (un cas, un chiffre, une situation), des phrases de longueur variable, des affirmations qui s'appuient sur un mécanisme ou une cause précise plutôt que sur une généralité, et un vocabulaire de métier sans jargon inutile.

Interdiction stricte : n'utilise JAMAIS les formules suivantes, ni leurs variantes proches (marqueurs typiques d'un texte généré par IA) : ${BANNED_PHRASES.map((p) => `"${p}"`).join(", ")}. Pas de phrase d'ouverture générique du type "Dans le secteur de...", pas de liste de trois adjectifs en série ("rapide, efficace et fiable"), pas d'emphase artificielle.

Structure attendue pour le corps (Markdown, sans frontmatter) : un paragraphe d'introduction concret (pas une généralité sur le secteur), 3 à 5 sections avec des titres "## ...", et une conclusion qui invite à contacter BTH Expert via le lien [Contactez notre équipe](/fr/contact). Utilise des liens Markdown internes pertinents vers /fr/services/etude-impact-environnemental, /fr/services/etude-de-dangers, /fr/services/audit-hse, /fr/services/plan-gestion-environnementale, /fr/secteurs/industrie-petrochimie, /fr/secteurs/energie-hydrocarbures, /fr/secteurs/infrastructures-btp, /fr/secteurs/agriculture-hydraulique quand c'est pertinent — pas systématiquement. Vise 600 à 900 mots.`;

async function githubRequest(path: string, init?: RequestInit) {
  const token = process.env.BLOG_AGENT_GITHUB_TOKEN;
  if (!token) throw new Error("BLOG_AGENT_GITHUB_TOKEN manquant");

  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
  });
  return res;
}

async function getExistingSlugs(): Promise<Set<string>> {
  const res = await githubRequest(`contents/${BLOG_DIR}?ref=${GITHUB_BRANCH}`);
  if (res.status === 404) return new Set();
  if (!res.ok) throw new Error(`Échec lecture ${BLOG_DIR} : ${res.status} ${await res.text()}`);

  const files = (await res.json()) as { name: string }[];
  return new Set(files.filter((f) => f.name.endsWith(".md")).map((f) => f.name.replace(/\.md$/, "")));
}

function nextTopic(existingSlugs: Set<string>): Topic | null {
  return (topics as Topic[]).find((t) => !existingSlugs.has(t.slug)) ?? null;
}

function extractToolInput(message: Anthropic.Message): GeneratedArticle {
  const toolUse = message.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Réponse Anthropic sans tool_use exploitable");
  }
  return toolUse.input as GeneratedArticle;
}

/** Passe 1 — premier jet structuré à partir du sujet. */
async function draftArticle(client: Anthropic, topic: Topic): Promise<GeneratedArticle> {
  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: SHARED_VOICE_GUIDANCE,
    tools: [WRITE_ARTICLE_TOOL],
    tool_choice: { type: "tool", name: "write_article" },
    messages: [
      {
        role: "user",
        content: `Sujet de l'article : "${topic.title}"\n\nAngle éditorial : ${topic.angle}`,
      },
    ],
  });
  return extractToolInput(message);
}

/**
 * Passe 2 — relecture éditoriale du premier jet. Un humain validera quand
 * même chaque brouillon avant publication, mais cette passe élimine la
 * plupart des tics de rédaction IA avant que cette relecture n'ait lieu.
 */
async function editArticle(
  client: Anthropic,
  topic: Topic,
  draft: GeneratedArticle
): Promise<GeneratedArticle> {
  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: `${SHARED_VOICE_GUIDANCE}

Tu agis maintenant comme rédacteur en chef senior qui relit le premier jet d'un collègue avant publication. Réécris l'article pour :
- supprimer toute formule interdite ou tic d'écriture IA restant (transitions creuses, généralités, emphase artificielle) ;
- varier la longueur des phrases et resserrer les passages trop verbeux ;
- remplacer toute affirmation vague par un mécanisme, une cause ou un exemple concret quand c'est possible, sans jamais inventer de chiffre ou de référence légale incertaine ;
- garder exactement les mêmes faits, la même structure de titres "##", les mêmes liens internes et la même longueur approximative.

Renvoie l'article complet révisé via l'outil write_article — jamais un résumé des changements.`,
    tools: [WRITE_ARTICLE_TOOL],
    tool_choice: { type: "tool", name: "write_article" },
    messages: [
      {
        role: "user",
        content: `Sujet de l'article : "${topic.title}"\n\nAngle éditorial : ${topic.angle}\n\nPremier jet à réviser :\n${JSON.stringify(draft, null, 2)}`,
      },
    ],
  });
  return extractToolInput(message);
}

async function generateArticle(topic: Topic): Promise<GeneratedArticle> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquant");

  const client = new Anthropic({ apiKey });
  const draft = await draftArticle(client, topic);
  return editArticle(client, topic, draft);
}

function buildMarkdown(topic: Topic, article: GeneratedArticle): string {
  const date = new Date().toISOString().slice(0, 10);
  const faqYaml = article.faq
    .map((item) => `  - q: ${JSON.stringify(item.q)}\n    a: ${JSON.stringify(item.a)}`)
    .join("\n");
  const tagsYaml = JSON.stringify(article.tags);

  return `---
title: ${JSON.stringify(topic.title)}
description: ${JSON.stringify(article.description)}
date: "${date}"
author: "BTH Expert"
status: draft
image: ${JSON.stringify(topic.image)}
tags: ${tagsYaml}
faq:
${faqYaml}
---

${article.body.trim()}
`;
}

async function commitArticle(topic: Topic, markdown: string): Promise<void> {
  const path = `${BLOG_DIR}/${topic.slug}.md`;
  const res = await githubRequest(`contents/${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `feat(blog): brouillon généré par l'agent IA — ${topic.title}`,
      content: Buffer.from(markdown, "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
    }),
  });

  if (!res.ok) {
    throw new Error(`Échec du commit ${path} : ${res.status} ${await res.text()}`);
  }
}

const handler = async (): Promise<Response> => {
  try {
    const existingSlugs = await getExistingSlugs();
    const topic = nextTopic(existingSlugs);

    if (!topic) {
      const message = "Aucun nouveau sujet disponible — tous les sujets de blog-topics.json ont déjà un article.";
      console.log(message);
      return new Response(JSON.stringify({ skipped: true, message }), { status: 200 });
    }

    const article = await generateArticle(topic);
    const markdown = buildMarkdown(topic, article);
    await commitArticle(topic, markdown);

    const message = `Brouillon créé pour "${topic.title}" (content/fr/blog/${topic.slug}.md) — à valider dans /keystatic.`;
    console.log(message);
    return new Response(JSON.stringify({ skipped: false, slug: topic.slug, message }), { status: 200 });
  } catch (err) {
    console.error("[generate-blog-post] échec :", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};

export default handler;

export const config: Config = {
  schedule: "0 6 1 * *",
};
