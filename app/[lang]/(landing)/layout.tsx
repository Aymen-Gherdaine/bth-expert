import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { validateLocale } from "@/lib/i18n";

export default async function LandingLayout({
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
      <Header lang={lang} overlay />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}
