import { SECTION_PX } from "@/components/layout/Container";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface FaqItem {
  q: string;
  a: string;
}

interface FaqProps {
  heading: string;
  items: FaqItem[];
}

/**
 * Questions set open, in a column: the question in display type on the left,
 * the answer in text on the right, one hairline per pair.
 *
 * No accordion on purpose. Every answer is visible to the reader and to the
 * crawler (the FAQPage JSON-LD says the same thing the page shows), nothing
 * is hidden behind a plus sign, and the section needs no client JavaScript.
 */
export function Faq({ heading, items }: FaqProps) {
  return (
    <section className="bg-cream-soft">
      <div className={`${SECTION_PX} py-20 lg:py-28`}>
        <FadeIn>
          <SectionLabel>{heading}</SectionLabel>
        </FadeIn>

        <FadeInStagger className="mt-10 lg:mt-14 border-t border-line">
          {items.map((item, index) => (
            <FadeInItem key={item.q}>
              <div className="border-b border-line py-8 lg:py-10 lg:grid lg:grid-cols-12 lg:gap-12">
                <div className="lg:col-span-5 flex items-baseline gap-4">
                  <span
                    aria-hidden
                    className="font-display text-gold-ink tabular-nums text-[length:var(--text-small)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-display font-light text-ink tracking-[-0.01em] leading-[1.3]"
                    style={{ fontSize: "var(--text-h3)" }}
                  >
                    {item.q}
                  </h3>
                </div>
                <p className="mt-4 lg:mt-0 lg:col-span-7 max-w-2xl font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                  {item.a}
                </p>
              </div>
            </FadeInItem>
          ))}
        </FadeInStagger>
      </div>
    </section>
  );
}
