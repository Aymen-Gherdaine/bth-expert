"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className="nav-link relative text-[1rem] font-medium tracking-[0.01em] text-ink-soft hover:text-ink transition-colors duration-[var(--duration-base)] ease-[var(--ease-out-expo)]"
    >
      {children}
    </Link>
  );
}
