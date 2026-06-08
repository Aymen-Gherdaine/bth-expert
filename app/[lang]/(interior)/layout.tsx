import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { validateLocale } from "@/lib/i18n";

export default async function InteriorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);

  return (
    <>
      <Header lang={lang} />
      <main className="flex-1 min-w-0">{children}</main>
      <Footer lang={lang} />
    </>
  );
}
