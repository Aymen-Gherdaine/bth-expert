"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import type { Locale } from "@/lib/i18n";

interface HeroContent {
  eyebrow: string;
  headlinePart1: string;
  headlineEmphasis: string;
  headlinePart2: string;
  cta: string;
  ctaSecondary: string;
}

interface HeroSectionProps {
  lang: Locale;
  hero: HeroContent;
}

const ease = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

/* Each headline line clips upward from its overflow-hidden parent */
const lineReveal = {
  hidden: { y: "110%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 1.05, ease },
  },
};

const fade = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease } },
};

export function HeroSection({ lang, hero }: HeroSectionProps) {
  return (
    <section className="relative bg-brand min-h-[100dvh] flex flex-col justify-end overflow-hidden">

      {/* Decorative BTH — slow fade, stays subtle */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.028 }}
        transition={{ duration: 2.5, delay: 0.8, ease: "easeOut" }}
        className="pointer-events-none select-none absolute inset-y-0 end-[-5%] flex items-center"
      >
        <span
          className="font-display font-black leading-none text-cream"
          style={{
            fontSize: "clamp(12rem, 30vw, 40rem)",
            letterSpacing: "-0.06em",
          }}
        >
          BTH
        </span>
      </motion.div>

      <Container>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="pb-16 md:pb-20 lg:pb-28 pt-36 md:pt-40"
        >
          {/* Eyebrow — gold */}
          <motion.p
            variants={fade}
            className="text-gold text-[length:var(--text-caption)] uppercase tracking-widest mb-10 md:mb-14"
          >
            {hero.eyebrow}
          </motion.p>

          {/* Headline — each line wipes up from clip */}
          <h1
            className="font-display font-light text-cream leading-[0.93] tracking-[-0.03em] mb-14 md:mb-16"
            style={{ fontSize: "clamp(3rem, 9vw + 1rem, 9.5rem)" }}
          >
            <div className="overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                {hero.headlinePart1}
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.em variants={lineReveal} className="block italic">
                {hero.headlineEmphasis}
              </motion.em>
            </div>
            <div className="overflow-hidden">
              <motion.span variants={lineReveal} className="block">
                {hero.headlinePart2}
              </motion.span>
            </div>
          </h1>

          {/* Separator + CTAs */}
          <motion.div
            variants={fade}
            className="border-t border-cream/10 pt-8 flex flex-wrap items-center gap-4"
          >
            <Button href={`/${lang}/contact`} variant="outline-cream">
              {hero.cta}
            </Button>
            <Button href={`/${lang}/services`} variant="ghost-cream">
              {hero.ctaSecondary} <span className="inline-block rtl:-scale-x-100">→</span>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
