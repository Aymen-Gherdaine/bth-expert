import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaBreadcrumb } from "@/lib/schema";
import { listContentByDate } from "@/lib/content";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

const DATE_LOCALE: Record<string, string> = { fr: "fr-DZ", ar: "ar-DZ", en: "en-US" };

function formatDate(lang: string, date: string | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat(DATE_LOCALE[lang] ?? "fr-DZ", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  return buildMetadata({
    lang,
    path: "/blog",
    title: dict.blog.meta.title,
    description: dict.blog.meta.description,
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const b = dict.blog;
  const posts = await listContentByDate(lang, "blog");

  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: b.hero.heading, url: `https://bthexpert.com/${lang}/blog` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      <ServiceHero eyebrow={b.hero.eyebrow} heading={b.hero.heading} subheading={b.hero.subheading} />

      <section className="bg-cream-soft">
        <div className={`${PADX} pb-24 lg:pb-32`}>
          {posts.length === 0 ? (
            <p className="border-t border-line pt-12 font-sans text-ink-soft text-[length:var(--text-body)] leading-[1.75]">
              {b.empty}
            </p>
          ) : (
            <FadeInStagger className="border-t border-line">
              {posts.map((post, index) => (
                <FadeInItem key={post.slug}>
                  <Link
                    href={`/${lang}/blog/${post.slug}`}
                    className="group block border-b border-line"
                  >
                    <div className="py-10 lg:py-14 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
                      <div className="lg:col-span-2 mb-5 lg:mb-0">
                        <span
                          aria-hidden
                          className="font-display font-light text-line tabular-nums leading-none tracking-[-0.02em] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-gold"
                          style={{ fontSize: "clamp(2.75rem, 4vw + 1rem, 4.5rem)" }}
                        >
                          {String(index + 1).padStart(2, "0")}
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
                          {b.readMore}
                          <span
                            aria-hidden
                            className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:translate-x-1"
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
          )}
        </div>
      </section>
    </>
  );
}
