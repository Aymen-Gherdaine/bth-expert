# BTH Expert — Contexte projet pour Claude Code

Site vitrine premium pour **BTH Expert**, bureau d'études environnemental agréé en Algérie, basé à Oran. Objectif : SEO maximal (Google + moteurs IA) + UX niveau cabinet premium.

## Stack

- Next.js 16 (App Router, SSG) + TypeScript + Tailwind v4
- Framer Motion pour les animations
- Keystatic CMS (git-based, content/ en markdown)
- Déploiement Netlify
- Polices : Cormorant Garamond (titres) + DM Sans (corps)
- Couleurs : `#1a2e1e` (vert), `#C9A96E` (or), `#F5F0E8` (crème)

## Règles de travail non négociables

1. **Une tâche = un commit.** Pas de scope creep. Voir `TODO.md` pour la tâche en cours.
2. **`npm run build` doit passer avec 0 erreur et 0 warning** avant chaque commit.
3. **Jamais `"use client"` sur les pages de contenu.** Server Components par défaut. Client Components réservés aux interactions (menu, form). Une page rendue client = SEO mort.
4. **Lire avant de modifier.** Voir le fichier existant avant de toucher.
5. **Changements minimaux.** Pas de refactor non demandé.
6. **TypeScript strict.** Zéro `any`. Types Keystatic générés.
7. **Pas de secret dans le code.** Variables d'env Netlify pour clé Anthropic et autres.

## Architecture i18n (FR + AR + EN)

- Routing : `app/[lang]/...` avec `lang ∈ { fr, ar, en }`
- **FR = source unique.** Le client n'écrit qu'en français (dans Keystatic).
- AR et EN auto-générés au commit via GitHub Action + API Anthropic (Phase 3).
- RTL géré via propriétés logiques Tailwind (`ps-`, `pe-`, `ms-`, `me-`).
- Balises `hreflang` dans `generateMetadata()`.

## SEO — règles structurelles

- `generateMetadata()` sur chaque page (title, description, canonical, OG, hreflang).
- JSON-LD via `lib/schema.ts` selon le type de page (Service, FAQPage, Article, Person, LocalBusiness).
- Sitemap dynamique `app/sitemap.ts` (3 langues).
- `next/image` partout, jamais `<img>`.

## Données de référence (NAP — identique partout)

```
Email:     info@bthexpert.dz
Téléphone: +213 (670) 70 81 38
Adresse:   40, Lotissement 119, Bir El Djir, Oran, Algérie
Fondé:     2026
Experts:   Amine Lahmer (Co-fondateur & Gérant)
Partenaire: BTH Consult
```

## Fichiers à ne jamais modifier sans permission explicite

- `next.config.ts` (config core)
- `.env*` (jamais commit)
- `keystatic.config.ts` une fois en production

## Documents de référence

- `docs/ARCHITECTURE.md` — blueprint complet, décisions, justifications
- `TODO.md` — tâches actives par phase

## Workflow Claude Code

- Plan Mode (Shift+Tab) par défaut pour toute tâche non triviale
- `/compact` aux frontières de phase
- Toujours vérifier `TODO.md` avant de commencer
