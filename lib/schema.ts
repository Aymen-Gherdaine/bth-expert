import "server-only";

const BASE_URL = "https://bthexpert.com";

const ORG_ID = `${BASE_URL}/#organization`;

const BTH_ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "40, Lotissement 119",
  addressLocality: "Bir El Djir",
  addressRegion: "Oran",
  addressCountry: "DZ",
} as const;

// Centre de la commune de Bir El Djir — précision à affiner avec le pin GPS
// exact une fois la fiche Google Business Profile créée par le client.
const BTH_GEO = {
  "@type": "GeoCoordinates",
  latitude: 35.72,
  longitude: -0.555,
} as const;

// ── LocalBusiness / ProfessionalService ─────────────────────────────────────

export function schemaLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "BTH Expert",
    url: BASE_URL,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/bth-expert-logo-light-transparent.svg` },
    telephone: "+213670708138",
    email: "contact@bthexpert.com",
    address: BTH_ADDRESS,
    geo: BTH_GEO,
    foundingDate: "2026",
    openingHours: "Mo-Fr 08:00-17:00",
    areaServed: { "@type": "Country", name: "Algérie" },
    description:
      "Bureau d'études environnemental agréé par le Ministère de l'Environnement et de la Qualité de la Vie. Études d'impact, études de dangers, audits HSE et conformité réglementaire à Oran et dans toute l'Algérie.",
    knowsAbout: [
      "Étude d'impact environnemental",
      "Étude de dangers",
      "Audit environnemental",
      "Conformité réglementaire HSE",
    ],
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "Agrément ministériel",
      recognizedBy: {
        "@type": "GovernmentOrganization",
        name: "Ministère de l'Environnement et de la Qualité de la Vie, Algérie",
      },
    },
  };
}

// ── Service ──────────────────────────────────────────────────────────────────

interface ServiceParams {
  name: string;
  url: string;
  description: string;
  serviceType?: string;
}

export function schemaService({ name, url, description, serviceType }: ServiceParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name,
    url,
    description,
    serviceType: serviceType ?? name,
    provider: {
      "@type": "ProfessionalService",
      "@id": ORG_ID,
      name: "BTH Expert",
    },
    areaServed: { "@type": "Country", name: "Algérie" },
  };
}

// ── Article ──────────────────────────────────────────────────────────────────

interface ArticleParams {
  title: string;
  url: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
}

export function schemaArticle({
  title,
  url,
  description,
  datePublished,
  dateModified,
  authorName = "BTH Expert",
  image,
}: ArticleParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: title,
    url,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: authorName,
      worksFor: { "@type": "Organization", "@id": ORG_ID, name: "BTH Expert" },
    },
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "BTH Expert",
    },
    ...(image && { image: { "@type": "ImageObject", url: image } }),
  };
}

// ── Person ───────────────────────────────────────────────────────────────────

interface PersonParams {
  name: string;
  jobTitle: string;
  url: string;
  description?: string;
  image?: string;
}

export function schemaPerson({ name, jobTitle, url, description, image }: PersonParams) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name,
    jobTitle,
    url,
    worksFor: { "@type": "Organization", "@id": ORG_ID, name: "BTH Expert" },
    ...(description && { description }),
    ...(image && { image: { "@type": "ImageObject", url: image } }),
  };
}

// ── FAQPage ──────────────────────────────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export function schemaFAQ(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ── BreadcrumbList ───────────────────────────────────────────────────────────

const HOME_LABEL: Record<string, string> = {
  fr: "Accueil",
  ar: "الرئيسية",
  en: "Home",
};

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** `items` ne doit pas inclure l'accueil — il est ajouté automatiquement en tête. */
export function schemaBreadcrumb(lang: string, items: BreadcrumbItem[]) {
  const trail = [
    { name: HOME_LABEL[lang] ?? HOME_LABEL.fr, url: `${BASE_URL}/${lang}` },
    ...items,
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
