"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

interface ProjectItem {
  slug: string;
  secteur: string;
  secteurSlug: string;
  title: string;
  excerpt: string;
  mission: string[];
  annee: string;
}

interface ProjectsFilterProps {
  items: ProjectItem[];
  allLabel: string;
  lang: string;
}

/**
 * Projects grid with a sector filter. The whole list is rendered server-side
 * (SSG) for SEO; this component adds client-side filtering as progressive
 * enhancement. Cards re-reveal with a GSAP stagger when the filter changes.
 * Honours prefers-reduced-motion.
 */
export function ProjectsFilter({ items, allLabel, lang }: ProjectsFilterProps) {
  const [active, setActive] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Unique sectors, preserving first-seen order.
  const sectors: { slug: string; title: string }[] = [];
  const seen = new Set<string>();
  for (const it of items) {
    if (!seen.has(it.secteurSlug)) {
      seen.add(it.secteurSlug);
      sectors.push({ slug: it.secteurSlug, title: it.secteur });
    }
  }

  const visible = active ? items.filter((i) => i.secteurSlug === active) : items;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const cards = gridRef.current?.querySelectorAll("[data-card]");
      if (!cards || cards.length === 0) return;
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "expo.out" }
      );
    },
    { dependencies: [active], scope: gridRef }
  );

  const filterCls = (isActive: boolean) =>
    [
      "relative font-sans uppercase tracking-widest pb-1 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]",
      "text-[length:var(--text-caption)]",
      isActive ? "text-ink" : "text-muted hover:text-ink",
      isActive
        ? "after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-gold"
        : "",
    ].join(" ");

  return (
    <>
      {/* Filter bar */}
      <div className="flex flex-wrap gap-x-8 gap-y-3 mb-12 lg:mb-16">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={filterCls(active === null)}
          aria-pressed={active === null}
        >
          {allLabel}
        </button>
        {sectors.map((s) => (
          <button
            key={s.slug}
            type="button"
            onClick={() => setActive(s.slug)}
            className={filterCls(active === s.slug)}
            aria-pressed={active === s.slug}
          >
            {s.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div ref={gridRef} className="grid gap-6 sm:grid-cols-2">
        {visible.map((item) => (
          <Link
            key={item.slug}
            data-card
            href={`/${lang}/projets/${item.slug}`}
            className="group block border border-line rounded-[var(--radius-md)] bg-cream-soft p-7 lg:p-8 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
          >
            <div className="flex items-center justify-between mb-5">
              <span className="text-[length:var(--text-caption)] uppercase tracking-widest text-gold">
                {item.secteur}
              </span>
              <span className="text-[length:var(--text-caption)] text-muted tabular-nums">
                {item.annee}
              </span>
            </div>
            <h2 className="font-display text-[length:var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink group-hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)] mb-3">
              {item.title}
            </h2>
            <p className="text-[length:var(--text-small)] text-ink-soft leading-[1.7] mb-5">
              {item.excerpt}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.mission.map((m) => (
                <span
                  key={m}
                  className="inline-flex items-center rounded-full border border-line px-3 py-1 text-[length:var(--text-caption)] text-muted"
                >
                  {m}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
