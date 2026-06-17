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
    "/((?!_next|api|admin|.*\\..*).*)",
  ],
};