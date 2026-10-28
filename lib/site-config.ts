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
