import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, validateLocale, locales } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaBreadcrumb } from "@/lib/schema";
import { listContentByDate } from "@/lib/content";
import { paginate, BLOG_PAGE_SIZE } from "@/lib/blog";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { BlogList, BlogPagination } from "@/components/sections/BlogList";

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

export async function generateStaticParams() {
  const params: { lang: string; page: string }[] = [];
  for (const lang of locales) {
    const posts = await listContentByDate(lang, "blog");
    const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_PAGE_SIZE));
    for (let page = 2; page <= totalPages; page++) {
      params.push({ lang, page: String(page) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, page: rawPage } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  return buildMetadata({
    lang,
    path: `/blog/page/${rawPage}`,
    title: dict.blog.meta.title,
    description: dict.blog.meta.description,
  });
}

export default async function BlogPagedPage({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}) {
  const { lang: rawLang, page: rawPage } = await params;
  const lang = validateLocale(rawLang);
  const requestedPage = Number(rawPage);
  if (!Number.isInteger(requestedPage) || requestedPage < 2) notFound();

  const dict = await getDictionary(lang);
  const b = dict.blog;
  const allPosts = await listContentByDate(lang, "blog");
  const { items: posts, page, totalPages } = paginate(allPosts, requestedPage);
  if (page !== requestedPage) notFound();

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
          <BlogList
            lang={lang}
            posts={posts}
            startIndex={(page - 1) * BLOG_PAGE_SIZE}
            empty={b.empty}
            readMore={b.readMore}
          />
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
