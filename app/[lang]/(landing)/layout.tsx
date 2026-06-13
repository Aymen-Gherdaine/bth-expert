import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
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
      {/* relative z-10 + opaque bg: slides over the sticky footer (reveal effect) */}
      <main className="relative z-10 bg-cream">{children}</main>
      <Footer lang={lang} />
      <ScrollToTop />
    </>
  );
}
