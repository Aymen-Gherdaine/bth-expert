import type { MetadataRoute } from "next";

const BASE_URL = "https://bthexpert.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/keystatic/", "/api/"] },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
