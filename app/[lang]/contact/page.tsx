import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/ui/Section";
import { ContactForm } from "@/components/ui/ContactForm";

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
    path: "/contact",
    title: dict.contact.meta.title,
    description: dict.contact.meta.description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const c = dict.contact;
  const jsonLd = schemaLocalBusiness();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <Container>
        <div className="pt-32 pb-16 md:pt-40 md:pb-24 lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <p className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-8">
              {c.hero.eyebrow}
            </p>
            <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.05] text-[var(--text-h1)] text-ink mb-8">
              {c.hero.heading}
            </h1>
            <p className="text-[var(--text-body)] text-ink-soft leading-[1.7]">
              {c.hero.subheading}
            </p>
          </div>
        </div>
      </Container>

      {/* ── Form + Info ───────────────────────────────────────── */}
      <Container>
        <Section tight>
          <div className="lg:grid lg:grid-cols-12 lg:gap-16">
            {/* Form */}
            <div className="lg:col-span-7 mb-16 lg:mb-0">
              <ContactForm dict={c.form} lang={lang} />
            </div>

            {/* Contact info */}
            <div className="lg:col-span-4 lg:col-start-9">
              <h2 className="font-display text-[var(--text-h3)] font-medium tracking-[-0.01em] text-ink mb-8">
                {c.info.heading}
              </h2>
              <dl className="space-y-6 text-[var(--text-body)] text-ink-soft leading-[1.7]">
                <div>
                  <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-1">
                    Téléphone
                  </dt>
                  <dd>
                    <a
                      href={`tel:${c.info.phone.replace(/\s/g, "")}`}
                      className="hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)]"
                    >
                      {c.info.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-1">
                    Email
                  </dt>
                  <dd>
                    <a
                      href={`mailto:${c.info.email}`}
                      className="hover:text-brand transition-colors duration-300 ease-[var(--ease-out-expo)]"
                    >
                      {c.info.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-1">
                    Adresse
                  </dt>
                  <dd>
                    <address className="not-italic">{c.info.address}</address>
                  </dd>
                </div>
                <div>
                  <dt className="text-[var(--text-caption)] uppercase tracking-widest text-muted mb-1">
                    Horaires
                  </dt>
                  <dd>{c.info.hours}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Section>
      </Container>
    </>
  );
}
