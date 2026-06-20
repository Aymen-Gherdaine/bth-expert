import { SECTION_PX } from "@/components/layout/Container";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

interface ArticleBodyProps {
  html: string;
}

export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <section className="bg-cream-soft">
      <div className={`${SECTION_PX} py-14 lg:py-20`}>
        <Container variant="prose" className="px-0">
          <FadeIn>
            <div
              className={[
                "font-sans text-ink-soft",
                /* Paragraphs */
                "[&>p]:text-[length:var(--text-body-prose)] [&>p]:leading-[var(--leading-loose)] [&>p]:mb-8",
                /* H2 — display with gold left accent */
                "[&>h2]:font-display [&>h2]:font-light [&>h2]:text-ink [&>h2]:tracking-[-0.02em] [&>h2]:leading-[1.2]",
                "[&>h2]:mt-16 [&>h2]:mb-6 [&>h2]:text-[length:var(--text-h2)]",
                "[&>h2]:border-s-[3px] [&>h2]:border-gold [&>h2]:ps-5",
                /* H3 */
                "[&>h3]:font-display [&>h3]:font-medium [&>h3]:text-ink [&>h3]:tracking-[-0.01em] [&>h3]:leading-[1.25]",
                "[&>h3]:mt-12 [&>h3]:mb-4 [&>h3]:text-[length:var(--text-h3)]",
                /* Lists */
                "[&>ul]:list-disc [&>ul]:ps-6 [&>ul]:space-y-3 [&>ul]:mb-8",
                "[&>ul]:text-[length:var(--text-body-prose)] [&>ul]:leading-[var(--leading-relaxed)]",
                "[&>ol]:list-decimal [&>ol]:ps-6 [&>ol]:space-y-3 [&>ol]:mb-8",
                "[&>ol]:text-[length:var(--text-body-prose)] [&>ol]:leading-[var(--leading-relaxed)]",
                /* Blockquote */
                "[&>blockquote]:border-s-4 [&>blockquote]:border-gold [&>blockquote]:ps-6 [&>blockquote]:py-1",
                "[&>blockquote]:my-10 [&>blockquote]:text-ink [&>blockquote]:italic",
                "[&>blockquote]:text-[length:var(--text-body-prose)] [&>blockquote]:leading-[var(--leading-relaxed)]",
                /* Inline elements */
                "[&_strong]:text-ink [&_strong]:font-medium",
                "[&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold-deep",
                "[&_code]:font-mono [&_code]:text-[0.875em] [&_code]:bg-line/60 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded",
              ].join(" ")}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </FadeIn>
        </Container>
      </div>
    </section>
  );
}
