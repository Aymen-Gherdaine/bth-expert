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
