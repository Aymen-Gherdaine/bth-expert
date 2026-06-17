/**
 * Agent IA blog — Netlify Scheduled Function (TODO 3.4).
 *
 * S'exécute le 1er de chaque mois, choisit le prochain sujet non traité dans
 * `blog-topics.json`, génère un article via l'API Anthropic, et le commit
 * directement dans `content/fr/blog/{slug}.md` avec `status: draft` — il
 * n'apparaît jamais sur le site public (cf. lib/content.ts) tant qu'un humain
 * ne le repasse pas en "Publié" depuis l'admin Keystatic (/admin).
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
}

interface GeneratedArticle {
  description: string;
  tags: string[];
  faq: { q: string; a: string }[];
  body: string;
}

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

async function generateArticle(topic: Topic): Promise<GeneratedArticle> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY manquant");

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 4096,
    system: `Tu écris pour le blog de BTH Expert, bureau d'études environnemental agréé en Algérie, basé à Oran, fondé en 2009. Le blog s'adresse à des porteurs de projets industriels, énergétiques, BTP et agricoles en Algérie qui cherchent à comprendre leurs obligations réglementaires (étude d'impact, étude de dangers, audit HSE, plan de gestion environnementale).

Ton : professionnel, précis, pédagogique — jamais commercial ou survendu. N'invente jamais de référence légale (numéro de décret, de loi, délai chiffré) si tu n'es pas certain qu'elle est exacte ; dans le doute, reste général plutôt que de citer un texte précis. Le contenu sera relu par un expert avant publication, mais doit être le plus fiable possible.

Structure attendue pour le corps (Markdown, sans frontmatter) : un paragraphe d'introduction, 3 à 5 sections avec des titres "## ...", et une conclusion qui invite à contacter BTH Expert via le lien [Contactez notre équipe](/fr/contact). Utilise des liens Markdown internes pertinents vers /fr/services/etude-impact-environnemental, /fr/services/etude-de-dangers, /fr/services/audit-hse, /fr/services/plan-gestion-environnementale, /fr/secteurs/industrie-petrochimie, /fr/secteurs/energie-hydrocarbures, /fr/secteurs/infrastructures-btp, /fr/secteurs/agriculture-hydraulique quand c'est pertinent — pas systématiquement. Vise 600 à 900 mots.`,
    tools: [
      {
        name: "write_article",
        description: "Renvoie l'article de blog structuré.",
        input_schema: {
          type: "object",
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
      },
    ],
    tool_choice: { type: "tool", name: "write_article" },
    messages: [
      {
        role: "user",
        content: `Sujet de l'article : "${topic.title}"\n\nAngle éditorial : ${topic.angle}`,
      },
    ],
  });

  const toolUse = message.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new Error("Réponse Anthropic sans tool_use exploitable");
  }
  return toolUse.input as GeneratedArticle;
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

    const message = `Brouillon créé pour "${topic.title}" (content/fr/blog/${topic.slug}.md) — à valider dans /admin.`;
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
