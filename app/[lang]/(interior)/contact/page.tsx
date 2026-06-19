import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness, schemaBreadcrumb } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactProcess } from "@/components/sections/ContactProcess";
import { RevealText } from "@/components/animations/RevealText";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { socialLinks } from "@/lib/social-links";
import Image from "next/image";

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

const captionCls =
  "block text-[length:var(--text-caption)] uppercase tracking-widest text-gold mb-1.5";

const valueLinkCls =
  "text-[length:var(--text-body)] text-ink leading-snug hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);
  const c = dict.contact;
  const jsonLd = schemaLocalBusiness(lang);
  const jsonLdBreadcrumb = schemaBreadcrumb(lang, [
    { name: dict.nav.contact, url: `https://bthexpert.com/${lang}/contact` },
  ]);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    c.info.address
  )}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Full-viewport contact: intro (left) + form card (right) ──
          Pure white canvas. The form stays entirely within the first
          screen on desktop — no scroll to read or fill it. ───────── */}
      <section className="bg-cream-warm flex items-center min-h-[calc(100svh-6.25rem)] lg:min-h-[calc(100svh-6.75rem)]">
        <Container className="w-full">
          <div className="py-12 lg:py-16 grid gap-12 lg:grid-cols-12 lg:gap-16 lg:items-center">
            {/* Left: intro */}
            <div className="lg:col-span-5">
              {/* Avatar cluster — team photos */}
              <div className="flex -space-x-3 mb-9">
                <span className="relative size-16 rounded-full ring-4 ring-cream-warm overflow-hidden">
                  <Image
                    src="/amine.jpg"
                    alt="Amine Lahmer"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
                <span className="relative size-16 rounded-full ring-4 ring-cream-warm overflow-hidden">
                  <Image
                    src="/abdellah.jpg"
                    alt="Abdellah"
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </span>
              </div>

              <span
                className="block font-sans uppercase text-gold mb-6"
                style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
              >
                — {c.hero.eyebrow}
              </span>
              <RevealText
                as="h1"
                className="font-display font-medium tracking-[-0.02em] leading-[1.02] text-[clamp(2.5rem,2.5vw+1.5rem,3.5rem)] text-ink mb-6"
              >
                {c.hero.headingStart}{" "}
                <em className="italic font-light text-gold">
                  {c.hero.headingEmphasis}
                </em>
              </RevealText>
              <p className="text-[1.0625rem] lg:text-[1.125rem] text-ink leading-[1.65] max-w-md mb-5">
                {c.hero.intro}
              </p>
              <p className="inline-flex items-center gap-2 text-[length:var(--text-small)] text-brand font-medium bg-[color-mix(in_srgb,var(--color-brand)_8%,transparent)] px-3 py-1.5 rounded-full mb-8">
                <span aria-hidden>✓</span> {c.form.responseTime}
              </p>

              <SectionReveal>
                <div aria-hidden className="h-px bg-line max-w-md mb-8" />
                <dl className="space-y-5 mb-9">
                  <div>
                    <dt className={captionCls}>{c.info.emailLabel}</dt>
                    <dd>
                      <a href={`mailto:${c.info.email}`} className={valueLinkCls}>
                        {c.info.email}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className={captionCls}>{c.info.phoneLabel}</dt>
                    <dd>
                      <a
                        href={`tel:${c.info.phone.replace(/\s/g, "")}`}
                        className={valueLinkCls}
                      >
                        {c.info.phone}
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className={captionCls}>{c.info.addressLabel}</dt>
                    <dd>
                      <a
                        href={mapsHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${valueLinkCls} inline-flex items-center gap-1.5`}
                      >
                        {c.info.address}
                        <span aria-hidden className="text-gold">→</span>
                      </a>
                    </dd>
                  </div>
                </dl>

                <div className="mb-6">
                  <a
                    href="https://wa.me/213670708138?text=Bonjour%20BTH%20Expert%2C%20je%20souhaite%20discuter%20d%27un%20projet."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-5 py-3 rounded-sm bg-[#25D366] text-white font-sans font-medium text-[0.9375rem] hover:opacity-90 transition-opacity duration-[var(--duration-base)]"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-5 shrink-0">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {c.form.whatsapp}
                  </a>
                </div>

                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="flex items-center justify-center size-10 rounded-full bg-brand text-cream hover:bg-gold hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden
                        className="size-4"
                      >
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </SectionReveal>
            </div>

            {/* Right: form card */}
            <div className="lg:col-span-6 lg:col-start-7">
              <ContactForm dict={c.form} lang={lang} />
            </div>
          </div>
        </Container>
      </section>

      {/* ── "À quoi s'attendre" process ────────────────────────── */}
      <ContactProcess dict={c.process} />
    </>
  );
}
