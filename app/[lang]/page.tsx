import { getDictionary, validateLocale } from "@/lib/i18n";
import { Container } from "@/components/layout/Container";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  return (
    <Container>
      <section className="py-24 md:py-32 max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-gold mb-6">
          {/* placeholder eyebrow */}
          BTH Expert · Oran · Algérie
        </p>
        <h1 className="text-5xl md:text-7xl font-display font-medium tracking-tight leading-[1.05] mb-8">
          Expertise <em className="text-gold italic">environnementale</em>
          <br />& industrielle
        </h1>
        <p className="text-lg text-ink-soft leading-relaxed">
          {dict.metadata.homeDescription}
        </p>
      </section>
    </Container>
  );
}