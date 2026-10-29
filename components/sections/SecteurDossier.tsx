import Link from "next/link";
import { SECTION_PX } from "@/components/layout/Container";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { getFiche, type RessourcesDict } from "@/lib/ressources";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n-config";

type SecteursDict = Dictionary["secteurs"];
type Secteur = SecteursDict["list"][number];
type Projet = Dictionary["projets"]["items"][number];

interface SecteurDossierProps {
  lang: Locale;
  labels: SecteursDict;
  secteur: Secteur;
  ressources: RessourcesDict;
  /** Études de cas du secteur (déjà filtrées sur `secteurSlug`). */
  projets: Projet[];
}

const eyebrowCls =
  "inline-flex items-center gap-3 font-sans uppercase tracking-[0.2em] text-gold-ink text-[length:var(--text-caption)]";
const arrowCls =
  "inline-flex items-center gap-2 min-h-11 font-sans font-medium text-brand text-[length:var(--text-small)] tracking-tight group-hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";
const arrowGlyph =
  "inline-block rtl:-scale-x-100 transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1";

/**
 * The sector dossier: three blocks a prospect actually needs before calling
 * us, all read from Keystatic (collection « Secteurs »).
 *
 *  1. Textes applicables — the sector's own reading of each regulatory text,
 *     each line linking to its verified fiche in the resource centre. A text
 *     whose fiche slug is unknown is refused at `npm run content:sync`, so a
 *     missing lookup here can only come from a stale dictionary: we skip it
 *     rather than ship a dead link.
 *  2. Parcours — the studies required, in the order a project meets them,
 *     with a link to the matching service page when one applies.
 *  3. Études de cas — the projects tagged with this sector; hidden when none.
 */
export function SecteurDossier({ lang, labels, secteur, ressources, projets }: SecteurDossierProps) {
  const textes = secteur.textes
    .map((t) => ({ note: t.note, fiche: getFiche(ressources, t.fiche) }))
    .filter((t): t is { note: string; fiche: NonNullable<typeof t.fiche> } => t.fiche !== null);

  return (
    <>
      {/* ── 1. Textes applicables ─────────────────────────────────── */}
      {textes.length > 0 && (
        <section className="bg-cream-warm">
          <div className={`${SECTION_PX} py-20 lg:py-28`}>
            <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
              <div className="lg:col-span-4">
                <FadeIn className="lg:sticky lg:top-32">
                  <span className={eyebrowCls}>
                    <span aria-hidden className="w-8 h-px bg-gold-ink" />
                    {labels.textesLabel}
                  </span>
                  <p className="mt-8 max-w-md font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                    {labels.textesIntro}
                  </p>
                  {secteur.nomenclatureNote && (
                    <p className="mt-8 max-w-md border-s-2 border-gold ps-5 font-sans text-ink leading-[1.7] text-[length:var(--text-small)]">
                      {secteur.nomenclatureNote}
                    </p>
                  )}
                </FadeIn>
              </div>

              <FadeInStagger className="mt-14 lg:mt-0 lg:col-span-8 border-t border-line">
                {textes.map(({ fiche, note }) => (
                  <FadeInItem key={fiche.slug}>
                    <Link
                      href={`/${lang}/ressources/${fiche.slug}`}
                      className="group grid gap-x-8 gap-y-4 py-8 lg:py-10 border-b border-line sm:grid-cols-12"
                    >
                      <div className="sm:col-span-3">
                        <p
                          className="font-display font-light text-ink tracking-[-0.03em] leading-none tabular-nums transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                          style={{ fontSize: "clamp(2rem, 2.2vw + 1rem, 3rem)" }}
                          dir="ltr"
                        >
                          {fiche.ref}
                        </p>
                        <p
                          className="mt-3 font-sans uppercase tracking-[0.14em] text-gold-ink"
                          style={{ fontSize: "var(--text-caption)" }}
                        >
                          {fiche.typeLabel}
                        </p>
                      </div>
                      <div className="sm:col-span-9">
                        <h3
                          className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                          style={{ fontSize: "var(--text-h3)" }}
                        >
                          {fiche.title}
                        </h3>
                        <p className="mt-3 max-w-2xl font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                          {note}
                        </p>
                        <span className={`${arrowCls} mt-4`}>
                          <span aria-hidden className="w-5 h-px bg-gold shrink-0 group-hover:w-7 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
                          {labels.readFiche}
                          <span aria-hidden className={arrowGlyph}>→</span>
                        </span>
                      </div>
                    </Link>
                  </FadeInItem>
                ))}
              </FadeInStagger>
            </div>
          </div>
        </section>
      )}

      {/* ── 2. Parcours — the studies, in order ──────────────────── */}
      {secteur.parcours.length > 0 && (
        <section className="bg-cream-soft">
          <div className={`${SECTION_PX} py-20 lg:py-28`}>
            <FadeIn className="lg:grid lg:grid-cols-12 lg:gap-12 mb-12 lg:mb-16">
              <span className={`${eyebrowCls} lg:col-span-4 self-start`}>
                <span aria-hidden className="w-8 h-px bg-gold-ink" />
                {labels.parcoursLabel}
              </span>
              <p className="mt-6 lg:mt-0 lg:col-span-6 lg:col-start-6 font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                {labels.parcoursIntro}
              </p>
            </FadeIn>

            <FadeInStagger className="grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-3">
              {secteur.parcours.map((step, index) => (
                <FadeInItem key={step.title} className="flex">
                  <article className="flex w-full flex-col bg-cream-soft p-7 lg:p-9">
                    <span
                      aria-hidden
                      className="font-display font-light text-gold-ink tabular-nums leading-none tracking-[-0.02em]"
                      style={{ fontSize: "clamp(2rem, 2.5vw + 1rem, 3rem)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="mt-6 font-display font-light text-ink tracking-[-0.02em] leading-[1.2]"
                      style={{ fontSize: "var(--text-h3)" }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-4 font-sans text-ink-soft leading-[1.7] text-[length:var(--text-small)]">
                      {step.description}
                    </p>
                    {step.service && (
                      <Link
                        href={`/${lang}/services/${step.service.slug}`}
                        className="group mt-auto pt-6 inline-flex items-center gap-2 min-h-11 font-sans font-medium text-brand text-[length:var(--text-small)] tracking-tight hover:text-gold-deep transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                      >
                        <span aria-hidden className="w-5 h-px bg-gold shrink-0 group-hover:w-7 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
                        {step.service.label}
                        <span aria-hidden className={arrowGlyph}>→</span>
                      </Link>
                    )}
                  </article>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </section>
      )}

      {/* ── 3. Études de cas du secteur ──────────────────────────── */}
      {projets.length > 0 && (
        <section className="bg-cream-deep">
          <div className={`${SECTION_PX} py-20 lg:py-28`}>
            <FadeIn className="mb-10 lg:mb-14">
              <span className={eyebrowCls}>
                <span aria-hidden className="w-8 h-px bg-gold-ink" />
                {labels.projetsLabel}
              </span>
            </FadeIn>
            <FadeInStagger className="border-t border-line">
              {projets.map((p) => (
                <FadeInItem key={p.slug}>
                  <Link
                    href={`/${lang}/projets/${p.slug}`}
                    className="group grid gap-x-8 gap-y-3 py-8 lg:py-10 border-b border-line lg:grid-cols-12"
                  >
                    <div className="lg:col-span-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 lg:block">
                      <span className="font-display font-light text-ink tabular-nums tracking-[-0.02em]" style={{ fontSize: "var(--text-h3)" }} dir="ltr">
                        {p.annee}
                      </span>
                      <span className="block font-sans uppercase tracking-[0.14em] text-gold-ink lg:mt-3" style={{ fontSize: "var(--text-caption)" }}>
                        {p.mission.join(" · ")}
                      </span>
                    </div>
                    <div className="lg:col-span-9">
                      <h3
                        className="font-display font-light text-ink tracking-[-0.02em] leading-[1.2] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                        style={{ fontSize: "var(--text-h3)" }}
                      >
                        {p.title}
                      </h3>
                      <p className="mt-3 max-w-2xl font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                        {p.excerpt}
                      </p>
                      <span className={`${arrowCls} mt-4`}>
                        <span aria-hidden className="w-5 h-px bg-gold shrink-0 group-hover:w-7 transition-[width] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]" />
                        {labels.readProjet}
                        <span aria-hidden className={arrowGlyph}>→</span>
                      </span>
                    </div>
                  </Link>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </section>
      )}
    </>
  );
}
