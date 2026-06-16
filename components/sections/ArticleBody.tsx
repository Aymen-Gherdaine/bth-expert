import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

interface ArticleBodyProps {
  html: string;
}

/**
 * Renders markdown-derived HTML for a blog article. No typography plugin
 * is installed, so the body's child elements are styled via Tailwind
 * arbitrary child selectors against the prose design tokens.
 */
export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <section className="bg-cream-soft">
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 pb-20 lg:pb-28">
        <Container variant="prose" className="px-0">
          <FadeIn>
            <div
              className="font-sans text-ink-soft [&>p]:text-[length:var(--text-body-prose)] [&>p]:leading-[var(--leading-loose)] [&>p]:mb-7
                [&>h2]:font-display [&>h2]:font-light [&>h2]:text-ink [&>h2]:tracking-[-0.02em] [&>h2]:leading-[1.2] [&>h2]:mt-14 [&>h2]:mb-6 [&>h2]:text-[length:var(--text-h3)]
                [&>h3]:font-display [&>h3]:font-light [&>h3]:text-ink [&>h3]:tracking-[-0.01em] [&>h3]:leading-[1.25] [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:text-[length:var(--text-body)]
                [&>ul]:list-disc [&>ul]:ps-6 [&>ul]:space-y-2.5 [&>ul]:mb-7 [&>ul]:text-[length:var(--text-body-prose)] [&>ul]:leading-[var(--leading-relaxed)]
                [&>ol]:list-decimal [&>ol]:ps-6 [&>ol]:space-y-2.5 [&>ol]:mb-7 [&>ol]:text-[length:var(--text-body-prose)] [&>ol]:leading-[var(--leading-relaxed)]
                [&_strong]:text-ink [&_strong]:font-medium
                [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gold-deep"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </FadeIn>
        </Container>
      </div>
    </section>
  );
}
