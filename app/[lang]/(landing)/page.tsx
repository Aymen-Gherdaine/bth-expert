import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { RevealText } from "@/components/animations/RevealText";
import { ServicesPinScroll } from "@/components/sections/ServicesPinScroll";
import { StatsBand } from "@/components/sections/StatsBand";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatementSection } from "@/components/sections/StatementSection";
import { ZonesSection } from "@/components/sections/ZonesSection";
import { FadeIn } from "@/components/motion/FadeIn";
import { HeroCurtain } from "@/components/motion/HeroCurtain";
import { HeroBackground } from "@/components/motion/HeroBackground";
import { CtaVideo } from "@/components/motion/CtaVideo";

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

      {/* ── HERO — pinned full-bleed; the next section covers it on scroll ──
          Same mechanism as the footer reveal: the hero is sticky (z-0) inside
          the tall <main>, the post-hero block (z-10, opaque) slides over it. */}
      <HeroCurtain>
        <section className="relative min-h-svh flex items-end overflow-hidden pt-20 pb-24 lg:py-0 lg:pb-24 bg-brand-deep">
          {/* Full-bleed image — Ken Burns + scroll parallax behind a uniform veil */}
          <HeroBackground src="/hero.webp" />

          {/* Cinematic gradient veil — lets the image read up top, holds the
              type legible below (manifesto §3, --overlay-hero) */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "var(--overlay-hero)" }}
          />
          {/* Side weight for the bottom-left headline (--overlay-hero-side) */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "var(--overlay-hero-side)" }}
          />
          {/* Film grain — kills the flat digital feel */}
          <div aria-hidden className="hero-grain absolute inset-0" />

          <Container className="relative z-10">
            <div className="max-w-4xl">
              <span aria-hidden className="block w-14 h-px bg-gold mb-7 origin-left" />
              <RevealText
                className="block font-sans text-[0.8125rem] uppercase tracking-[0.22em] text-gold mb-8"
                delay={0.1}
              >
                {h.hero.eyebrow}
              </RevealText>

              <RevealText
                as="h1"
                className="font-display font-medium text-cream leading-[1.1] sm:leading-[1.04] tracking-[-0.03em]"
                style={{ fontSize: "var(--text-hero)" }}
                delay={0.25}
              >
                {h.hero.headlinePart1}{" "}
                <span className="italic font-normal">{h.hero.headlineEmphasis}</span>{" "}
                {(() => {
                  const [lead, ...rest] = h.hero.headlinePart2.split(" ");
                  if (lead !== "&") return h.hero.headlinePart2;
                  return (
                    <>
                      <span className="italic font-light">{"&"}</span>
                      {rest.length ? ` ${rest.join(" ")}` : ""}
                    </>
                  );
                })()}
              </RevealText>

              <RevealText
                className="block mt-8 font-sans text-cream/75 text-[length:var(--text-body)] max-w-xl leading-relaxed"
                delay={0.6}
              >
                {h.hero.subheading}
              </RevealText>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  {h.hero.cta}
                </Link>
                <Link
                  href={`/${lang}/services`}
                  className="inline-flex items-center text-cream/90 text-[0.9375rem] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)]"
                >
                  {h.hero.ctaSecondary} <span className="ml-2">→</span>
                </Link>
              </div>
            </div>
          </Container>

          <span aria-hidden className="scroll-pulse absolute bottom-6 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:bottom-10 lg:right-12 z-10" />
        </section>
      </HeroCurtain>

      {/* ── POST-HERO — scrolls over the pinned hero ─────────────────── */}
      {/* cream-soft plugs any gap from About's curtain retreat, keeps hero hidden */}
      <div className="relative z-10 bg-cream-soft">

      {/* ── EN CHIFFRES — count-up credibility band right after the hero ── */}
      <StatsBand stats={h.stats} />

      {/* ── À PROPOS — credential bridge between hero and services ─────── */}
      <AboutSection lang={lang} />

      {/* ── SERVICES — signature pin-scroll: sticky visual, rows scroll past ── */}
      <ServicesPinScroll lang={lang} services={h.services} />

      {/* ── RÉALISATIONS — editorial typographic index, proof before contact ── */}
      <ProjectsSection lang={lang} />

      {/* ── STATEMENT — cream pause + clip-path photo wipe before the dark ── */}
      <StatementSection lang={lang} />

      {/* ── ZONES D'INTERVENTION — Algeria map, Oran glow beacon ──────── */}
      <ZonesSection lang={lang} />

      {/* ── CTA CONTACT — full-bleed image section, breaks the green wall ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-deep">
        {/* Background video — deferred load, poster first, fades in once playing */}
        <CtaVideo src="/video_cta.mp4" poster="/video_cta-poster.webp" />
        {/* Green-black overlay for text contrast over the moving image */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgb(10 22 13 / 0.5) 0%, rgb(4 10 6 / 0.78) 100%)",
          }}
        />
        <Container className="relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-[length:var(--text-caption)] uppercase tracking-widest text-gold mb-6">
                {h.contact.eyebrow}
              </p>
              <h2
                className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05] mb-8"
                style={{ fontSize: "clamp(2.25rem, 4vw + 0.5rem, 4.5rem)" }}
              >
                {h.contact.heading}
              </h2>
              <p className="text-[length:var(--text-body)] text-cream/75 leading-[1.75] max-w-lg mb-12">
                {h.contact.description}
              </p>
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:tracking-[0.01em] transition-[background-color,letter-spacing] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
              >
                {h.contact.cta}
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>

      </div>{/* end post-hero z-10 wrapper */}
    </>
  );
}
