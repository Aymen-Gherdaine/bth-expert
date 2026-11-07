import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { locales, isRtl, getDictionary, validateLocale } from "@/lib/i18n";
import { buildMetadata } from "@/lib/seo";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CursorFollower } from "@/components/interaction/CursorFollower";

// Une seule superfamille pour les trois langues : IBM Plex Sans porte les
// titres (graisse 300) et le corps (400/500), Plex Mono les références
// réglementaires (« 06-198 », années, numéros d'ordre), Plex Sans Arabic
// prend le relais en AR. Pas d'italique chargé : l'emphase se fait par la
// graisse, ce qui reste cohérent avec l'arabe qui n'a pas d'italique.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

// Arabe : Plex Sans et Plex Mono n'embarquent aucune glyphe arabe. IBM Plex
// Sans Arabic prend le relais via les variables --font-display / --font-sans
// redéfinies sous [lang="ar"] dans globals.css. L'unicode-range arabe fait
// que le navigateur ne télécharge la police que sur les pages /ar — à
// condition de ne PAS la précharger : un <link rel="preload"> ignore
// l'unicode-range et forçait les 5 fichiers (~176 KB) sur chaque page FR/EN,
// en concurrence avec le CSS et l'image LCP. Sur /ar, elle est découverte
// via le CSS (display: swap), coût limité à cette locale.
const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
  display: "swap",
  preload: false,
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
      className={`${plexSans.variable} ${plexMono.variable} ${ibmArabic.variable}`}
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
        {children}
      </body>
    </html>
  );
}