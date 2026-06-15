import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { ServiceHero } from "@/components/sections/ServiceHero";
import { TerrainCover } from "@/components/sections/Terrain";
import { FadeIn } from "@/components/motion/FadeIn";
import { RevealText } from "@/components/animations/RevealText";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { AboutTimeline } from "@/components/sections/AboutTimeline";

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
    path: "/a-propos",
    title: dict.apropos.meta.title,
    description: dict.apropos.meta.description,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const a = dict.apropos;
  const jsonLd = schemaLocalBusiness();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <ServiceHero
        eyebrow={a.hero.eyebrow}
        heading={a.hero.heading}
        subheading={a.hero.subheading}
      />

      {/* ── Histoire (timeline) ──────────────────────────────── */}
      <AboutTimeline
        eyebrow={a.timeline.eyebrow}
        heading={a.timeline.heading}
        milestones={a.timeline.milestones}
      />

      {/* ── Agrément & conformité ────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4 mb-8 lg:mb-0">
              <FadeIn>
                <span aria-hidden className="block w-12 h-px bg-gold mb-7" />
                <RevealText
                  as="h2"
                  className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink"
                >
                  {a.agrement.heading}
                </RevealText>
              </FadeIn>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FadeIn delay={0.1}>
                <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.8]">
                  {a.agrement.description}
                </p>
              </FadeIn>
            </div>
          </div>
        </Section>
      </Container>

      {/* ── Partenariat BTH Consult ──────────────────────────── */}
      <div className="border-t border-line bg-cream-deep">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 mb-8 lg:mb-0">
                <FadeIn>
                  <span aria-hidden className="block w-12 h-px bg-gold mb-7" />
                  <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink">
                    {a.partner.heading}
                  </h2>
                </FadeIn>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <FadeIn delay={0.1}>
                  <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.8]">
                    {a.partner.description}
                  </p>
                </FadeIn>
              </div>
            </div>
          </Section>
        </Container>
      </div>

      {/* ── Notre approche ───────────────────────────────────── */}
      <Container>
        <Section number="01" eyebrow={a.values.eyebrow}>
          <SectionReveal>
            <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-12 lg:mb-16 max-w-2xl">
              {a.values.heading}
            </h2>
            <div className="grid gap-10 md:grid-cols-3 md:gap-8">
              {a.values.items.map((item, index) => (
                <div key={item.title}>
                  <span className="font-display text-[length:var(--text-caption)] text-gold tracking-widest block mb-4">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-[length:var(--text-h3)] font-medium tracking-[-0.01em] leading-[1.2] text-ink mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[length:var(--text-small)] text-ink-soft leading-[1.7]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </SectionReveal>
        </Section>
      </Container>

      {/* ── Stats band ───────────────────────────────────────── */}
      <div className="border-y border-line bg-cream-deep">
        <Container>
          <div className="py-16 lg:py-20 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
            {a.stats.items.map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-gold tracking-[-0.02em] leading-none mb-3 text-[clamp(2.5rem,4vw,3.5rem)]">
                  {stat.value}
                </p>
                <p className="text-[length:var(--text-small)] uppercase tracking-widest text-muted">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </div>

      {/* ── Terrain plate — bespoke topographic artwork ──────── */}
      <TerrainCover src="/generated/section-apropos.svg" eyebrow={a.hero.eyebrow} />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-6">
                {a.cta.heading}
              </h2>
              <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] mb-8">
                {a.cta.description}
              </p>
              <Button href={`/${lang}/contact`}>{a.cta.button}</Button>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
