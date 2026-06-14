import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";

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
    path: "/oran",
    title: dict.oran.meta.title,
    description: dict.oran.meta.description,
  });
}

export default async function OranPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const o = dict.oran;

  const jsonLd = schemaLocalBusiness();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Container>
        <div className="pt-32 pb-24 md:pt-40 md:pb-32 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <p className="text-[length:var(--text-caption)] uppercase tracking-widest text-muted mb-8">
              {o.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[length:var(--text-h1)] text-ink mb-8">
              {o.hero.heading}
            </h1>
            <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {o.hero.subheading}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Services ─────────────────────────────────────────── */}
      <div className="border-t border-line">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5 mb-8 lg:mb-0">
                <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink">
                  {o.services.heading}
                </h2>
              </div>
              <div className="lg:col-span-6 lg:col-start-7">
                <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                  {o.services.description}
                </p>
              </div>
            </div>
          </Section>
        </Container>
      </div>

      {/* ── Zones ────────────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5 mb-8 lg:mb-0">
              <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-4">
                {o.zones.heading}
              </h2>
              <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                {o.zones.description}
              </p>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <ul className="divide-y divide-line">
                {o.zones.wilayas.map((wilaya) => (
                  <li
                    key={wilaya}
                    className="py-4 text-[length:var(--text-body)] text-ink-soft"
                  >
                    {wilaya}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </Container>

      {/* ── NAP ──────────────────────────────────────────────── */}
      <div className="border-t border-line bg-cream-deep">
        <Container>
          <Section tight>
            <h2 className="font-display text-[length:var(--text-h3)] font-medium tracking-[-0.01em] text-ink mb-8">
              {o.nap.heading}
            </h2>
            <div className="lg:grid lg:grid-cols-3 gap-8 text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
              <address className="not-italic">
                {o.nap.address}
              </address>
              <a
                href={`tel:${o.nap.phone.replace(/\s/g, "")}`}
                className="hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)]"
              >
                {o.nap.phone}
              </a>
              <a
                href={`mailto:${o.nap.email}`}
                className="hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)]"
              >
                {o.nap.email}
              </a>
            </div>
          </Section>
        </Container>
      </div>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-6">
                {o.cta.heading}
              </h2>
              <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] mb-8">
                {o.cta.description}
              </p>
              <Button href={`/${lang}/contact`}>{o.cta.button}</Button>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
