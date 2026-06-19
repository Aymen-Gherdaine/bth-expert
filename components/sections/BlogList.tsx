import Link from "next/link";
import type { ContentPage } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { FadeInStagger, FadeInItem, FadeIn } from "@/components/motion/FadeIn";

const DATE_LOCALE: Record<string, string> = { fr: "fr-DZ", ar: "ar-DZ", en: "en-US" };

function formatDate(lang: string, date: string | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(DATE_LOCALE[lang] ?? "fr-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

interface BlogListProps {
  lang: Locale;
  posts: ContentPage[];
  startIndex: number;
  empty: string;
  readMore: string;
}

export function BlogList({ lang, posts, startIndex, empty, readMore }: BlogListProps) {
  if (posts.length === 0) {
    return (
      <p className="border-t border-line pt-12 font-sans text-ink-soft text-[length:var(--text-body)] leading-[1.75]">
        {empty}
      </p>
    );
  }

  return (
    <FadeInStagger className="border-t border-line">
      {posts.map((post, index) => (
        <FadeInItem key={post.slug}>
          <Link href={`/${lang}/blog/${post.slug}`} className="group block border-b border-line">
            <div className="py-10 lg:py-14 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
              <div className="lg:col-span-2 mb-5 lg:mb-0">
                <span
                  aria-hidden
                  className="font-display font-light text-line tabular-nums leading-none tracking-[-0.02em] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-gold"
                  style={{ fontSize: "clamp(2.75rem, 4vw + 1rem, 4.5rem)" }}
                >
                  {String(startIndex + index + 1).padStart(2, "0")}
                </span>
              </div>

              <div className="lg:col-span-7 mb-4 lg:mb-0">
                <time
                  dateTime={post.frontmatter.date}
                  className="block font-sans uppercase tracking-[0.14em] text-muted text-[length:var(--text-caption)] mb-3"
                >
                  {formatDate(lang, post.frontmatter.date)}
                </time>
                <h2
                  className="font-display font-light text-ink tracking-[-0.02em] leading-[1.18] mb-3 transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {post.frontmatter.title}
                </h2>
                <p className="font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)] max-w-2xl">
                  {post.frontmatter.description}
                </p>
              </div>

              <div className="lg:col-span-3 flex items-center lg:justify-end">
                <span className="inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] uppercase tracking-widest text-gold">
                  {readMore}
                  <span
                    aria-hidden
                    className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
                  >
                    →
                  </span>
                </span>
              </div>
            </div>
          </Link>
        </FadeInItem>
      ))}
    </FadeInStagger>
  );
}

interface BlogPaginationProps {
  lang: Locale;
  page: number;
  totalPages: number;
  previousLabel: string;
  nextLabel: string;
  pageLabel: string;
}

export function BlogPagination({
  lang,
  page,
  totalPages,
  previousLabel,
  nextLabel,
  pageLabel,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const hrefForPage = (p: number) => (p <= 1 ? `/${lang}/blog` : `/${lang}/blog/page/${p}`);

  return (
    <FadeIn>
      <nav
        aria-label="Pagination"
        className="flex items-center justify-between pt-12 border-t border-line mt-4"
      >
        {page > 1 ? (
          <Link
            href={hrefForPage(page - 1)}
            className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] uppercase tracking-widest text-muted hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
          >
            <span
              aria-hidden
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:-scale-x-100"
            >
              ←
            </span>
            {previousLabel}
          </Link>
        ) : (
          <span />
        )}

        <span className="font-sans text-[length:var(--text-small)] tracking-widest text-muted">
          {pageLabel.replace("{current}", String(page)).replace("{total}", String(totalPages))}
        </span>

        {page < totalPages ? (
          <Link
            href={hrefForPage(page + 1)}
            className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] uppercase tracking-widest text-muted hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
          >
            {nextLabel}
            <span
              aria-hidden
              className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:-scale-x-100"
            >
              →
            </span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </FadeIn>
  );
}
