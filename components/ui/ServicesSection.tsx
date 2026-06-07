"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const rowVariant = {
  hidden: { opacity: 0, x: -18 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
};

export function ServicesSection({ lang, services }: ServicesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Image moves up 18% of its container height during scroll — parallax depth */
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);

  return (
    <section ref={sectionRef} className="relative bg-brand overflow-hidden">
      <div className="lg:grid lg:grid-cols-[1fr_44%]">

        {/* ── LEFT : liste de services ───────────────────────── */}
        <div
          className="py-24 md:py-32 lg:py-40 px-6 sm:px-8 lg:pe-16"
          style={{
            paddingLeft: "max(1.5rem, calc((100vw - 1280px) / 2 + 5rem))",
          }}
        >
          {/* Label section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.6, ease }}
            className="flex items-center gap-4 mb-12 md:mb-16"
          >
            <span className="font-display text-[var(--text-caption)] text-gold tracking-widest">
              {services.sectionNumber}
            </span>
            <span className="h-px w-8 bg-gold/30 shrink-0" />
            <span className="text-[var(--text-caption)] uppercase tracking-widest text-[var(--color-on-brand-faint)]">
              {services.eyebrow}
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 0.9, ease }}
            className="font-display font-light text-cream tracking-[-0.03em] leading-[1.05] mb-16 md:mb-20 max-w-lg"
            style={{ fontSize: "clamp(1.75rem, 3vw + 0.5rem, 3rem)" }}
          >
            {services.heading}
          </motion.h2>

          {/* Service rows */}
          <motion.div
            variants={listVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-6% 0px" }}
            className="divide-y divide-cream/10"
          >
            {services.items.map((item, index) => (
              <motion.div key={item.abbr} variants={rowVariant}>
                <Link
                  href={`/${lang}/services`}
                  className="group flex items-center gap-5 py-7 lg:py-8"
                >
                  {/* Index */}
                  <span className="font-display font-light tabular-nums shrink-0 w-7 text-[0.8rem] text-gold/40 group-hover:text-gold/70 transition-colors duration-500 ease-[var(--ease-out-expo)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[0.7rem] uppercase tracking-widest text-[var(--color-on-brand-faint)] block mb-1.5">
                      {item.abbr}
                    </span>
                    <h3
                      className="font-display font-light text-cream group-hover:text-gold transition-colors duration-500 ease-[var(--ease-out-expo)] tracking-[-0.02em] leading-[1.15]"
                      style={{ fontSize: "clamp(1.05rem, 1.5vw + 0.3rem, 1.5rem)" }}
                    >
                      {item.title}
                    </h3>
                  </div>

                  {/* Arrow — nudge on hover via CSS */}
                  <span className="text-cream/20 group-hover:text-gold group-hover:translate-x-2 transition-all duration-500 ease-[var(--ease-out-expo)] text-xl shrink-0 select-none">
                    →
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease }}
            className="mt-14"
          >
            <Button href={`/${lang}/services`} variant="outline-cream">
              {services.cta}
            </Button>
          </motion.div>
        </div>

        {/* ── RIGHT : photo sticky avec parallax ─────────────── */}
        <div className="hidden lg:block relative">

          {/* Filet or — séparateur premium entre les deux colonnes */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gold/20 z-10" />

          <div className="sticky top-0 h-screen overflow-hidden">
            {/* Parallax wrapper — surdimensionné pour éviter les bords blancs */}
            <motion.div
              style={{ y: imageY }}
              className="absolute inset-0 scale-[1.22]"
            >
              <Image
                src="/section service.webp"
                alt="Expert BTH Expert en intervention terrain à Oran, Algérie"
                fill
                className="object-cover"
                sizes="44vw"
              />
              {/* Voile brand très subtil — garde la profondeur sans tuer la photo */}
              <div className="absolute inset-0 bg-brand/20" />
            </motion.div>

            {/* Légende bas-droite */}
            <div className="absolute bottom-8 right-8 z-10 text-end">
              <p className="text-[0.68rem] text-cream/25 uppercase tracking-widest leading-relaxed">
                Bir El Djir · Oran
                <br />
                Algérie
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
