import { SECTION_PX } from "@/components/layout/Container";
import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaBreadcrumb } from "@/lib/schema";
import { listContentByDate } from "@/lib/content";
import { paginate } from "@/lib/blog";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { BlogList, BlogPagination } from "@/components/sections/BlogList";

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
  const allPosts = await listContentByDate(lang, "blog");
  const { items: posts, page, totalPages } = paginate(allPosts, 1);

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
        <div className={`${SECTION_PX} pb-24 lg:pb-32`}>
          <BlogList lang={lang} posts={posts} startIndex={0} empty={b.empty} readMore={b.readMore} />
          <BlogPagination
            lang={lang}
            page={page}
            totalPages={totalPages}
            previousLabel={b.pagination.previous}
            nextLabel={b.pagination.next}
            pageLabel={b.pagination.pageLabel}
          />
        </div>
      </section>
    </>
  );
}
