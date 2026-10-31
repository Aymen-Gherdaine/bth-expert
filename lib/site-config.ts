/** Networks we have an icon for (see `lib/social-links.ts`). */
export type SocialNetwork = "LinkedIn" | "Instagram" | "Facebook";

/** A real, client-provided social profile. */
export interface SocialProfile {
  network: SocialNetwork;
  url: string;
}

/**
 * Social profiles shown in the footer. Empty until the client provides real
 * URLs: an icon renders only when its network is listed here, so we never
 * ship `href="#"` links (dead links for crawlers and screen-reader users).
 */
export const socialProfiles: readonly SocialProfile[] = [];

/**
 * NAP (Name, Address, Phone) — the one place these values live.
 *
 * Google's local algorithm matches the business across the web on these
 * exact strings, so every surface (header, footer, contact, JSON-LD, mobile
 * menu) must print them identically. Edit here, never inline in a component.
 * Keystatic content that repeats them (home, contact, oran) must use the same
 * `phoneDisplay` format.
 */
export const siteContact = {
  legalName: "BTH Expert",
  /** Human-readable, as printed on the site. */
  phoneDisplay: "+213 (670) 70 81 38",
  /** E.164, for tel: links and structured data. */
  phoneE164: "+213670708138",
  /** Digits only, for wa.me links. */
  whatsappNumber: "213670708138",
  email: "info@bthexpert.com",
  address: {
    street: "40, Lotissement 119",
    locality: "Bir El Djir",
    city: "Oran",
    country: "Algérie",
  },
  /**
   * Same address in Arabic, for Arabic running text (legal pages). The Latin
   * form stays in the footer and structured data so the NAP is identical
   * everywhere Google compares it.
   */
  addressAr: {
    street: "40، تجزئة 119",
    locality: "بئر الجير",
    city: "وهران",
    country: "الجزائر",
  },
} as const;

/**
 * Company registration identifiers printed on the legal notice.
 *
 * Every field is optional on purpose: a line is rendered only when the value
 * is known, so the public page never shows a placeholder. Fill them in from
 * the extrait de registre de commerce and the carte NIF once the client
 * provides them (TODO 5.13).
 */
export const legalRegistration: {
  /** e.g. "EURL", "SARL" */
  legalForm?: string;
  /** e.g. "100 000 DA" */
  capital?: string;
  /** Registre de commerce, e.g. "31/00-1234567 B 26" */
  rc?: string;
  /** Numéro d'identification fiscale (15 chiffres) */
  nif?: string;
  /** Numéro d'identification statistique */
  nis?: string;
  /** Article d'imposition */
  ai?: string;
  /** Référence de l'agrément ministériel (numéro et date) */
  agrement?: string;
} = {};
