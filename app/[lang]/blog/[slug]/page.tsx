import { SECTION_PX } from "@/components/layout/Container";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, validateLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaArticle, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";
import { getContent, listContent } from "@/lib/content";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { Faq } from "@/components/sections/Faq";
import { FadeIn } from "@/components/motion/FadeIn";

interface BlogFaqItem {
  q: string;
  a: string;
}

const FAQ_HEADING: Record<string, string> = {
  fr: "Questions fréquentes",
  ar: "الأسئلة الشائعة",
  en: "Frequently asked questions",
};

function estimateReadTime(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string, lang: string): string {
  try {
    const date = new Date(`${dateStr}T00:00:00`);
    const locale = lang === "ar" ? "ar-DZ" : lang === "en" ? "en-US" : "fr-FR";
    return date.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export async function generateStaticParams() {
  const params: { lang: string; slug: string }[] = [];
  for (const lang of locales) {
    const posts = await listContent(lang, "blog");
    for (const post of posts) {
      params.push({ lang, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const post = await getContent(lang, "blog", slug);
  if (!post) return {};

  const metadata = buildMetadata({
    lang,
    path: `/blog/${slug}`,
    title: post.frontmatter.title,
    description: post.frontmatter.description,
  });

  const availableLocales = (
    await Promise.all(locales.map(async (l) => ((await getContent(l, "blog", slug)) ? l : null)))
  ).filter((l): l is (typeof locales)[number] => l !== null);

  const languages: Record<string, string> = {};
  for (const l of availableLocales) {
    languages[l] = `https://bthexpert.com/${l}/blog/${slug}`;
  }
  languages["x-default"] = `https://bthexpert.com/fr/blog/${slug}`;

  return { ...metadata, alternates: { ...metadata.alternates, languages } };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const b = dict.blog;
  const post = await getContent(lang, "blog", slug);
  if (!post) notFound();

  const url = `https://bthexpert.com/${lang}/blog/${slug}`;
  const jsonLd = schemaArticle({
    title: post.frontmatter.title,
    url,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date ?? "",
    authorName: post.frontmatter.author,
  });
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: b.hero.heading, url: `https://bthexpert.com/${lang}/blog` },
    { name: post.frontmatter.title, url },
  ]);

  const faq = post.frontmatter.faq as BlogFaqItem[] | undefined;
  const jsonLdFaq =
    faq && faq.length > 0
      ? schemaFAQ(faq.map((item) => ({ question: item.q, answer: item.a })))
      : null;

  const readTime = estimateReadTime(post.html);
  const formattedDate = post.frontmatter.date
    ? formatDate(post.frontmatter.date, lang)
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {jsonLdFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Article header — editorial, Medium/Anthropic style ── */}
      <section className="bg-cream-soft border-b border-line">
        <div className={`${SECTION_PX} pt-20 lg:pt-28 pb-14 lg:pb-20`}>
          <div className="max-w-[var(--container-prose)] mx-auto">

            {/* Back link + category */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-10">
              <Link
                href={`/${lang}/blog`}
                className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-caption)] uppercase tracking-[0.15em] text-muted hover:text-brand transition-colors duration-[var(--duration-base)]"
              >
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-[var(--duration-base)] ltr:group-hover:-translate-x-0.5 rtl:group-hover:translate-x-0.5 rtl:-scale-x-100"
                >
                  ←
                </span>
                {b.backLabel}
              </Link>
              <span aria-hidden className="w-px h-3 bg-line" />
              <span className="font-sans text-[length:var(--text-caption)] uppercase tracking-[0.18em] text-gold">
                {b.hero.eyebrow}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: "clamp(1.875rem, 3.5vw + 0.75rem, 3.25rem)" }}
            >
              {post.frontmatter.title}
            </h1>

            {/* Meta: date · reading time */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-8 font-sans text-[length:var(--text-small)] text-muted">
              {formattedDate && (
                <>
                  <time dateTime={post.frontmatter.date ?? ""}>{formattedDate}</time>
                  <span aria-hidden>·</span>
                </>
              )}
              <span>
                {readTime} {b.readingTimeLabel}
              </span>
            </div>

            {/* Lead description */}
            {post.frontmatter.description && (
              <p
                className="mt-8 font-sans text-ink-soft leading-[1.75]"
                style={{ fontSize: "clamp(1.0625rem, 0.5vw + 0.95rem, 1.125rem)" }}
              >
                {post.frontmatter.description}
              </p>
            )}

            {/* Divider */}
            <div className="mt-12 h-px bg-line" />
          </div>
        </div>
      </section>

      <ArticleBody html={post.html} />

      {faq && faq.length > 0 && (
        <Faq heading={FAQ_HEADING[lang] ?? FAQ_HEADING.fr} items={faq} />
      )}

      {/* ── Back to blog ── */}
      <section className="bg-cream-soft border-t border-line">
        <div className={`${SECTION_PX} py-14 lg:py-18`}>
          <FadeIn>
            <Link
              href={`/${lang}/blog`}
              className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] uppercase tracking-widest text-muted hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              <span
                aria-hidden
                className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] ltr:group-hover:-translate-x-1 rtl:group-hover:translate-x-1 rtl:-scale-x-100"
              >
                ←
              </span>
              {b.backLabel}
            </Link>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
