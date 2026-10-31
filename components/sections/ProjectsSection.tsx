"use client";

import { SECTION_PX } from "@/components/layout/Container";
import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { useNearViewport } from "@/components/motion/useNearViewport";
import { gsap } from "@/lib/gsap";
import type { Locale } from "@/lib/i18n";

/** One case study, as produced by `scripts/sync-content.ts` from Keystatic. */
export interface ProjectsSectionItem {
  slug: string;
  title: string;
  secteur: string;
  annee: string;
  mission: readonly string[];
}

interface ProjectsSectionProps {
  lang: Locale;
  /** The real case studies (content/fr/projets), same source as /projets. */
  projects: readonly ProjectsSectionItem[];
}

interface SectionContent {
  eyebrow: string;
  intro: string;
  heading: string;
  cta: string;
}

// Section chrome only (hors Keystatic). Les projets eux-mêmes viennent du
// contenu : la home et /projets ne peuvent plus lister deux choses différentes.
const CONTENT: Record<Locale, SectionContent> = {
  fr: {
    eyebrow: "Réalisations",
    intro:
      "Trois dossiers instruits en wilaya, de l'état initial du site jusqu'au dépôt du rapport.",
    heading: "Des études déposées, pas des promesses",
    cta: "Voir tous les projets",
  },
  ar: {
    eyebrow: "إنجازات",
    intro: "ثلاثة ملفات عولجت على مستوى الولاية، من الحالة الأولية للموقع إلى إيداع التقرير.",
    heading: "دراسات مودعة، لا وعود",
    cta: "عرض جميع المشاريع",
  },
  en: {
    eyebrow: "Selected work",
    intro:
      "Three files processed at wilaya level, from the site baseline to the report filing.",
    heading: "Studies filed, not promises",
    cta: "View all projects",
  },
};

/**
 * Per-row column placement (desktop). The stagger down the list is the
 * point: rows drift right then snap back left, so the index reads as a
 * composed page rather than a uniform table.
 */
const ROW_LAYOUTS = [
  {
    num: "lg:col-start-1 lg:col-span-1",
    name: "lg:col-start-3 lg:col-span-6",
    meta: "lg:col-start-10 lg:col-span-3",
  },
  {
    num: "lg:col-start-2 lg:col-span-1",
    name: "lg:col-start-4 lg:col-span-6",
    meta: "lg:col-start-11 lg:col-span-2",
  },
  {
    num: "lg:col-start-1 lg:col-span-1",
    name: "lg:col-start-2 lg:col-span-6",
    meta: "lg:col-start-10 lg:col-span-3",
  },
  {
    num: "lg:col-start-3 lg:col-span-1",
    name: "lg:col-start-5 lg:col-span-5",
    meta: "lg:col-start-11 lg:col-span-2",
  },
];

/**
 * Réalisations — editorial asymmetric index, zero imagery (Pentagram/Klim
 * pattern). Premium comes from Fraunces at scale, staggered indentation
 * and motion: on hover the name shifts to brand, a gold filet traces the
 * row, the number swells and a giant ghost keyword fades into the void
 * where a photo would normally sit.
 */
export function ProjectsSection({ lang, projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const near = useNearViewport(sectionRef);
  const c = CONTENT[lang];

  useGSAP(
    () => {
      if (!near) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const section = sectionRef.current;
      if (!section) return;

      // ── Header — eyebrow → title → intro, staggered on entry ────────
      const header = section.querySelector<HTMLElement>("[data-projects-header]");
      if (header) {
        const items = header.querySelectorAll<HTMLElement>("[data-reveal]");
        gsap.from(items, {
          y: 24,
          opacity: 0,
          duration: 0.85,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: header, start: "top 80%", once: true },
        });
      }

      // ── Rows — border traces, then number → name → meta cascade ─────
      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll("[data-project-row]")
      );
      rows.forEach((row) => {
        const border = row.querySelector<HTMLElement>("[data-row-border]");
        const bits = row.querySelectorAll<HTMLElement>("[data-row-bit]");
        if (!border || bits.length === 0) return;

        gsap
          .timeline({
            defaults: { ease: "expo.out" },
            scrollTrigger: { trigger: row, start: "top 85%", once: true },
          })
          .from(border, {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
          })
          .from(bits, { y: 22, opacity: 0, duration: 0.7, stagger: 0.09 }, 0.3);
      });
    },
    { scope: sectionRef, dependencies: [near] }
  );

  return (
    <section ref={sectionRef} className="bg-cream-soft">
      <div className={`${SECTION_PX} pt-24 lg:pt-36 pb-16 lg:pb-24`}>
        {/* ── Header — title left, intro offset right and higher ─────── */}
        <div
          data-projects-header
          className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-8"
        >
          <span
            data-reveal
            className="order-1 lg:order-none lg:col-span-6 lg:row-start-1 inline-flex items-center gap-3 self-start font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]"
          >
            <span aria-hidden className="w-8 h-px bg-gold-ink" />
            {c.eyebrow}
          </span>

          <p
            data-reveal
            className="order-3 lg:order-none mt-6 lg:mt-0 lg:col-span-4 lg:col-start-9 lg:row-start-1 max-w-md font-sans text-muted leading-[1.7] text-[length:var(--text-small)]"
          >
            {c.intro}
          </p>

          <h2
            data-reveal
            className="order-2 lg:order-none mt-8 lg:mt-14 lg:col-span-8 lg:row-start-2 font-display font-light text-ink tracking-[-0.03em] leading-[1.05] max-w-2xl"
            style={{ fontSize: "var(--text-h2)" }}
          >
            {c.heading}
          </h2>
        </div>

        {/* ── Index — full-width rows, staggered indentation ──────────── */}
        <ol className="mt-16 lg:mt-24 border-b border-line">
          {projects.map((project, i) => {
            const layout = ROW_LAYOUTS[i % ROW_LAYOUTS.length];
            return (
              <li
                key={project.slug}
                data-project-row
                className="group relative grid grid-cols-12 gap-x-4 lg:gap-x-8 items-start lg:items-baseline py-10 lg:py-14"
              >
                {/* Whole row is the link; the grid children stay in flow */}
                <Link
                  href={`/${lang}/projets/${project.slug}`}
                  aria-label={project.title}
                  className="absolute inset-0 z-20 rounded-sm"
                />
                {/* Top border — traces in on scroll */}
                <span
                  data-row-border
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-px bg-line"
                />
                {/* Gold filet — traces across the row on hover */}
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 z-10 h-px bg-gold scale-x-0 ltr:origin-left rtl:origin-right transition-[scale] duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100"
                />

                {/* Ghost year — movement fills the void, no image */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute end-[3%] top-1/2 -translate-y-1/2 ltr:-translate-x-8 rtl:translate-x-8 hidden lg:block font-display uppercase tracking-[0.06em] leading-none whitespace-nowrap text-brand/[0.07] opacity-0 transition-[opacity,translate] duration-500 ease-[var(--ease-out-expo)] group-hover:opacity-100 group-hover:translate-x-0"
                  style={{ fontSize: "clamp(2.5rem, 1.5rem + 5vw, 6rem)" }}
                >
                  {project.annee}
                </span>

                <span
                  data-row-bit
                  className={`col-span-2 ${layout.num} font-display text-gold-ink leading-none tabular-nums`}
                  style={{ fontSize: "clamp(1.25rem, 1rem + 1vw, 1.875rem)" }}
                >
                  <span className="inline-block transition-[scale] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:scale-[1.12]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>

                <h3
                  data-row-bit
                  className={`col-span-10 ${layout.name} font-display font-light text-ink-soft tracking-[-0.02em] leading-[1.12] transition-[translate,color] duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-2 rtl:group-hover:-translate-x-2 group-hover:text-brand`}
                  style={{ fontSize: "clamp(1.625rem, 1rem + 2.2vw, 2.75rem)" }}
                >
                  {project.title}
                </h3>

                <div
                  data-row-bit
                  className={`relative z-10 col-span-10 col-start-3 mt-4 lg:mt-0 ${layout.meta} font-sans text-[length:var(--text-small)]`}
                >
                  <p className="text-ink-soft">{project.secteur}</p>
                  <p className="mt-1 text-muted">{project.mission.join(" · ")}</p>
                </div>
              </li>
            );
          })}
        </ol>

        {/* ── Footer link ─────────────────────────────────────────────── */}
        <div className="mt-12 lg:mt-16">
          <Link
            href={`/${lang}/projets`}
            className="group inline-flex items-center gap-2 min-h-11 py-2 -my-2 font-sans text-[length:var(--text-small)] text-ink tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
          >
            {c.cta}
            <span
              aria-hidden
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
