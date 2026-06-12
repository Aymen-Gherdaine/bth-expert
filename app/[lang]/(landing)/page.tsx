import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { RevealText } from "@/components/animations/RevealText";
import { ServicesList } from "@/components/sections/ServicesList";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { AboutSection } from "@/components/sections/AboutSection";
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

      {/* ── HERO — cinematic full-bleed, curtain-up on scroll ─────────── */}
      <HeroCurtain>
        <section className="relative min-h-screen flex items-end overflow-hidden pb-20 lg:pb-32 bg-brand-deep">
          {/* Full-bleed image — Ken Burns + scroll parallax behind a uniform veil */}
          <HeroBackground src="/hero.webp" />

          {/* Uniform deep-green veil — the image reads as texture, type stays king */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ backgroundColor: "rgb(12 20 14 / 0.62)" }}
          />
          {/* Slight extra weight at the bottom, under headline + CTAs */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgb(8 14 9 / 0.35) 0%, transparent 50%)",
            }}
          />
          {/* Film grain — kills the flat digital feel */}
          <div aria-hidden className="hero-grain absolute inset-0" />

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
      </HeroCurtain>

      {/* ── POST-HERO — scrolls over the pinned hero ─────────────────── */}
      {/* bg-cream-warm plugs any gap from About's curtain retreat, keeps hero hidden */}
      <div className="relative z-10 bg-cream-warm">

      {/* ── À PROPOS — credential bridge between hero and services ─────── */}
      <AboutSection lang={lang} />

      {/* ── SERVICES — clean two-column expertise list on white ─────── */}
      <ServicesList lang={lang} services={h.services} />

      {/* ── RÉALISATIONS — editorial typographic index, proof before contact ── */}
      <ProjectsSection lang={lang} />

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
              <p className="text-[var(--text-caption)] uppercase tracking-widest text-gold mb-6">
                {h.contact.eyebrow}
              </p>
              <h2
                className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05] mb-8"
                style={{ fontSize: "clamp(2.25rem, 4vw + 0.5rem, 4.5rem)" }}
              >
                {h.contact.heading}
              </h2>
              <p className="text-[var(--text-body)] text-cream/75 leading-[1.75] max-w-lg mb-12">
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
