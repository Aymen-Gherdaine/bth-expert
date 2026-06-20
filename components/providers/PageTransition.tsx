"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// Transition d'entrée à chaque changement de route, en GSAP (remplace
// framer-motion / AnimatePresence). Le contenu glisse depuis le bord de
// lecture — miroir en RTL (arabe).
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const el = ref.current;
      if (!el) return;

      const rtl = pathname.startsWith("/ar");
      gsap.fromTo(
        el,
        { opacity: 0, x: rtl ? -24 : 24 },
        { opacity: 1, x: 0, duration: 0.38, ease: "expo.out" }
      );
    },
    { dependencies: [pathname], scope: ref }
  );

  return (
    <div ref={ref} style={{ minHeight: "inherit" }}>
      {children}
    </div>
  );
}
