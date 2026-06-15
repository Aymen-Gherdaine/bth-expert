"use client";

import { FadeIn, FadeInStagger, FadeInItem } from "@/components/motion/FadeIn";

interface OranBodyProps {
  services: { heading: string; description: string };
  zones: { heading: string; description: string; wilayas: string[] };
  nap: { heading: string; address: string; phone: string; email: string };
}

const linkCls =
  "hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

/**
 * Editorial body for the Oran page: a contexte/services split, a zones block
 * whose wilayas reveal as a numbered stagger with gold ticks instead of a flat
 * divide-y list, and a coordinates (NAP) block that keeps the tel:/mailto:/
 * address links intact. All copy is dictionary-driven; numerals are derived.
 */
export function OranBody({ services, zones, nap }: OranBodyProps) {
  return (
    <section className="bg-cream-soft">
      <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16">
        {/* ── Services ── */}
        <div className="border-t border-line py-16 lg:py-24 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <FadeIn>
              <span aria-hidden className="block w-12 h-px bg-gold mb-7" />
              <h2
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15]"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {services.heading}
              </h2>
            </FadeIn>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <FadeIn delay={0.1}>
              <p
                className="font-sans text-ink-soft leading-[1.8]"
                style={{ fontSize: "clamp(1.0625rem, 0.4vw + 0.95rem, 1.25rem)" }}
              >
                {services.description}
              </p>
            </FadeIn>
          </div>
        </div>

        {/* ── Zones ── */}
        <div className="border-t border-line py-16 lg:py-24 lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-5 mb-8 lg:mb-0">
            <FadeIn>
              <h2
                className="font-display font-light text-ink tracking-[-0.02em] leading-[1.15] mb-5"
                style={{ fontSize: "var(--text-h2)" }}
              >
                {zones.heading}
              </h2>
              <p className="font-sans text-ink-soft leading-[1.8] max-w-md text-[length:var(--text-body)]">
                {zones.description}
              </p>
            </FadeIn>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <FadeInStagger className="grid sm:grid-cols-2 gap-x-10">
              {zones.wilayas.map((wilaya, index) => (
                <FadeInItem key={wilaya}>
                  <div className="group flex items-baseline gap-4 border-b border-line py-4">
                    <span
                      aria-hidden
                      className="font-display text-gold leading-none tabular-nums"
                      style={{ fontSize: "var(--text-small)" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-sans text-ink-soft text-[length:var(--text-body)] transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] group-hover:text-brand">
                      {wilaya}
                    </span>
                  </div>
                </FadeInItem>
              ))}
            </FadeInStagger>
          </div>
        </div>
      </div>

      {/* ── NAP — coordinates on a warm band ── */}
      <div className="border-t border-line bg-cream-deep">
        <div className="px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-16 py-16 lg:py-24">
          <FadeIn>
            <span aria-hidden className="block w-12 h-px bg-gold mb-7" />
            <h2
              className="font-display font-medium tracking-[-0.01em] text-ink mb-10"
              style={{ fontSize: "var(--text-h3)" }}
            >
              {nap.heading}
            </h2>
          </FadeIn>
          <FadeInStagger className="grid gap-10 sm:grid-cols-3 text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
            <FadeInItem>
              <address className="not-italic">{nap.address}</address>
            </FadeInItem>
            <FadeInItem>
              <a
                href={`tel:${nap.phone.replace(/\s/g, "")}`}
                className={linkCls}
              >
                {nap.phone}
              </a>
            </FadeInItem>
            <FadeInItem>
              <a href={`mailto:${nap.email}`} className={linkCls}>
                {nap.email}
              </a>
            </FadeInItem>
          </FadeInStagger>
        </div>
      </div>
    </section>
  );
}
