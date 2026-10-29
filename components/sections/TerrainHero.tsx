import { SECTION_PX } from "@/components/layout/Container";
import { RevealText } from "@/components/animations/RevealText";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { TerrainBackdrop } from "@/components/sections/Terrain";

interface TerrainHeroProps {
  src: string;
  eyebrow: string;
  heading: string;
  subheading: string;
  /**
   * What the page contains, as a numbered rail (service names, sector names,
   * milestones…). Real content from the dictionary, never decoration: it is
   * what justifies the dark band's height instead of empty artwork.
   */
  index?: readonly string[];
}

/**
 * Dark editorial opener for index pages. The band is as tall as its content
 * (title block + index rail), not a viewport-high void with the title pushed
 * to the bottom: the topographic artwork reads as texture behind text.
 */
export function TerrainHero({ src, eyebrow, heading, subheading, index }: TerrainHeroProps) {
  const hasIndex = index !== undefined && index.length > 0;

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
      <div className={`relative z-10 ${SECTION_PX} pt-20 sm:pt-24 lg:pt-32 pb-14 sm:pb-16 lg:pb-20`}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className={hasIndex ? "lg:col-span-7 xl:col-span-7" : "lg:col-span-9 xl:col-span-8"}>
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

          {hasIndex && (
            <FadeInStagger className="mt-12 lg:mt-0 lg:col-span-4 lg:col-start-9 lg:self-end">
              <ol className="border-t border-cream/15">
                {index.map((item, i) => (
                  <li key={item} className="border-b border-cream/15">
                    <FadeInItem>
                      <div className="flex items-baseline gap-5 py-3.5 lg:py-4">
                        <span
                          className="font-display text-gold tabular-nums shrink-0"
                          style={{ fontSize: "var(--text-small)" }}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="font-display font-light text-cream tracking-[-0.01em] leading-[1.25]"
                          style={{ fontSize: "var(--text-h3)" }}
                        >
                          {item}
                        </span>
                      </div>
                    </FadeInItem>
                  </li>
                ))}
              </ol>
            </FadeInStagger>
          )}
        </div>
      </div>
    </section>
  );
}
