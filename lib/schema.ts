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

// ── LocalBusiness / ProfessionalService ─────────────────────────────────────

export function schemaLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": ORG_ID,
    name: "BTH Expert",
    url: BASE_URL,
    telephone: "+213670708138",
    email: "info@bthexpert.dz",
    address: BTH_ADDRESS,
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
