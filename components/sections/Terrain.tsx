const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

/**
 * Decorative backdrop layers for a dark band: the bespoke topographic artwork
 * (CSS background, generated in /public/generated) plus a directional scrim
 * that keeps cream text legible over it. Pure presentational — safe to compose
 * into server or client sections. Place as the first children of a
 * `relative isolate overflow-hidden bg-brand-deep` section, and give the
 * content wrapper `relative z-10`.
 */
export function TerrainBackdrop({ src }: { src: string }) {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${src}')` }}
      />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(105deg, rgb(8 16 10 / 0.86) 0%, rgb(8 16 10 / 0.5) 55%, rgb(8 16 10 / 0.28) 100%)",
        }}
      />
    </>
  );
}

/**
 * Full-bleed cinematic plate: the topographic artwork as a standalone image
 * band, optionally signed with a gold filet + eyebrow. Used to give the index
 * pages (services / secteurs / projets / à-propos) a real image moment without
 * any new copy or photographic asset.
 */
export function TerrainCover({ src, eyebrow }: { src: string; eyebrow?: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep flex items-end min-h-[40vh] lg:min-h-[48vh]">
      <TerrainBackdrop src={src} />
      {eyebrow ? (
        <div className={`relative z-10 w-full ${PADX} pb-10 lg:pb-14`}>
          <span aria-hidden className="block w-14 h-px bg-gold mb-6" />
          <span className="font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)]">
            {eyebrow}
          </span>
        </div>
      ) : null}
    </section>
  );
}
