import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n-config"; 

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // L'URL contient-elle déjà une locale ?
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Sinon : redirige vers /{defaultLocale}{pathname}
  const newUrl = new URL(
    `/${defaultLocale}${pathname === "/" ? "" : pathname}`,
    request.url
  );
  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: [
    // Ne s'applique pas aux assets statiques, API routes, admin Keystatic, etc.
    // ni aux URLs déjà préfixées par une locale : le proxy n'y fait rien, mais
    // il tourne en runtime Node, donc chaque requête matchée (documents ET
    // prefetchs RSC) passait par une fonction avant d'être servie.
    // Littéral statique imposé par Next : garder en phase avec `locales`
    // (lib/i18n-config.ts).
    "/((?!_next|api|keystatic|(?:fr|ar|en)(?:/|$)|.*\\..*).*)",
  ],
};