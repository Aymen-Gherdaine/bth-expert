import type { MetadataRoute } from "next";

const BASE_URL = "https://bthexpert.com";

export default function robots(): MetadataRoute.Robots {
  return {
    // Un seul groupe par user-agent : avec deux groupes « * », certains
    // robots ne lisent que le premier (allow) et ignorent les disallow.
    rules: [{ userAgent: "*", allow: "/", disallow: ["/keystatic/", "/api/"] }],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
