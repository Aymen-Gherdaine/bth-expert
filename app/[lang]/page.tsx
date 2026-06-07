import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

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
    path: "/",
    title: dict.metadata.homeTitle,
    description: dict.metadata.homeDescription,
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const h = dict.home;

  const jsonLd = schemaLocalBusiness();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Container>
        <div className="pt-32 pb-40 md:pt-40 md:pb-56 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-10">
            <p className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-8">
              {h.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[var(--text-display)] text-ink mb-8">
              {h.hero.headlinePart1}{" "}
              <em className="italic">{h.hero.headlineEmphasis}</em>
              <br />
              {h.hero.headlinePart2}
            </h1>
            <p className="text-[var(--text-body)] text-ink-soft leading-[1.7] max-w-xl mb-12">
              {h.hero.subheading}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button href={`/${lang}/contact`}>{h.hero.cta}</Button>
              <Button href={`/${lang}/services`} variant="secondary">
                {h.hero.ctaSecondary}
              </Button>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <div className="border-t border-b border-line">
        <Container>
          <div className="py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {h.stats.items.map((item) => (
              <div key={item.label}>
                <div
                  className={`font-display text-[var(--text-h2)] font-medium tracking-[-0.02em] leading-none mb-2 ${
                    item.highlight ? "text-gold" : "text-ink"
                  }`}
                >
                  {item.value}
                </div>
                <div className="text-[var(--text-caption)] uppercase tracking-widest text-muted">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Services ─────────────────────────────────────────── */}
      <Container>
        <Section number={h.services.sectionNumber} eyebrow={h.services.eyebrow}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 mb-16">
            <h2 className="font-display text-[var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink lg:col-span-7">
              {h.services.heading}
            </h2>
          </div>

          <div className="divide-y divide-line">
            {h.services.items.map((item) => (
              <div
                key={item.abbr}
                className="py-8 lg:grid lg:grid-cols-12 lg:gap-8 group"
              >
                <div className="lg:col-span-1 mb-2 lg:mb-0">
                  <span className="text-[var(--text-caption)] uppercase tracking-widest text-muted">
                    {item.abbr}
                  </span>
                </div>
                <div className="lg:col-span-4 mb-3 lg:mb-0">
                  <h3 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink">
                    {item.title}
                  </h3>
                </div>
                <div className="lg:col-span-5 mb-4 lg:mb-0">
                  <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
                    {item.description}
                  </p>
                </div>
                <div className="lg:col-span-2 lg:text-right">
                  <Link
                    href={`/${lang}/services`}
                    className="relative text-[var(--text-small)] text-muted hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-px after:bg-current after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)]"
                  >
                    {h.services.itemCta} →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button href={`/${lang}/services`} variant="secondary">
              {h.services.cta}
            </Button>
          </div>
        </Section>
      </Container>

      {/* ── Équipe ───────────────────────────────────────────── */}
      <Container>
        <Section number={h.equipe.sectionNumber} eyebrow={h.equipe.eyebrow}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6 mb-8 lg:mb-0">
              <h2 className="font-display text-[var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-8">
                {h.equipe.heading}
              </h2>
              <Button href={`/${lang}/equipe`} variant="secondary">
                {h.equipe.cta}
              </Button>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
                {h.equipe.description}
              </p>
            </div>
          </div>
        </Section>
      </Container>

      {/* ── CTA Contact ──────────────────────────────────────── */}
      <div className="bg-brand">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8 mb-10 lg:mb-0">
                <p className="text-[var(--text-caption)] uppercase tracking-widest text-[var(--color-on-brand-faint)] mb-6">
                  {h.contact.eyebrow}
                </p>
                <h2 className="font-display text-[var(--text-h1)] font-medium tracking-[-0.02em] leading-[1.1] text-cream mb-6">
                  {h.contact.heading}
                </h2>
                <p className="text-[var(--text-body)] text-[var(--color-on-brand-muted)] leading-[1.7] max-w-lg mb-10">
                  {h.contact.description}
                </p>
                <Button href={`/${lang}/contact`}>{h.contact.cta}</Button>
              </div>
              <div className="lg:col-span-4 flex flex-col justify-center gap-6 text-[var(--color-on-brand-muted)] text-[var(--text-small)]">
                <a
                  href={`tel:${h.contact.phone.replace(/\s/g, "")}`}
                  className="hover:text-cream transition-colors duration-300 ease-[var(--ease-out-expo)]"
                >
                  {h.contact.phone}
                </a>
                <a
                  href={`mailto:${h.contact.email}`}
                  className="hover:text-cream transition-colors duration-300 ease-[var(--ease-out-expo)]"
                >
                  {h.contact.email}
                </a>
              </div>
            </div>
          </Section>
        </Container>
      </div>
    </>
  );
}
