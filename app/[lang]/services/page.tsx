import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
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
    path: "/services",
    title: dict.services.meta.title,
    description: dict.services.meta.description,
  });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const s = dict.services;
  const items = dict.home.services.items;

  const serviceLinks: Record<string, string> = {
    EIE: `/${lang}/services/etude-impact-environnemental`,
    EIA: `/${lang}/services/etude-impact-environnemental`,
  };

  return (
    <>
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

      {/* ── Service list ──────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="divide-y divide-line">
            {items.map((item, index) => {
              const href = serviceLinks[item.abbr] ?? null;
              const content = (
                <div className="py-10 lg:grid lg:grid-cols-12 lg:gap-8 group">
                  <div className="lg:col-span-1 mb-2 lg:mb-0">
                    <span className="font-display text-[var(--text-caption)] text-muted tracking-widest">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="lg:col-span-4 mb-3 lg:mb-0">
                    <span className="text-[var(--text-caption)] uppercase tracking-widest text-muted block mb-1">
                      {item.abbr}
                    </span>
                    <h2 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink group-hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)]">
                      {item.title}
                    </h2>
                  </div>
                  <div className="lg:col-span-6 lg:col-start-6">
                    <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
                      {item.description}
                    </p>
                  </div>
                </div>
              );

              return href ? (
                <Link key={item.abbr} href={href} className="block">
                  {content}
                </Link>
              ) : (
                <div key={item.abbr}>{content}</div>
              );
            })}
          </div>
        </Section>
      </Container>
    </>
  );
}
