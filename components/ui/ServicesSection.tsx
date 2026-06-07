"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
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

export function ServicesSection({ lang, services }: ServicesSectionProps) {
  const [active, setActive] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Parallax: image translates ±5% during scroll. scale(1.12) covers the movement */
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={sectionRef} className="bg-brand overflow-hidden">

      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="px-6 sm:px-8 lg:px-16 xl:px-24 pt-24 md:pt-32 pb-12 md:pb-16">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease }}
          className="flex items-center gap-4 mb-10"
        >
          <span className="font-display text-[var(--text-caption)] text-gold tracking-widest">
            {services.sectionNumber}
          </span>
          <span className="h-px w-8 bg-gold/30 shrink-0" />
          <span className="text-[var(--text-caption)] uppercase tracking-widest text-[var(--color-on-brand-faint)]">
            {services.eyebrow}
          </span>
        </motion.div>

        {/* Heading — clip-path wipe upward */}
        <div className="overflow-hidden">
          <motion.h2
            initial={{ y: "108%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-8% 0px" }}
            transition={{ duration: 1, ease }}
            className="font-display font-light text-cream max-w-2xl tracking-[-0.03em] leading-[1.05]"
            style={{ fontSize: "clamp(1.75rem, 3vw + 0.5rem, 3.25rem)" }}
          >
            {services.heading}
          </motion.h2>
        </div>
      </div>

      {/* ── Split: accordion list + photo ───────────────────────────── */}
      <div className="lg:grid lg:grid-cols-[56%_44%]">

        {/* LEFT — accordion service list */}
        <div className="px-6 sm:px-8 lg:px-16 xl:px-24 pb-20 md:pb-28">
          <div className="border-t border-cream/15">
            {services.items.map((item, i) => (
              <div
                key={item.abbr}
                className="border-b border-cream/15 relative"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Gold left bar — scaleY reveal on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] bg-gold origin-top"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: active === i ? 1 : 0 }}
                  transition={{ duration: 0.35, ease }}
                />

                <div className="py-8 ps-6 cursor-default select-none">
                  <div className="flex items-start gap-6 lg:gap-8">

                    {/* Giant editorial number */}
                    <span
                      className={`font-display font-light tabular-nums shrink-0 leading-[0.85] transition-colors duration-500 ${
                        active === i ? "text-gold" : "text-gold/25"
                      }`}
                      style={{ fontSize: "clamp(2.5rem, 4vw, 4rem)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0 pt-1">
                      <span className="text-[0.68rem] uppercase tracking-widest text-cream/25 block mb-2">
                        {item.abbr}
                      </span>
                      <h3
                        className={`font-display font-light tracking-[-0.02em] leading-[1.1] transition-colors duration-500 ${
                          active === i ? "text-gold" : "text-cream"
                        }`}
                        style={{ fontSize: "clamp(1.4rem, 2vw + 0.3rem, 2.2rem)" }}
                      >
                        {item.title}
                      </h3>

                      {/* Description — expands on hover */}
                      <motion.div
                        animate={{
                          height: active === i ? "auto" : 0,
                          opacity: active === i ? 1 : 0,
                        }}
                        initial={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease }}
                        className="overflow-hidden"
                      >
                        <p
                          className="text-[var(--color-on-brand-muted)] leading-[1.8] pt-5 pb-3"
                          style={{ fontSize: "var(--text-body)" }}
                        >
                          {item.description}
                        </p>
                        <Link
                          href={`/${lang}/services`}
                          className="inline-flex items-center gap-2 text-gold text-sm group/link pb-1"
                        >
                          <span>{services.itemCta}</span>
                          <span className="group-hover/link:translate-x-1 transition-transform duration-300 inline-block">
                            →
                          </span>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button href={`/${lang}/services`} variant="outline-cream">
              {services.cta}
            </Button>
          </div>
        </div>

        {/* RIGHT — photo : clip-path wipe + parallax */}
        <div className="hidden lg:block relative min-h-[680px]">

          {/* Gold separator */}
          <div className="absolute left-0 inset-y-0 w-px bg-gold/20 z-10" />

          {/* Clip-path wipe: inset bottom 100% → 0% — reveals upward */}
          <motion.div
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.4, ease }}
            className="absolute inset-0 overflow-hidden"
          >
            {/* Parallax layer — scale(1.12) covers ±5% movement without white edges */}
            <motion.div
              style={{ y: imageY }}
              className="absolute inset-0 scale-[1.12]"
            >
              {/* next/image fill requires a `relative` ancestor — this div serves that role */}
              <div className="relative w-full h-full">
                <Image
                  src="/section service.webp"
                  alt="Expert BTH Expert en intervention terrain, Bir El Djir, Oran, Algérie"
                  fill
                  className="object-cover"
                  sizes="44vw"
                />
              </div>
              <div className="absolute inset-0 bg-brand/15" />
            </motion.div>
          </motion.div>

          {/* Caption */}
          <div className="absolute bottom-8 right-8 z-10">
            <p className="text-[0.68rem] text-cream/25 uppercase tracking-widest text-end leading-relaxed">
              Bir El Djir · Oran
              <br />
              Algérie
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
