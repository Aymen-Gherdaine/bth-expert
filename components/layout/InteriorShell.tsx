import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { validateLocale } from "@/lib/i18n";

/**
 * Shared chrome for every interior (non-landing) page: solid header, the
 * sticky-footer reveal, scroll-to-top. The <main> is opaque + z-10 so it
 * slides over the sticky footer — and carries NO bottom padding, exactly like
 * the landing, so the last section (dark band or cream) meets the footer with
 * no cream gap.
 */
export default async function InteriorShell({
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
      <main className="relative z-10 bg-cream-soft">{children}</main>
      <Footer lang={lang} />
      <ScrollToTop lang={lang} />
    </>
  );
}
