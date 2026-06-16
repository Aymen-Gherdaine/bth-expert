import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n-config";
import fr from "@/dictionaries/fr.json";

const BASE_URL = "https://bthexpert.com";

// Routes statiques (hors secteurs/projets, générés depuis fr.json ci-dessous
// pour ne jamais désynchroniser le sitemap des vraies pages du site).
const STATIC_ROUTES = [
  { path: "/",                                          priority: 1.0, freq: "weekly"  },
  { path: "/services/",                                 priority: 0.9, freq: "monthly" },
  { path: "/services/etude-impact-environnemental/",    priority: 0.9, freq: "monthly" },
  { path: "/services/etude-de-dangers/",                priority: 0.8, freq: "monthly" },
  { path: "/services/audit-hse/",                       priority: 0.8, freq: "monthly" },
  { path: "/services/plan-gestion-environnementale/",   priority: 0.8, freq: "monthly" },
  { path: "/secteurs/",                                 priority: 0.7, freq: "monthly" },
  { path: "/equipe/",                                   priority: 0.8, freq: "monthly" },
  { path: "/projets/",                                  priority: 0.7, freq: "monthly" },
  { path: "/oran/",                                     priority: 0.9, freq: "monthly" },
  { path: "/a-propos/",                                 priority: 0.6, freq: "yearly"  },
  { path: "/contact/",                                  priority: 0.8, freq: "yearly"  },
] as const;

function url(lang: string, path: string): string {
  return `${BASE_URL}/${lang}${path === "/" ? "" : path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
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

  for (const secteur of fr.secteurs.list) {
    for (const lang of locales) {
      entries.push({
        url: url(lang, `/secteurs/${secteur.slug}/`),
        priority: 0.7,
        changeFrequency: "monthly",
      });
    }
  }

  for (const projet of fr.projets.items) {
    for (const lang of locales) {
      entries.push({
        url: url(lang, `/projets/${projet.slug}/`),
        priority: 0.7,
        changeFrequency: "yearly",
      });
    }
  }

  return entries;
}
