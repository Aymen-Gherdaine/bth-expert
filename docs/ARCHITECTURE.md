# BTH Expert — Blueprint Technique & Stratégique

> Document de référence à suivre avant d'écrire la moindre ligne de code.
> Objectif : site de niveau cabinet premium, SEO maximal (Google + IA), sécurisé, maintenable.
> Auteur : Aymen Gherdaine · Mai 2026

---

## Données de référence de l'entité (source de vérité NAP)

Ces données doivent être **identiques partout** : site, Schema.org, Google Business Profile, annuaires. Toute divergence pénalise le SEO local.

```
Nom:        BTH Expert
Partenaire: BTH Consult (cité comme partenaire)
Email:      info@bthexpert.dz
Téléphone:  +213 (670) 70 81 38
Adresse:    40, Lotissement 119, Bir El Djir, Oran, Algérie
Fondé:      2009
Agrément:   Ministère de l'Environnement et de la Qualité de la Vie
Experts:    Amine Lahmer (Gérant), Abdellah (à compléter)
```

> ⚠️ Google affiche encore d'anciennes données en cache (ancienne adresse Alger, ancien "150+"). Un recrawl via Search Console est nécessaire pour rafraîchir — dépend de l'email business.

---

## 0. Principes directeurs

Avant toute décision technique, ces principes tranchent les arbitrages :

1. **Le contenu doit exister dans le HTML au moment du crawl.** Tout ce qui est rendu côté navigateur est invisible pour Google. Règle non négociable : génération statique par défaut.
2. **Une page = un objectif = un mot-clé.** Pas de page fourre-tout. Chaque URL répond à une intention de recherche précise.
3. **La sécurité n'est pas une étape finale.** Validation des entrées, secrets hors du code, headers HTTP : pensés dès l'architecture.
4. **Le design sert la conversion, pas l'ego.** Premium = clarté, hiérarchie, confiance. Pas de complexité gratuite.
5. **Tout ce qui est répété doit être automatisé.** Sitemap, métadonnées, articles de blog : générés, jamais maintenus à la main.

---

## 1. Stack technique — décisions et justifications

| Couche | Choix | Pourquoi ce choix |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | Stack déjà maîtrisé, cohérent avec BTH Hub. SSG natif = SEO maximal. |
| Langage | **TypeScript** | Sécurité de typage, refactoring sûr, standard senior. |
| Styles | **Tailwind CSS v4** | Cohérent avec BTH Hub. Design tokens centralisés. |
| Design system | docs/DESIGN-MANIFESTO.md | Loi du système. À relire avant toute décision visuelle. |
| Animations | **Framer Motion** | Animations premium (spring, blur, easing custom). |
| Contenu | **Decap CMS → Markdown/MDX (git-based)** | Le CMS écrit du markdown dans le repo → Next.js build des pages statiques. Pas de base de données à sécuriser. |
| Rendu | **SSG (`generateStaticParams` + Server Components)** | HTML complet au build = Google reçoit tout. |
| Hébergement | **Netlify** | Déjà en place, supporte Next.js nativement, build automatique sur push. |
| Formulaire contact | **Netlify Forms + serverless function** | Pas de backend à maintenir, anti-spam intégré. |
| Agent IA blog | **Fonction planifiée (scheduled function) + API Anthropic** | Clé API côté serveur uniquement, jamais exposée. |

**Décision critique — rendu :** chaque page de contenu est un **Server Component** généré statiquement. `"use client"` est réservé aux micro-interactions (menu mobile, carrousel). Si une page de service est rendue côté client, le SEO est mort. C'est la règle qui prime sur tout.

**Pourquoi pas Astro ?** Techniquement supérieur pour un site contenu pur (zéro JS par défaut), mais le coût d'apprentissage et la rupture avec le stack BTH Hub ne se justifient pas. Next.js bien configuré atteint le même niveau SEO. Choix pragmatique, pas dogmatique.

---

## 2. Architecture du système

### 2.1 Séparation des responsabilités (couches)

```
┌─────────────────────────────────────────────┐
│  PRÉSENTATION                                  │
│  app/ — pages, layouts (Server Components)     │
│  components/ — UI réutilisable                 │
├─────────────────────────────────────────────┤
│  CONTENU                                       │
│  content/ — markdown/MDX (services, blog...)   │
│  Géré via Decap CMS (git-based)                │
├─────────────────────────────────────────────┤
│  LOGIQUE                                        │
│  lib/ — parsing markdown, SEO, schema, utils   │
├─────────────────────────────────────────────┤
│  SEO / MÉTADONNÉES                              │
│  generateMetadata(), sitemap.ts, robots.ts     │
│  lib/schema.ts — JSON-LD par type de page      │
├─────────────────────────────────────────────┤
│  ACTIONS                                        │
│  netlify/functions/ — formulaire, agent blog   │
└─────────────────────────────────────────────┘
```

### 2.2 Flux de données

**Contenu statique (services, pages, blog) :**
```
Decap CMS / Agent IA → écrit markdown dans content/
   → git commit → Netlify détecte le push
   → next build → pages HTML statiques
   → Google crawle du HTML complet
```

**Formulaire de contact :**
```
Utilisateur → formulaire → Netlify Function
   → validation + anti-spam → email vers contact@bthexpert.com
```

**Agent IA blog (mensuel) :**
```
Scheduled Function (1×/mois) → API Anthropic
   → génère article markdown → commit dans content/blog/
   → status: draft → notification email pour validation
   → validation humaine → status: published → rebuild
```

Le principe clé : **rien n'est dynamique au runtime côté serveur pour le contenu**. Tout est pré-construit. Le seul code serveur qui tourne en direct, c'est le formulaire et l'agent planifié.

---

## 3. Architecture de l'information (URL & navigation)

### 3.1 Structure des URLs

```
/                                          Accueil
/services/                                 Liste des services
/services/etude-impact-environnemental/    EIE — mot-clé principal
/services/etude-de-dangers/                EDD
/services/audit-environnemental/           Audit
/services/conformite-reglementaire/        Conformité
/services/hse/                             HSE
/secteurs/                                 Liste des secteurs
/secteurs/industrie-petrochimie/
/secteurs/pharmaceutique/
/secteurs/agroalimentaire/
/secteurs/btp-infrastructure/
/equipe/                                   Amine + experts (E-E-A-T)
/projets/                                  Études de cas
/projets/[slug]/                           Cas détaillé
/blog/                                     Blog
/blog/[slug]/                              Article
/oran/                                     SEO local Oran (prioritaire)
/alger/                                    SEO local Alger
/a-propos/                                 Histoire, agrément, valeurs
/contact/                                  Contact + carte
```

### 3.2 Pages de SEO local — hors navigation principale

`/oran` (et `/alger` plus tard) sont des **pages porte d'entrée** conçues pour la recherche locale, pas pour la navigation. Mettre "Oran" dans la navbar n'a aucun sens pour un client.

- ✅ Liées depuis le **footer** (section "Zones d'intervention")
- ✅ Liées depuis **Contact** et **À propos**
- ✅ Présentes dans le **sitemap.xml**
- ❌ **Jamais** dans la navbar principale

L'utilisateur arrive dessus via Google, pas via le menu.

### 3.3 Règles d'URL (non négociables pour le SEO)

- Minuscules, mots séparés par tirets, jamais d'underscore ni d'accent
- Pas de paramètres (`?id=`), URLs propres et descriptives
- Une URL ne change jamais après publication (sinon redirection 301 obligatoire)
- Profondeur max 2 niveaux : `/services/eie/` oui, `/services/etudes/environnement/eie/` non

### 3.4 Maillage interne

Chaque page de service lie vers : les secteurs concernés, la page Oran/Alger, 1–2 articles de blog liés, la page contact. Le maillage interne distribue l'autorité et guide Google. C'est sous-estimé et gratuit.

---

## 4. Stratégie SEO

### 4.1 SEO technique (au niveau code)

| Élément | Implémentation Next.js |
|---|---|
| Métadonnées par page | `export async function generateMetadata()` dans chaque page |
| Sitemap dynamique | `app/sitemap.ts` — généré au build, inclut toutes les pages |
| Robots | `app/robots.ts` |
| Schema.org | `lib/schema.ts` — fonction par type (Service, Article, FAQ, Person, LocalBusiness) |
| Canonical | Dans `generateMetadata`, `alternates.canonical` |
| Open Graph | Centralisé dans `lib/seo.ts`, hérité par défaut |
| Images | `next/image` — lazy loading, formats modernes, dimensions explicites |
| Core Web Vitals | SSG + images optimisées + zéro JS inutile |

### 4.2 Schema.org par type de page

- **Accueil + /contact** → `LocalBusiness` / `ProfessionalService`
- **Pages services** → `Service` + `FAQPage`
- **Articles blog** → `Article` + `BreadcrumbList`
- **Page équipe** → `Person` (un par expert)
- **Études de cas** → `Article` ou `CreativeWork`

### 4.3 SEO local (le plus rentable en Algérie)

- Fiche Google Business Profile Oran vérifiée (bloqué par email business)
- Pages `/oran/` et `/alger/` avec contenu géociblé réel
- Cohérence NAP (Nom/Adresse/Téléphone) identique partout : site, GBP, annuaires
- Inscription annuaires : me.gov.dz, environnement-algerie.com, pagesjaunes.dz
- Schema `LocalBusiness` avec `address` et `areaServed`

### 4.4 SEO pour moteurs IA (ChatGPT, Perplexity, Claude)

- Contenu factuel et structuré (les IA citent les sources claires)
- FAQ sur chaque page de service (extraites directement par les IA)
- Page équipe avec experts nommés et qualifiés (signal d'autorité fort)
- Références réglementaires exactes (décret 07-144, loi 03-10)
- JSON-LD riche avec `@graph` et `@id` liés
- À moyen terme : entrée Wikidata pour l'entité BTH Expert

### 4.5 Stratégie de contenu

- 1 page par service (600–1200 mots, FAQ, réglementation, méthodologie)
- Blog : 1 article/mois généré par agent IA, validé humainement
- Études de cas réelles (anonymisées si besoin)
- Calendrier éditorial 12 mois déjà défini

### 4.6 Multilingue FR + AR + EN avec traduction automatique

**Décision :** site trilingue. Le français est la langue source. L'arabe et l'anglais sont **générés automatiquement** — le client n'écrit jamais qu'en français.

**Pourquoi 3 langues :** avantage concurrentiel réel en Algérie. FR (B2B technique, administrations), AR (gros volume de recherche ignoré par les concurrents, langue officielle), EN (multinationales, investisseurs). Personne dans le secteur ne l'offre.

**Architecture de traduction — au commit, pas au runtime :**

```
1. Client édite content/fr/services/eie.md (via Decap CMS)
        ↓ git commit + push
2. GitHub Action détecte le fichier FR modifié
        ↓
3. Script (scripts/translate.ts) appelle l'API Anthropic
   → FR → AR  (avec glossaire métier)
   → FR → EN
        ↓
4. Écrit + commit content/ar/... et content/en/...
        ↓
5. Netlify build → /fr/... /ar/... /en/ en HTML statique + hreflang
        ↓
6. Google indexe les 3 versions complètes
```

**Pourquoi cette approche :**
- Zéro effort client (il ne touche que le FR)
- Traduit uniquement ce qui change (coût API minimal)
- HTML statique par langue = SEO maximal
- Traductions versionnées dans Git = corrigeables une fois pour toutes
- Glossaire métier dans le prompt (EIE = دراسة التأثير البيئي, etc.) pour la précision juridique

**Défi séparé — RTL arabe :** géré par le design, pas la traduction. Tailwind v4 + propriétés logiques (`ps-`, `pe-`, `ms-`, `me-`). Interface RTL-ready dès le départ.

**Balises hreflang :** chaque page déclare ses équivalents dans les autres langues via `alternates.languages` dans `generateMetadata`.

**Structure URL :** `app/[lang]/...` avec `lang` ∈ `{ fr, ar, en }`. FR par défaut.

---

## 5. Sécurité

Même un site vitrine a une surface d'attaque. Mesures dès le départ :

### 5.1 Secrets et variables d'environnement

- Clé API Anthropic (agent blog) → variable d'environnement Netlify, **jamais** dans le code ni le repo
- `.env.local` dans `.gitignore` (vérifier qu'il y est déjà)
- Aucune clé exposée côté client (préfixe `NEXT_PUBLIC_` réservé au strictement public)

### 5.2 Formulaire de contact

- Validation côté serveur (jamais faire confiance au client)
- Anti-spam : honeypot + Netlify Forms (détection native) ou hCaptcha
- Rate limiting sur la fonction serverless
- Échappement des entrées avant envoi email (prévention injection)

### 5.3 Headers HTTP (dans `netlify.toml`)

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
    Content-Security-Policy = "default-src 'self'; ..."
```

### 5.4 Panneau admin (Decap CMS)

- Netlify Identity avec invitation manuelle uniquement (pas d'inscription publique)
- `/admin` protégé par authentification
- 2FA recommandé pour les comptes éditeurs

### 5.5 Agent IA blog

- Tourne en fonction serveur planifiée, jamais déclenchable publiquement
- Génère du **draft**, jamais de publication directe sans validation humaine
- Logs des générations pour audit

---

## 6. Design System & UX (niveau cabinet premium)

### 6.1 Identité visuelle (déjà définie)

```
Couleurs:
  --green:  #1a2e1e   (vert forêt — fonds sombres, autorité)
  --gold:   #C9A96E   (or — accents, élégance)
  --cream:  #F5F0E8   (crème — fonds clairs, respiration)
  --white:  #FFFFFF

Typographie:
  Display:  Fraunces (variable, Google Fonts, opsz axis)
  Body:     Geist (Google Fonts, weights 400/500)
  Voir docs/DESIGN-MANIFESTO.md section 3 pour le système complet.
```

### 6.2 Principes UX premium

- **Hiérarchie typographique forte** : titres clamp 2.5rem–5rem, letter-spacing négatif, line-height serré
- **Espace blanc généreux** : le luxe se manifeste par la respiration, pas le remplissage
- **Animations subtiles** : Framer Motion — fade + translate avec spring et easing custom, jamais de fade-in basique
- **Scroll storytelling** : révélation progressive du contenu au scroll
- **Confiance avant tout** : agrément visible, experts nommés, projets réels, chiffres vérifiables
- **Mobile-first** : la majorité des recherches B2B en Algérie se font sur mobile

### 6.3 Design tokens (centralisés)

Tous les tokens (couleurs, espacements, rayons, ombres, durées d'animation) dans `tailwind.config` et `app/globals.css`. Aucune valeur en dur dans les composants. Un changement = un seul endroit.

### 6.4 Composants réutilisables

```
components/
  layout/        Header, Footer, Nav
  ui/            Button, Card, Badge, Section
  sections/      Hero, ServiceGrid, FAQ, CTA, Stats
  seo/           SchemaScript, Breadcrumbs
```

---

## 7. Structure des fichiers (arborescence cible)

```
bthexpert-website/
├── app/
│   ├── layout.tsx                    Layout racine (html, providers)
│   ├── globals.css                   Tokens + base styles + RTL
│   ├── sitemap.ts                    Sitemap dynamique (3 langues)
│   ├── robots.ts                     Robots
│   └── [lang]/                       Routing i18n (fr | ar | en)
│       ├── layout.tsx                Header, footer, dir=rtl si ar
│       ├── page.tsx                  Accueil
│       ├── services/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── secteurs/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── equipe/page.tsx
│       ├── projets/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── blog/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── oran/page.tsx             SEO local (footer, pas navbar)
│       ├── a-propos/page.tsx
│       └── contact/page.tsx
├── components/
│   ├── layout/                       Header, Footer, Nav, LangSwitcher
│   ├── ui/                           Button, Card, Badge, Section
│   ├── sections/                     Hero, ServiceGrid, FAQ, CTA, Stats
│   └── seo/                          SchemaScript, Breadcrumbs
├── content/
│   ├── fr/                           ← Source unique (Decap CMS)
│   │   ├── services/
│   │   ├── secteurs/
│   │   ├── projets/
│   │   └── blog/
│   ├── ar/                           ← Auto-généré, ne pas éditer
│   └── en/                           ← Auto-généré, ne pas éditer
├── lib/
│   ├── content.ts                    Lecture/parsing markdown
│   ├── i18n.ts                       Config langues + dictionnaires UI
│   ├── seo.ts                        Helpers métadonnées + hreflang
│   ├── schema.ts                     Générateurs JSON-LD
│   └── utils.ts
├── dictionaries/                     Traductions UI (boutons, nav...)
│   ├── fr.json
│   ├── ar.json
│   └── en.json
├── scripts/
│   └── translate.ts                  Traduction FR → AR/EN (API Anthropic)
├── .github/workflows/
│   └── translate.yml                 Déclenché sur push content/fr/**
├── public/
│   ├── images/
│   └── og-image.jpg
├── netlify/functions/
│   ├── contact.ts                    Formulaire sécurisé
│   └── generate-article.ts           Agent IA blog (planifié)
├── admin/                            Decap CMS (config.yml → content/fr uniquement)
├── netlify.toml                      Build + headers sécurité
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── docs/
    └── ARCHITECTURE.md               Ce document
```

---

## 8. Plan de phases (ordre d'exécution)

### Phase 0 — Fondations (avant tout code de page)
- [ ] Setup projet Next.js 16 + TS + Tailwind v4 sur nouvelle branche
- [ ] Design tokens + globals.css (RTL-ready)
- [ ] Routing i18n `app/[lang]/` + `lib/i18n.ts` + dictionnaires
- [ ] Layout racine + layout `[lang]` (dir=rtl si arabe)
- [ ] `lib/seo.ts` (hreflang), `lib/schema.ts`, `lib/content.ts`
- [ ] `app/sitemap.ts` (3 langues), `app/robots.ts`
- [ ] `netlify.toml` avec headers sécurité

### Phase 1 — Pages prioritaires SEO (en FR)
- [ ] Accueil
- [ ] `/oran/` (rank le plus vite)
- [ ] `/services/etude-impact-environnemental/` (mot-clé principal)
- [ ] `/equipe/` (E-E-A-T)
- [ ] `/contact/` avec formulaire sécurisé

### Phase 2 — Complétude contenu (en FR)
- [ ] Reste des pages services
- [ ] Pages secteurs
- [ ] `/a-propos/`
- [ ] Études de cas

### Phase 3 — Blog, automatisation & traduction
- [ ] Système de blog (markdown → pages)
- [ ] Decap CMS configuré (content/fr uniquement)
- [ ] Agent IA de génération d'articles
- [ ] **Système de traduction auto FR → AR/EN** (script + GitHub Action + glossaire)
- [ ] Versions AR et EN générées et indexées
- [ ] Premier article publié

### Phase 4 — Lancement & mesure
- [ ] Email business → Google Search Console
- [ ] Google Business Profile Oran
- [ ] Soumission sitemap
- [ ] Inscription annuaires
- [ ] Mesure baseline et suivi

---

## 9. Ce qui bloque quoi (dépendances critiques)

```
Email business
  ├── débloque → Google Search Console
  ├── débloque → Google Business Profile
  └── débloque → Annuaires officiels

Architecture Next.js (dans le contrôle d'Aymen)
  └── débloque → Toutes les pages → ranking sur mots-clés

Pages publiées + indexées
  └── débloque → Mesure réelle du progrès SEO
```

**Règle d'or :** ne jamais attendre une dépendance pour avancer sur ce qui est dans ton contrôle. Pendant que le client crée l'email, tu construis l'architecture.

---

*Fin du blueprint. À mettre à jour à chaque décision d'architecture majeure.*
