import type { Metadata } from "next";
import { getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { schemaLocalBusiness } from "@/lib/schema";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/ui/ContactForm";
import { ContactProcess } from "@/components/sections/ContactProcess";
import { RevealText } from "@/components/animations/RevealText";
import { SectionReveal } from "@/components/motion/SectionReveal";

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
  "block text-[var(--text-caption)] uppercase tracking-widest text-gold mb-1";

const valueLinkCls =
  "text-[var(--text-body)] text-ink-soft leading-[1.7] hover:text-brand transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]";

// TODO: real profile URLs once the client provides them (same as Footer)
const socialLinks = [
  {
    label: "LinkedIn",
    href: "#",
    path: "M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z",
  },
  {
    label: "Instagram",
    href: "#",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.88 5.88 0 0 0-2.13 1.39A5.88 5.88 0 0 0 .63 4.14C.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13a5.88 5.88 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.88 5.88 0 0 0 2.13-1.38 5.88 5.88 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.88 5.88 0 0 0-1.38-2.13A5.88 5.88 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z",
  },
  {
    label: "Facebook",
    href: "#",
    path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.02 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.09 24 18.1 24 12.07z",
  },
];

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

      {/* ── Form section: info column + form card ─────────────── */}
      <Container>
        <div className="pt-16 pb-20 md:pt-24 md:pb-28 lg:grid lg:grid-cols-12 lg:gap-16">
          {/* Left: info column */}
          <div className="lg:col-span-5 mb-16 lg:mb-0">
            <span
              className="block font-sans uppercase text-gold mb-8"
              style={{ fontSize: "var(--text-caption)", letterSpacing: "0.22em" }}
            >
              — {c.hero.eyebrow}
            </span>
            <RevealText
              as="h1"
              className="font-display font-medium tracking-[-0.02em] leading-[1.1] text-[var(--text-h1)] text-ink mb-8"
            >
              {c.hero.headingStart}{" "}
              <em className="italic font-light text-gold">
                {c.hero.headingEmphasis}
              </em>
            </RevealText>
            <p className="text-[var(--text-body)] text-muted leading-[1.7] max-w-md">
              {c.hero.intro}
            </p>

            <SectionReveal>
              <div aria-hidden className="h-px bg-line my-10 lg:my-12" />

              <dl className="space-y-7">
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
                    <address className="not-italic text-[var(--text-body)] text-ink-soft leading-[1.7]">
                      {c.info.address}
                    </address>
                  </dd>
                </div>
              </dl>

              <div className="flex gap-3 mt-10">
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
          <div className="lg:col-span-7">
            <ContactForm dict={c.form} lang={lang} />
          </div>
        </div>
      </Container>

      {/* ── "À quoi s'attendre" process ────────────────────────── */}
      <ContactProcess dict={c.process} />
    </>
  );
}
