import "server-only";
import { cache } from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Locale } from "./i18n-config";

const CONTENT_DIR = path.join(process.cwd(), "content");

export interface ContentFrontmatter {
  title: string;
  description: string;
  date?: string;
  slug?: string;
  image?: string;
  author?: string;
  tags?: string[];
  status?: "draft" | "published";
  [key: string]: unknown;
}

export interface ContentPage {
  frontmatter: ContentFrontmatter;
  html: string;
  slug: string;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkHtml, { sanitize: false })
    .process(markdown);
  return result.toString();
}

/**
 * Lit un fichier markdown depuis content/{lang}/{collection}/{slug}.md.
 * Retourne null si le fichier n'existe pas.
 *
 * Mémoïsé via `cache()` : une même page appelle souvent getContent pour le
 * même slug (generateMetadata + corps de page + listing), on évite ainsi de
 * relire et re-parser le fichier plusieurs fois par rendu.
 */
export const getContent = cache(async function getContent(
  lang: Locale,
  collection: string,
  slug: string
): Promise<ContentPage | null> {
  const filePath = path.join(CONTENT_DIR, lang, collection, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  // Un article en brouillon n'est jamais exposé côté public (page détail,
  // listing ou sitemap) — seule l'UI Keystatic y donne accès.
  if (data.status === "draft") return null;

  const html = await markdownToHtml(content);

  return {
    frontmatter: data as ContentFrontmatter,
    html,
    slug,
  };
});

/**
 * Liste tous les fichiers d'une collection pour une langue donnée.
 * Retourne [] si le répertoire n'existe pas encore.
 */
export async function listContent(
  lang: Locale,
  collection: string
): Promise<ContentPage[]> {
  const dir = path.join(CONTENT_DIR, lang, collection);
  if (!fs.existsSync(dir)) return [];

  const slugs = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));

  const pages = await Promise.all(
    slugs.map((slug) => getContent(lang, collection, slug))
  );

  return pages.filter((p): p is ContentPage => p !== null);
}

/**
 * Liste triée par date décroissante (articles de blog, projets).
 */
export async function listContentByDate(
  lang: Locale,
  collection: string
): Promise<ContentPage[]> {
  const pages = await listContent(lang, collection);
  return pages.sort((a, b) => {
    const da = a.frontmatter.date ?? "";
    const db = b.frontmatter.date ?? "";
    return db.localeCompare(da);
  });
}
