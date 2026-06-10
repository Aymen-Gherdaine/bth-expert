"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
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

interface ServicesPinProps {
  lang: Locale;
  services: ServiceContent;
}

// Distinct dark-green gradients — varied angle + tone so the crossfade reads.
// Swapped for real photos in Phase 2.
const PLACEHOLDERS = [
  "linear-gradient(135deg, #1f5226 0%, #081609 100%)",
  "linear-gradient(165deg, #0c2913 0%, #28492f 100%)",
  "linear-gradient(105deg, #16331a 0%, #34461f 100%)",
  "linear-gradient(150deg, #07140a 0%, #1f3a26 100%)",
];

const SLIDE = 28; // px of text translate during crossfade

export function ServicesPin({ lang, services }: ServicesPinProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  const N = services.items.length;

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const seg = 1 / N; // progress width of one service segment
      const tz = Math.min(0.1, seg * 0.6); // crossfade zone width (progress)

      // Map scroll progress → per-layer opacity + text offset.
      // Outside a crossfade zone exactly one service is solid (opacity 1);
      // inside a zone the outgoing fades 1→0 while the incoming fades 0→1,
      // summing to 1 at every instant — no black gap, no double-bright flash.
      function render(p: number) {
        p = Math.max(0, Math.min(1, p));
        const op = new Array<number>(N).fill(0);
        const ty = new Array<number>(N).fill(0);

        let inZone = false;
        for (let k = 1; k < N; k++) {
          const bk = k * seg;
          const half = tz / 2;
          if (p >= bk - half && p <= bk + half) {
            const t = (p - (bk - half)) / tz; // 0→1 across the boundary
            op[k - 1] = 1 - t;
            ty[k - 1] = -SLIDE * t;
            op[k] = t;
            ty[k] = SLIDE * (1 - t);
            inZone = true;
            break;
          }
        }
        if (!inZone) {
          const idx = Math.min(N - 1, Math.floor(p / seg));
          op[idx] = 1;
        }

        for (let i = 0; i < N; i++) {
          const img = imgRefs.current[i];
          if (img) gsap.set(img, { opacity: op[i] });
          const txt = textRefs.current[i];
          if (txt) gsap.set(txt, { opacity: op[i], y: ty[i] });
        }
      }

      const mm = gsap.matchMedia();

      // Desktop only: pin the whole section, crossfade through services.
      mm.add("(min-width: 1024px)", () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * N, // one viewport per service
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate(self) {
            render(self.progress);
          },
          onRefresh(self) {
            render(self.progress);
          },
        });

        render(0);

        return () => st.kill();
      });

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-white relative z-10">

      {/* ── Desktop: pinned section — title + crossfading two-column ──── */}
      <div className="services-pinned hidden lg:flex lg:flex-col lg:h-screen overflow-hidden">
        {/* Section title (no number) — stays while services cycle below */}
        <div className="px-10 xl:px-12 2xl:px-16 pt-24 xl:pt-28 pb-10 xl:pb-12 shrink-0">
          <h2
            className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
            style={{ fontSize: "clamp(2.25rem, 4vw + 0.75rem, 4.75rem)" }}
          >
            Nos expertises
          </h2>
        </div>

        {/* Two-column area fills the rest of the viewport */}
        <div
          className="flex-1 grid min-h-0"
          style={{ gridTemplateColumns: "5fr 7fr" }}
        >
          {/* Left: stacked placeholder images, one visible at a time */}
          <div className="relative px-10 xl:px-12 2xl:px-16 flex items-center" aria-hidden>
            <div
              className="relative w-full rounded-sm overflow-hidden"
              style={{ aspectRatio: "3/4", maxHeight: "68vh" }}
            >
              {services.items.map((item, i) => (
                <div
                  key={item.abbr}
                  ref={(el) => { imgRefs.current[i] = el; }}
                  // CSS initial state prevents hydration flash: non-first hidden
                  className={`absolute inset-0${i !== 0 ? " opacity-0" : ""}`}
                  style={{ background: PLACEHOLDERS[i % PLACEHOLDERS.length] }}
                />
              ))}
            </div>
          </div>

          {/* Right: stacked text blocks, one visible at a time */}
          <div className="relative border-s border-line/30">
            {services.items.map((item, i) => (
              <div
                key={item.abbr}
                ref={(el) => { textRefs.current[i] = el; }}
                className={`absolute inset-0 flex flex-col justify-center px-12 xl:px-16${i !== 0 ? " opacity-0" : ""}`}
              >
                <span
                  className="block font-display text-gold mb-8"
                  style={{
                    fontSize: "clamp(3rem, 5vw, 6rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-display font-light text-ink tracking-[-0.02em] leading-[1.1] mb-6"
                  style={{ fontSize: "var(--text-h2)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-sans text-ink-soft leading-[1.75] max-w-lg mb-8"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {item.description}
                </p>
                <Link
                  href={`/${lang}/services`}
                  className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)] w-fit"
                >
                  {services.itemCta} <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile + reduced-motion: static vertical stack, all visible ── */}
      <div className="services-stack lg:hidden">
        <div className="px-5 sm:px-6 md:px-8 pt-24 md:pt-28 pb-12 md:pb-16">
          <h2
            className="font-display font-light text-ink tracking-[-0.03em] leading-[1.05]"
            style={{ fontSize: "clamp(2.25rem, 6vw + 0.5rem, 3.5rem)" }}
          >
            Nos expertises
          </h2>
        </div>

        <div className="divide-y divide-line/20">
          {services.items.map((item, i) => (
            <div key={item.abbr} className="pb-16">
              <div
                aria-hidden
                className="w-full mb-8"
                style={{ aspectRatio: "16/9", background: PLACEHOLDERS[i % PLACEHOLDERS.length] }}
              />
              <div className="px-5 sm:px-6 md:px-8">
                <span
                  className="block font-display text-gold mb-4"
                  style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", lineHeight: 1 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  className="font-display font-light text-ink tracking-[-0.02em] leading-[1.1] mb-4"
                  style={{ fontSize: "var(--text-h3)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="font-sans text-ink-soft leading-[1.75] mb-6"
                  style={{ fontSize: "var(--text-body)" }}
                >
                  {item.description}
                </p>
                <Link
                  href={`/${lang}/services`}
                  className="inline-flex items-center gap-2 text-ink text-[length:var(--text-small)] tracking-tight hover:text-gold transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                >
                  {services.itemCta} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
