import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { RevealText } from "@/components/animations/RevealText";
import { ServicesPin } from "@/components/sections/ServicesPin";
import { Marquee } from "@/components/motion/Marquee";
import { FadeIn } from "@/components/motion/FadeIn";

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

      {/* ── HERO — cinematic full-bleed, word-reveal on entry ─────────── */}
      <section className="relative min-h-screen flex items-end overflow-hidden pb-20 lg:pb-32">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, var(--color-brand) 0%, var(--color-brand-deep) 50%, #060d07 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "var(--overlay-hero-side)" }}
        />

        <Container className="relative z-10">
          <div className="max-w-3xl">
            <RevealText
              className="block font-sans text-[0.8125rem] uppercase tracking-[0.22em] text-gold mb-8"
              delay={0.1}
            >
              Cabinet d&apos;études environnementales · Agréé Ministère
            </RevealText>

            <RevealText
              as="h1"
              className="font-display font-medium text-[length:var(--text-hero)] text-cream leading-[1.0] tracking-[-0.03em]"
              delay={0.25}
            >
              Expertise environnementale &amp; industrielle
            </RevealText>

            <RevealText
              className="block mt-10 font-sans text-cream/75 text-[length:var(--text-body)] max-w-xl leading-relaxed"
              delay={0.6}
            >
              Études d&apos;impact, études de dangers, audits HSE et conformité réglementaire pour l&apos;industrie algérienne depuis 2009.
            </RevealText>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
              >
                Discuter d&apos;un projet
              </Link>
              <Link
                href={`/${lang}/services`}
                className="inline-flex items-center text-cream/90 text-[0.9375rem] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)]"
              >
                Nos services <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </Container>

        <span aria-hidden className="scroll-pulse absolute bottom-8 right-8 lg:bottom-10 lg:right-12 z-10" />
      </section>

      {/* ── MARQUEE — credentials ticker ─────────────────────────────── */}
      <Marquee />

      {/* ── STATS — monumental numbers ───────────────────────────────── */}
      <FadeIn>
        <div className="border-b border-line">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-line">
              {h.stats.items.map((item) => (
                <div
                  key={item.label}
                  className="py-12 lg:py-16 px-6 first:ps-0 last:pe-0"
                >
                  <div
                    className={`font-display font-light leading-none tracking-[-0.04em] mb-3 ${
                      item.highlight ? "text-gold" : "text-ink"
                    }`}
                    style={{
                      fontSize: "clamp(2.5rem, 5vw + 1rem, 5.5rem)",
                    }}
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
      </FadeIn>

      {/* ── SERVICES — split plein-écran + photo sticky parallax ────── */}
      <ServicesPin lang={lang} services={h.services} />

      {/* ── MANIFESTO BAND — full bleed dark statement ───────────────── */}
      <FadeIn>
        <div className="bg-brand-deep">
          <Container>
            <div className="py-20 md:py-28 lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7 mb-6 lg:mb-0">
                <p
                  className="font-display font-light text-cream leading-[1.1] tracking-[-0.03em]"
                  style={{ fontSize: "clamp(1.75rem, 3.5vw + 0.5rem, 3.25rem)" }}
                >
                  Chaque projet industriel commence par une question environnementale.
                </p>
              </div>
              <div className="lg:col-span-4 lg:col-start-9 flex items-end">
                <p className="text-[var(--text-body)] text-[var(--color-on-brand-muted)] leading-[1.75]">
                  BTH Expert transforme vos obligations réglementaires en avantage concurrentiel — études conformes, livrables prêts à déposer.
                </p>
              </div>
            </div>
          </Container>
        </div>
      </FadeIn>

      {/* ── ÉQUIPE ───────────────────────────────────────────────────── */}
      <Container>
        <Section number={h.equipe.sectionNumber} eyebrow={h.equipe.eyebrow}>
          <FadeIn>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-6 mb-10 lg:mb-0">
                <h2
                  className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05] mb-10"
                  style={{ fontSize: "clamp(1.75rem, 3vw + 0.5rem, 3rem)" }}
                >
                  {h.equipe.heading}
                </h2>
                <Button href={`/${lang}/equipe`} variant="secondary">
                  {h.equipe.cta}
                </Button>
              </div>
              <div className="lg:col-span-5 lg:col-start-8 flex items-center">
                <p className="text-[var(--text-body)] text-ink-soft leading-[1.75]">
                  {h.equipe.description}
                </p>
              </div>
            </div>
          </FadeIn>
        </Section>
      </Container>

      {/* ── CTA CONTACT ──────────────────────────────────────────────── */}
      <FadeIn>
        <div className="bg-brand">
          <Container>
            <Section tight>
              <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-8 mb-10 lg:mb-0">
                  <p className="text-[var(--text-caption)] uppercase tracking-widest text-[var(--color-on-brand-faint)] mb-6">
                    {h.contact.eyebrow}
                  </p>
                  <h2
                    className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05] mb-8"
                    style={{ fontSize: "clamp(2rem, 4vw + 0.5rem, 4rem)" }}
                  >
                    {h.contact.heading}
                  </h2>
                  <p className="text-[var(--text-body)] text-[var(--color-on-brand-muted)] leading-[1.75] max-w-lg mb-10">
                    {h.contact.description}
                  </p>
                  <Button href={`/${lang}/contact`} variant="outline-cream">
                    {h.contact.cta}
                  </Button>
                </div>
                <div className="lg:col-span-4 flex flex-col justify-center gap-5 text-[var(--color-on-brand-muted)] text-[var(--text-small)]">
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
      </FadeIn>
    </>
  );
}
