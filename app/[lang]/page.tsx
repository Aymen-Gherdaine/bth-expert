import { getDictionary, validateLocale } from "@/lib/i18n";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-display font-medium mb-6">
          BTH <em className="text-gold italic">Expert</em>
        </h1>
        <p className="text-muted text-lg mb-2">
          Langue active : <strong className="text-ink">{lang}</strong>
        </p>
        <p className="text-muted text-sm">{dict.metadata.homeDescription}</p>
      </div>
    </main>
  );
}