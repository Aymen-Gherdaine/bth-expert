"use client";

import { motion } from "framer-motion";

const ITEMS = [
  "Agréé Ministère de l'Environnement",
  "Fondé en 2009",
  "Oran, Algérie",
  "Études d'impact environnemental",
  "Études de dangers industriels",
  "Conformité réglementaire",
  "Management HSE",
  "BTH Consult — Partenaire stratégique",
];

export function Marquee() {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div
      className="border-y border-line py-4 overflow-hidden select-none"
      aria-hidden
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: "-50%" }}
        transition={{ duration: 45, ease: "linear", repeat: Infinity }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-8 pe-8 text-[var(--text-caption)] uppercase tracking-widest text-muted"
          >
            {item}
            <span className="text-gold text-base leading-none">·</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
