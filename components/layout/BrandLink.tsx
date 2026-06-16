"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";

interface BrandLinkProps {
  href: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * Header logo link. When already on the target route, a plain <Link> does
 * nothing (Next skips same-route navigation) and Lenis keeps its scroll
 * position — so the logo appeared dead. Intercept that case and smooth-scroll
 * to the top instead. Cross-route clicks fall through to Link; SmoothScroll
 * resets the scroll on the route change.
 */
export function BrandLink({ href, className, style, children }: BrandLinkProps) {
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== href) return; // let Next navigate
    e.preventDefault();
    const lenis = (window as unknown as { lenis?: Lenis }).lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Link href={href} className={className} style={style} onClick={handleClick}>
      {children}
    </Link>
  );
}
