import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaPerson } from "@/lib/schema";
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
    path: "/equipe",
    title: dict.equipe.meta.title,
    description: dict.equipe.meta.description,
  });
}

export default async function EquipePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const eq = dict.equipe;

  const jsonLd = schemaPerson({
    name: "Amine Lahmer",
    jobTitle: "Gérant — Expert environnement",
    url: `https://bthexpert.com/${lang}/equipe`,
    description:
      "Ingénieur en environnement, fondateur et gérant de BTH Expert depuis 2009. Expert EIE et EDD agréé par le Ministère de l'Environnement algérien.",
  });

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
              {eq.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[length:var(--text-h1)] text-ink mb-8">
              {eq.hero.heading}
            </h1>
            <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] max-w-2xl">
              {eq.hero.subheading}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Members ──────────────────────────────────────────── */}
      <div className="border-t border-line">
        <Container>
          {eq.members.map((member, index) => (
            <Section key={member.name} tight={index > 0}>
              <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                <div className="lg:col-span-4 mb-8 lg:mb-0">
                  <div className="w-16 h-16 rounded-sm bg-cream-deep border border-line mb-6 flex items-center justify-center">
                    <span className="font-display text-[length:var(--text-h3)] text-muted font-medium">
                      {member.name.charAt(0)}
                    </span>
                  </div>
                  <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink mb-2">
                    {member.name}
                  </h2>
                  <p className="text-[length:var(--text-small)] text-muted mb-6">
                    {member.role}
                  </p>
                  <ul className="space-y-2">
                    {member.credentials.map((cred) => (
                      <li
                        key={cred}
                        className="text-[length:var(--text-caption)] uppercase tracking-widest text-muted border-l-2 border-line ps-3"
                      >
                        {cred}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="lg:col-span-7 lg:col-start-6">
                  <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                    {member.bio}
                  </p>
                </div>
              </div>
            </Section>
          ))}
        </Container>
      </div>

      {/* ── Partner ──────────────────────────────────────────── */}
      <div className="border-t border-line bg-cream-deep">
        <Container>
          <Section tight>
            <div className="lg:grid lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-4 mb-8 lg:mb-0">
                <h2 className="font-display text-[length:var(--text-h2)] font-medium tracking-[-0.02em] leading-[1.15] text-ink">
                  {eq.partner.heading}
                </h2>
              </div>
              <div className="lg:col-span-7 lg:col-start-6">
                <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7]">
                  {eq.partner.description}
                </p>
              </div>
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
                {eq.cta.heading}
              </h2>
              <p className="text-[length:var(--text-body)] text-ink-soft leading-[1.7] mb-8">
                {eq.cta.description}
              </p>
              <Button href={`/${lang}/contact`}>{eq.cta.button}</Button>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
