import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { HeroSection } from "@/components/ui/HeroSection";
import { Marquee } from "@/components/motion/Marquee";
import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

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

      {/* ── HERO ─────────────────────────────────────────────────────────
          Client component — Framer Motion clip-path line reveal + stagger.
      ─────────────────────────────────────────────────────────────────── */}
      <HeroSection lang={lang} hero={h.hero} />

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

      {/* ── SERVICES ─────────────────────────────────────────────────── */}
      <Container>
        <Section number={h.services.sectionNumber} eyebrow={h.services.eyebrow}>

          <FadeIn>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 mb-16 md:mb-20">
              <h2
                className="font-display font-light text-ink lg:col-span-8 tracking-[-0.03em] leading-[1.05]"
                style={{ fontSize: "clamp(1.75rem, 3vw + 0.5rem, 3rem)" }}
              >
                {h.services.heading}
              </h2>
            </div>
          </FadeIn>

          <FadeInStagger>
            <div className="divide-y divide-line">
              {h.services.items.map((item, index) => (
                <FadeInItem key={item.abbr}>
                  <div className="py-9 lg:grid lg:grid-cols-12 lg:gap-8 group">
                    <div className="lg:col-span-1 mb-3 lg:mb-0 flex items-start">
                      <span
                        className="font-display font-light text-muted"
                        style={{ fontSize: "clamp(0.9rem, 1.2vw, 1.1rem)" }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="lg:col-span-4 mb-3 lg:mb-0">
                      <span className="text-[var(--text-caption)] uppercase tracking-widest text-muted block mb-2">
                        {item.abbr}
                      </span>
                      <h3
                        className="font-display font-light text-ink group-hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)] tracking-[-0.02em] leading-[1.15]"
                        style={{ fontSize: "clamp(1.2rem, 1.8vw + 0.3rem, 1.75rem)" }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <div className="lg:col-span-5 mb-5 lg:mb-0">
                      <p className="text-[var(--text-body)] text-ink-soft leading-[1.75]">
                        {item.description}
                      </p>
                    </div>
                    <div className="lg:col-span-2 lg:text-right flex lg:justify-end items-start">
                      <Link
                        href={`/${lang}/services`}
                        className="relative text-[var(--text-small)] text-muted group-hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)] after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-px after:bg-current after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:ease-[var(--ease-out-expo)]"
                      >
                        {h.services.itemCta} →
                      </Link>
                    </div>
                  </div>
                </FadeInItem>
              ))}
            </div>
          </FadeInStagger>

          <FadeIn delay={0.1}>
            <div className="mt-14">
              <Button href={`/${lang}/services`} variant="secondary">
                {h.services.cta}
              </Button>
            </div>
          </FadeIn>

        </Section>
      </Container>

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
