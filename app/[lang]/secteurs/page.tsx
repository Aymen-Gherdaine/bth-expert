import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness, schemaBreadcrumb } from "@/lib/schema";
import { TerrainHero } from "@/components/sections/TerrainHero";
import { FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

const PADX = "px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16";

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
    path: "/secteurs",
    title: dict.secteurs.meta.title,
    description: dict.secteurs.meta.description,
  });
}

export default async function SecteursPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const s = dict.secteurs;

  const jsonLd = schemaLocalBusiness(lang);
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.secteurs, url: `https://bthexpert.com/${lang}/secteurs` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Hero — shared editorial light hero ───────────────── */}
      <TerrainHero
        src="/generated/section-secteurs.svg"
        eyebrow={s.hero.eyebrow}
        heading={s.hero.heading}
        subheading={s.hero.subheading}
      />

      {/* ── Sector index — animated editorial rhythm ─────────── */}
      <section className="bg-cream-soft">
        <div className={`${PADX} pb-24 lg:pb-32`}>
          <FadeInStagger className="border-t border-line">
            {s.list.map((item, index) => (
              <FadeInItem key={item.slug}>
                <Link
                  href={`/${lang}/secteurs/${item.slug}`}
                  className="group block border-b border-line"
                >
                  <div className="py-10 lg:py-14 lg:grid lg:grid-cols-12 lg:gap-8 xl:gap-12">
                    {/* Index numeral */}
                    <div className="lg:col-span-2 mb-5 lg:mb-0">
                      <span
                        aria-hidden
                        className="font-display font-light text-line tabular-nums leading-none tracking-[-0.02em] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-gold"
                        style={{ fontSize: "clamp(2.75rem, 4vw + 1rem, 4.5rem)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="lg:col-span-4 mb-4 lg:mb-0">
                      <h2
                        className="font-display font-light text-ink tracking-[-0.02em] leading-[1.12] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand"
                        style={{ fontSize: "var(--text-h2)" }}
                      >
                        {item.title}
                      </h2>
                    </div>

                    {/* Tagline + gold filet that grows on hover */}
                    <div className="lg:col-span-5 lg:col-start-7 flex flex-col justify-center">
                      <p className="font-sans text-ink-soft leading-[1.75] text-[length:var(--text-body)]">
                        {item.tagline}
                      </p>
                      <span
                        aria-hidden
                        className="mt-6 h-px w-10 bg-gold origin-left transition-transform duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:scale-x-[2.4]"
                      />
                    </div>
                  </div>
                </Link>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </div>
      </section>
    </>
  );
}
