import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, validateLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaArticle, schemaBreadcrumb, schemaFAQ } from "@/lib/schema";
import { getContent, listContent } from "@/lib/content";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { Faq } from "@/components/sections/Faq";
import { FadeIn } from "@/components/motion/FadeIn";
import { TerrainBackdrop } from "@/components/sections/Terrain";

interface BlogFaqItem {
  q: string;
  a: string;
}

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

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

  // L'article n'existe pas forcément dans les autres langues — ne déclarer
  // en hreflang que les locales où le contenu existe réellement.
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

      <ServiceHero
        eyebrow={b.hero.eyebrow}
        heading={post.frontmatter.title}
        subheading={post.frontmatter.description}
      />

      {post.frontmatter.image && (
        <section className="relative isolate overflow-hidden bg-brand-deep h-[clamp(14rem,28vw,22rem)]">
          <TerrainBackdrop src={post.frontmatter.image} />
        </section>
      )}

      <ArticleBody html={post.html} />

      {faq && faq.length > 0 && <Faq heading="Questions fréquentes" items={faq} />}

      <section className="bg-cream-soft">
        <div className={`${PADX} pb-20 lg:pb-28`}>
          <FadeIn>
            <Link
              href={`/${lang}/blog`}
              className="group inline-flex items-center gap-2 font-sans text-[length:var(--text-small)] uppercase tracking-widest text-muted hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              <span
                aria-hidden
                className="transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:-translate-x-1"
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
