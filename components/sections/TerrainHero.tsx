import { RevealText } from "@/components/animations/RevealText";
import { TerrainBackdrop } from "@/components/sections/Terrain";

interface TerrainHeroProps {
  src: string;
  eyebrow: string;
  heading: string;
  subheading: string;
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export function TerrainHero({ src, eyebrow, heading, subheading }: TerrainHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep">
      <TerrainBackdrop src={src} />
      <div
        aria-hidden
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(0deg, rgb(8 16 10 / 0.72) 0%, rgb(8 16 10 / 0.12) 55%, transparent 100%)",
        }}
      />
      <div
        className={`relative z-10 ${PADX} flex flex-col justify-end min-h-[80dvh] sm:min-h-[90dvh] lg:min-h-[100dvh] pt-20 lg:pt-28 pb-16 sm:pb-16 lg:pb-20`}
      >
        <div className="lg:grid lg:grid-cols-12">
          <div className="lg:col-span-9 xl:col-span-8">
            <span aria-hidden className="block w-14 h-px bg-gold mb-8" />
            <RevealText
              className="block font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-7"
              delay={0.05}
            >
              {eyebrow}
            </RevealText>
            <RevealText
              as="h1"
              className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(2.25rem, 3.4vw + 1rem, 4.5rem)" }}
              delay={0.15}
            >
              {heading}
            </RevealText>
            <RevealText
              className="block mt-6 sm:mt-8 max-w-2xl font-sans text-cream/75 text-[length:var(--text-body)] leading-[1.75]"
              delay={0.4}
            >
              {subheading}
            </RevealText>
          </div>
        </div>
      </div>
    </section>
  );
}
