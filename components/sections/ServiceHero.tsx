import { SECTION_PX } from "@/components/layout/Container";
import { RevealText } from "@/components/animations/RevealText";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

interface MetaItem {
  label: string;
  value: string;
}

interface ServiceHeroProps {
  eyebrow: string;
  heading: string;
  subheading: string;
  meta?: MetaItem[];
}

/**
 * Editorial light service hero (option B): monumental ink headline with a
 * gold filet + eyebrow, and a right-hand meta rail that differentiates each
 * service (cadre, livrable, dépôt…). The dark cinematic hero stays exclusive
 * to the landing; service pages open warm and structured, image lives below.
 */
export function ServiceHero({ eyebrow, heading, subheading, meta }: ServiceHeroProps) {
  return (
    <section className="bg-cream-soft">
      <div className={`${SECTION_PX} pt-20 lg:pt-28 pb-16 lg:pb-24`}>
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-8">
            <span aria-hidden className="block w-14 h-px bg-gold mb-10" />
            <RevealText
              className="block font-sans uppercase tracking-[0.2em] text-gold text-[length:var(--text-caption)] mb-7"
              delay={0.05}
            >
              {eyebrow}
            </RevealText>
            <RevealText
              as="h1"
              className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(2.25rem, 3.4vw + 1rem, 4.5rem)" }}
              delay={0.15}
            >
              {heading}
            </RevealText>
            <RevealText
              className="block mt-8 max-w-2xl font-sans text-ink-soft text-[length:var(--text-body)] leading-[1.75]"
              delay={0.4}
            >
              {subheading}
            </RevealText>
          </div>

          {meta && meta.length > 0 && (
            <FadeInStagger className="mt-14 lg:mt-0 lg:col-span-3 lg:col-start-10 lg:border-s lg:border-line lg:ps-10 flex flex-col justify-center gap-8">
              {meta.map((m) => (
                <FadeInItem key={m.label}>
                  <div
                    className="font-sans uppercase tracking-[0.14em] text-muted mb-2"
                    style={{ fontSize: "var(--text-caption)" }}
                  >
                    {m.label}
                  </div>
                  <div
                    className="font-display font-light text-ink tracking-[-0.01em] leading-[1.2]"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {m.value}
                  </div>
                </FadeInItem>
              ))}
            </FadeInStagger>
          )}
        </div>
      </div>
    </section>
  );
}
