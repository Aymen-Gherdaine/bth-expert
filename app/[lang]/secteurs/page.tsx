import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";

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

  const jsonLd = schemaLocalBusiness();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Container>
        <div className="pt-32 pb-24 md:pt-40 md:pb-32 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <p className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-8">
              {s.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[var(--text-h1)] text-ink mb-8">
              {s.hero.heading}
            </h1>
            <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {s.hero.subheading}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Sector index ──────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="divide-y divide-line">
            {s.list.map((item, index) => (
              <Link
                key={item.slug}
                href={`/${lang}/secteurs/${item.slug}`}
                className="block"
              >
                <div className="py-10 lg:grid lg:grid-cols-12 lg:gap-8 group">
                  <div className="lg:col-span-1 mb-2 lg:mb-0">
                    <span className="font-display text-[var(--text-caption)] text-muted tracking-widest">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="lg:col-span-4 mb-3 lg:mb-0">
                    <h2 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink group-hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)]">
                      {item.title}
                    </h2>
                  </div>
                  <div className="lg:col-span-6 lg:col-start-6">
                    <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
                      {item.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
}
