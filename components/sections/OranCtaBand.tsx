"use client";

import Link from "next/link";
import { FadeIn } from "@/components/motion/FadeIn";
import { TerrainBackdrop } from "@/components/sections/Terrain";

interface OranCtaBandProps {
  lang: string;
  cta: { heading: string; description: string; button: string };
  art?: string;
}

/**
 * Dark punctuation band closing the Oran page — gold filet, monumental cream
 * heading, supporting line and a gold pill link to contact. Mirrors the
 * livrable band of ServicePageBody. Copy is dictionary-driven.
 */
export function OranCtaBand({ lang, cta, art }: OranCtaBandProps) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-deep">
      {art ? <TerrainBackdrop src={art} /> : null}
      <div className="relative z-10 px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-24 lg:py-32">
        <div className="lg:grid lg:grid-cols-12 lg:gap-16 lg:items-end">
          <div className="lg:col-span-8">
            <FadeIn>
              <span aria-hidden className="block w-14 h-px bg-gold mb-8" />
              <h2
                className="font-display font-light text-cream tracking-[-0.02em] leading-[1.1] max-w-3xl"
                style={{ fontSize: "var(--text-h1)" }}
              >
                {cta.heading}
              </h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-7 font-sans text-[var(--color-on-brand-muted)] leading-[1.75] max-w-xl text-[length:var(--text-body)]">
                {cta.description}
              </p>
            </FadeIn>
          </div>

          <FadeIn delay={0.15} className="mt-10 lg:mt-0 lg:col-span-4 lg:flex lg:justify-end">
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-sm bg-gold text-brand-deep font-medium text-[0.9375rem] tracking-tight hover:bg-gold-deep hover:gap-3 transition-[background-color,gap] duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
            >
              {cta.button}
              <span aria-hidden>→</span>
            </Link>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
