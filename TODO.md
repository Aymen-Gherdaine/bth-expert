# BTH Expert — TODO actif

Liste de tâches atomiques par phase. **Une tâche = un commit.**
Cocher au fur et à mesure. Voir `docs/ARCHITECTURE.md` pour le pourquoi de chaque décision.

---

## 🟢 Phase 0 — Fondations techniques

> Objectif : structure du projet prête à recevoir du contenu, sans aucune page de contenu encore.

- [x] **0.1** — Scaffold Next.js 16 + TS + Tailwind v4 + branche `feat/architecture-base`
- [x] **0.2** — Design tokens dans `app/globals.css` (couleurs BTH, espacement, radius, shadows)
- [x] **0.3** — Polices : Cormorant Garamond + DM Sans via `next/font` dans le layout racine
- [x] **0.4** — Routing i18n : `app/[lang]/` + `lib/i18n.ts` + `dictionaries/{fr,ar,en}.json`
- [x] **0.5** — Layout racine + layout `[lang]` avec `dir="rtl"` conditionnel pour AR
- [x] **0.6** — `lib/seo.ts` : helpers `buildMetadata()` avec hreflang multilingue
- [x] **0.7** — `lib/schema.ts` : générateurs JSON-LD (LocalBusiness, Service, Article, Person, FAQPage)
- [x] **0.8** — `lib/content.ts` : parsing markdown + frontmatter (gray-matter + remark)
- [x] **0.9** — `app/sitemap.ts` : sitemap dynamique multilingue
- [x] **0.10** — `app/robots.ts` : autorise tout + référence sitemap
- [x] **0.11** — `netlify.toml` : build settings + headers de sécurité

**Sortie Phase 0 :** projet qui build, structure prête, aucune page de contenu encore.

---

## 🟢 Phase 1 — Pages prioritaires SEO (en français)

> Objectif : les 5 pages qui vont ranker en premier. Toutes en FR uniquement.

- [x] **1.1** — Composants layout : `Header`, `Footer`, `Nav`, `LangSwitcher`
- [x] **1.2** — Composants UI base : `Button`, `Card`, `Section`, `Container`, `Badge`
- [ ] **1.3** — Page **Accueil** (`/fr/`) : hero, stats, services preview, équipe preview, projets preview, CTA contact
- [ ] **1.4** — Page **`/fr/oran/`** (SEO local prioritaire — non navbar)
- [ ] **1.5** — Page **`/fr/services/etude-impact-environnemental/`** (mot-clé principal)
- [ ] **1.6** — Page **`/fr/equipe/`** (Amine + Abdellah, signal E-E-A-T)
- [ ] **1.7** — Page **`/fr/contact/`** (port du design actuel + form sécurisé serverless)
- [ ] **1.8** — JSON-LD complet sur chaque page (via `lib/schema.ts`)
- [ ] **1.9** — OG images générées par page (`opengraph-image.tsx`)

**Sortie Phase 1 :** site déployable avec les 5 pages SEO-prioritaires, prêt à indexer.

---

## 🟡 Phase 2 — Complétude contenu

- [ ] **2.1** — Pages services restantes : étude de dangers, audit, conformité, HSE
- [ ] **2.2** — Pages secteurs : pétrochimie, pharmaceutique, agroalimentaire, BTP
- [ ] **2.3** — Page **`/fr/a-propos/`** : histoire, agrément, partenariat BTH Consult
- [ ] **2.4** — Études de cas : 2 à 3 projets détaillés avec page dédiée
- [ ] **2.5** — Page **`/fr/projets/`** : liste avec filtres par secteur

**Sortie Phase 2 :** contenu complet en français.

---

## 🟡 Phase 3 — CMS, blog & traduction auto

- [ ] **3.1** — Installation Keystatic + intégration Next.js
- [ ] **3.2** — Schémas Keystatic : services, secteurs, projets, équipe, blog
- [ ] **3.3** — Système de blog : pages dynamiques `[slug]`, listing, pagination
- [ ] **3.4** — Agent IA blog : Netlify scheduled function (mensuel) + API Anthropic + draft mode
- [ ] **3.5** — Script `scripts/translate.ts` : FR → AR + EN via API Anthropic avec glossaire métier
- [ ] **3.6** — GitHub Action `.github/workflows/translate.yml` : déclenchée sur push `content/fr/**`
- [ ] **3.7** — Test traduction complète sur 1 article + 1 page service
- [ ] **3.8** — Génération + publication du premier article validé

**Sortie Phase 3 :** site trilingue avec contenu auto-traduit, blog automatisé.

---

## 🟡 Phase 4 — Lancement & mesure

> Plusieurs tâches dépendent du **client** (email business, fiches, etc.).

- [ ] **4.1** — [CLIENT] Création email business `info@bthexpert.com` (Zoho Mail gratuit)
- [ ] **4.2** — Google Search Console : vérification domaine + soumission sitemap
- [ ] **4.3** — [CLIENT] Google Business Profile Oran : adresse réelle + agrément + photos
- [ ] **4.4** — [CLIENT] Inscription annuaires : me.gov.dz, environnement-algerie.com, pagesjaunes.dz
- [ ] **4.5** — Captures baseline Google : 5 mots-clés cibles avant indexation
- [ ] **4.6** — Migration DNS : bascule `bthexpert.com` vers le nouveau site
- [ ] **4.7** — Vérification post-lancement : Schema valide, hreflang, Core Web Vitals
- [ ] **4.8** — Mise en place tableau de suivi (impressions, positions, clics) mensuel

**Sortie Phase 4 :** site en production, indexé, mesuré.

---

## Légende

- 🟢 Phase en cours / proche
- 🟡 Phase à venir
- 🔵 Phase terminée
- `[CLIENT]` : action nécessitant l'intervention du client BTH Expert
