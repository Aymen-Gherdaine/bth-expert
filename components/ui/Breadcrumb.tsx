import Link from "next/link";
import { breadcrumbTrail, BREADCRUMB_NAV_LABEL, type BreadcrumbItem } from "@/lib/schema";
import type { Locale } from "@/lib/i18n-config";

interface BreadcrumbProps {
  lang: Locale;
  /** Sans l'accueil, comme pour `schemaBreadcrumb`. */
  items: BreadcrumbItem[];
  /** "dark" on brand surfaces (TerrainHero). */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Visible trail above a page title: Accueil / Section / Page. Plain text
 * links, the current page unlinked and marked aria-current. One component
 * for every level-2 and level-3 page so the answer to "where am I" sits in
 * the same place everywhere.
 */
export function Breadcrumb({ lang, items, tone = "light", className = "" }: BreadcrumbProps) {
  const trail = breadcrumbTrail(lang, items);
  const link =
    tone === "dark"
      ? "text-cream/65 hover:text-cream"
      : "text-muted hover:text-ink";
  const current = tone === "dark" ? "text-cream" : "text-ink";
  const sep = tone === "dark" ? "text-cream/35" : "text-line";

  return (
    <nav aria-label={BREADCRUMB_NAV_LABEL[lang] ?? BREADCRUMB_NAV_LABEL.fr} className={className}>
      <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-sans text-[length:var(--text-small)]">
        {trail.map((item, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-x-2.5">
              {i > 0 && (
                <span aria-hidden className={sep}>
                  /
                </span>
              )}
              {last ? (
                <span aria-current="page" className={current}>
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className={`press-row inline-flex items-center min-h-11 -my-2 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ${link}`}
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
