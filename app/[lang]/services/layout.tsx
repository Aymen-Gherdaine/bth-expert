import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { validateLocale } from "@/lib/i18n";

/**
 * Services layout — gives the (previously group-less) service pages a solid
 * header + footer, on a warm cream-soft canvas. Distinct from (interior),
 * so it does not touch that layout's in-progress work.
 */
export default async function ServicesLayout({
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
      {/* relative z-10 + opaque bg: slides over the sticky footer (reveal effect) */}
      <main className="flex-1 min-w-0 relative z-10 bg-cream-soft pb-40 lg:pb-56">
        {children}
      </main>
      <Footer lang={lang} />
      <ScrollToTop />
    </>
  );
}
