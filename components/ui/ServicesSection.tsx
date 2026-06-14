"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n";

interface ServiceItem {
  abbr: string;
  title: string;
  description: string;
}

interface ServiceContent {
  sectionNumber: string;
  eyebrow: string;
  heading: string;
  items: ServiceItem[];
  itemCta: string;
  cta: string;
}

interface ServicesSectionProps {
  lang: Locale;
  services: ServiceContent;
}

const ease = [0.16, 1, 0.3, 1] as const;

/* Overlay sur la photo augmente progressivement — le regard reste sur le texte */
const overlays = [0.05, 0.2, 0.38, 0.52];

export function ServicesSection({ lang, services }: ServicesSectionProps) {
  const [active, setActive] = useState(0);
  const outerRef = useRef<HTMLDivElement>(null);
  const N = services.items.length;

  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * N), N - 1);
    setActive(idx);
  });

  return (
    <section className="bg-brand overflow-hidden">

      {/* ── Heading — toujours visible, grand, jamais caché ─── */}
      <div className="px-6 sm:px-8 lg:px-16 xl:px-24 pt-24 md:pt-32 pb-16 md:pb-20">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-display text-[length:var(--text-caption)] text-gold tracking-widest">
            {services.sectionNumber}
          </span>
          <span className="h-px w-8 bg-gold/30 shrink-0" />
          <span className="text-[length:var(--text-caption)] uppercase tracking-widest text-[var(--color-on-brand-faint)]">
            {services.eyebrow}
          </span>
        </div>

        <h2
          className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05]"
          style={{ fontSize: "clamp(2.25rem, 5vw + 0.5rem, 5rem)" }}
        >
          {services.heading}
        </h2>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP — sticky scroll storytelling
          Section prend N × 100vh. Sticky inner = 100vh.
          Photo gauche fixe. Panels droite glissent au scroll.
      ══════════════════════════════════════════════════════════ */}
      <div
        ref={outerRef}
        className="hidden lg:block relative"
        style={{ height: `${N * 100}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden grid grid-cols-2">

          {/* ── LEFT: photo permanente ─────────────────────── */}
          <div className="relative h-full overflow-hidden">
            <Image
              src="/section service.webp"
              alt="Expert BTH Expert en intervention terrain, Bir El Djir, Oran, Algérie"
              fill
              className="object-cover"
              sizes="50vw"
              priority
            />

            {/* Overlay qui s'assombrit par service — dirige l'œil vers le texte */}
            <motion.div
              className="absolute inset-0 bg-brand pointer-events-none"
              animate={{ opacity: overlays[active] ?? 0.05 }}
              transition={{ duration: 1, ease }}
            />

            {/* Indicateur de progression — tirets verticaux gold */}
            <div className="absolute bottom-12 left-10 z-10 flex flex-col gap-3 items-center">
              {services.items.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-px bg-gold rounded-full"
                  animate={{
                    height: active === i ? 48 : 10,
                    opacity: active === i ? 1 : 0.25,
                  }}
                  transition={{ duration: 0.45, ease }}
                />
              ))}
            </div>

            {/* Légende */}
            <div className="absolute bottom-12 right-10 z-10">
              <p className="text-[0.65rem] text-cream/20 uppercase tracking-widest text-end leading-loose">
                Bir El Djir · Oran
                <br />
                Algérie
              </p>
            </div>
          </div>

          {/* ── RIGHT: panels qui glissent ─────────────────── */}
          <div className="relative h-full overflow-hidden bg-brand">

            {/* Filet gold gauche */}
            <div className="absolute left-0 inset-y-0 w-px bg-gold/20 z-10 pointer-events-none" />

            {services.items.map((item, i) => (
              <motion.div
                key={item.abbr}
                className="absolute inset-0 flex flex-col px-14 xl:px-20"
                initial={{ y: i === 0 ? "0%" : "100%" }}
                animate={{
                  y: active === i ? "0%" : active > i ? "-100%" : "100%",
                }}
                transition={{ duration: 0.9, ease }}
              >
                {/* Numéro géant en fond — editorial */}
                <div className="pt-12 mb-auto">
                  <span
                    className="font-display font-black text-cream/[0.04] leading-none select-none"
                    style={{ fontSize: "clamp(7rem, 13vw, 16rem)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Contenu service — ancré en bas */}
                <div className="pb-16">
                  <span className="text-[0.68rem] uppercase tracking-[0.18em] text-[var(--color-on-brand-faint)] block mb-5">
                    {item.abbr}
                  </span>

                  <h3
                    className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05] mb-7"
                    style={{ fontSize: "clamp(1.75rem, 3.5vw + 0.25rem, 3.5rem)" }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-[var(--color-on-brand-muted)] leading-[1.85] max-w-md mb-10"
                    style={{ fontSize: "var(--text-body)" }}
                  >
                    {item.description}
                  </p>

                  <Link
                    href={`/${lang}/services`}
                    className="group/link inline-flex items-center gap-3 text-gold"
                    style={{ fontSize: "var(--text-small)" }}
                  >
                    <span className="uppercase tracking-widest">{services.itemCta}</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                      className="inline-block"
                    >
                      →
                    </motion.span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MOBILE — liste simple (pas de sticky sur mobile)
      ══════════════════════════════════════════════════════════ */}
      <div className="lg:hidden">
        {/* Photo mobile — pleine largeur */}
        <div className="relative w-full h-[55vw] overflow-hidden mb-0">
          <Image
            src="/section service.webp"
            alt="Expert BTH Expert terrain, Oran"
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand/25" />
        </div>

        <div className="px-6 sm:px-8 divide-y divide-cream/10 pb-4">
          {services.items.map((item, i) => (
            <div key={item.abbr} className="py-8">
              <span
                className="font-display font-light text-gold/25 leading-none block mb-3"
                style={{ fontSize: "3.5rem" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[0.68rem] uppercase tracking-widest text-cream/25 block mb-2">
                {item.abbr}
              </span>
              <h3
                className="font-display font-light text-cream tracking-tight leading-snug mb-4"
                style={{ fontSize: "clamp(1.3rem, 5vw, 1.75rem)" }}
              >
                {item.title}
              </h3>
              <p className="text-[var(--color-on-brand-muted)] text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="px-6 sm:px-8 lg:px-16 xl:px-24 pb-20 md:pb-28 pt-4">
        <Button href={`/${lang}/services`} variant="outline-cream">
          {services.cta}
        </Button>
      </div>
    </section>
  );
}
