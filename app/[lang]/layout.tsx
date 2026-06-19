import type { Metadata } from "next";
import { Fraunces, Geist, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { locales, isRtl, getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { CursorFollower } from "@/components/interaction/CursorFollower";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-geist",
  display: "swap",
});

// Arabe : Fraunces et Geist n'embarquent aucune glyphe arabe. IBM Plex Sans
// Arabic prend le relais via les variables --font-display / --font-sans
// redéfinies sous [lang="ar"] dans globals.css. L'unicode-range arabe fait
// que le navigateur ne télécharge la police que sur les pages /ar.
const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dict = await getDictionary(lang);

  return {
    ...buildMetadata({
      lang,
      path: "/",
      title: dict.metadata.homeTitle,
      description: dict.metadata.homeDescription,
    }),
    title: {
      default: dict.metadata.homeTitle,
      template: "%s — BTH Expert",
    },
    icons: {
      icon: [
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: { url: "/apple-icon.png" },
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = validateLocale(rawLang);
  const dir = isRtl(lang) ? "rtl" : "ltr";
  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      dir={dir}
      className={`${fraunces.variable} ${geist.variable} ${ibmArabic.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[110] focus:px-4 focus:py-2 focus:bg-brand focus:text-cream focus:rounded-sm focus:text-sm focus:font-sans focus:font-medium"
        >
          {dict.nav.skipToContent}
        </a>
        <CursorFollower />
        <SmoothScroll />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}