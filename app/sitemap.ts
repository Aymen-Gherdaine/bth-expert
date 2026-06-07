import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n-config";
import { listContentByDate } from "@/lib/content";

const BASE_URL = "https://bthexpert.com";

const STATIC_ROUTES = [
  { path: "/",                                        priority: 1.0, freq: "weekly"  },
  { path: "/services/",                               priority: 0.9, freq: "monthly" },
  { path: "/services/etude-impact-environnemental/",  priority: 0.9, freq: "monthly" },
  { path: "/services/etude-de-dangers/",              priority: 0.8, freq: "monthly" },
  { path: "/services/audit-environnemental/",         priority: 0.8, freq: "monthly" },
  { path: "/services/conformite-reglementaire/",      priority: 0.8, freq: "monthly" },
  { path: "/services/hse/",                           priority: 0.8, freq: "monthly" },
  { path: "/secteurs/",                               priority: 0.7, freq: "monthly" },
  { path: "/secteurs/industrie-petrochimie/",         priority: 0.7, freq: "monthly" },
  { path: "/secteurs/pharmaceutique/",                priority: 0.7, freq: "monthly" },
  { path: "/secteurs/agroalimentaire/",               priority: 0.7, freq: "monthly" },
  { path: "/secteurs/btp-infrastructure/",            priority: 0.7, freq: "monthly" },
  { path: "/equipe/",                                 priority: 0.8, freq: "monthly" },
  { path: "/projets/",                                priority: 0.7, freq: "monthly" },
  { path: "/blog/",                                   priority: 0.7, freq: "weekly"  },
  { path: "/oran/",                                   priority: 0.9, freq: "monthly" },
  { path: "/a-propos/",                               priority: 0.6, freq: "yearly"  },
  { path: "/contact/",                                priority: 0.8, freq: "yearly"  },
] as const;

function url(lang: string, path: string): string {
  return `${BASE_URL}/${lang}${path === "/" ? "" : path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, freq } of STATIC_ROUTES) {
    for (const lang of locales) {
      entries.push({
        url: url(lang, path),
        priority,
        changeFrequency: freq,
      });
    }
  }

  // Articles de blog (source FR, dupliqué sur 3 langues)
  const posts = await listContentByDate("fr", "blog");
  for (const post of posts) {
    const lastModified = post.frontmatter.date
      ? new Date(post.frontmatter.date)
      : undefined;
    for (const lang of locales) {
      entries.push({
        url: url(lang, `/blog/${post.slug}/`),
        priority: 0.6,
        changeFrequency: "yearly",
        lastModified,
      });
    }
  }

  // Études de cas / projets
  const projets = await listContentByDate("fr", "projets");
  for (const projet of projets) {
    const lastModified = projet.frontmatter.date
      ? new Date(projet.frontmatter.date)
      : undefined;
    for (const lang of locales) {
      entries.push({
        url: url(lang, `/projets/${projet.slug}/`),
        priority: 0.7,
        changeFrequency: "yearly",
        lastModified,
      });
    }
  }

  return entries;
}
