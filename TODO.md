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

## 🔵 Phase 1 — Pages prioritaires SEO (en français)

> Objectif : les 5 pages qui vont ranker en premier. Toutes en FR uniquement.

- [x] **1.1** — Composants layout : `Header`, `Footer`, `Nav`, `LangSwitcher`
- [x] **1.2** — Composants UI base : `Button`, `Card`, `Section`, `Container`, `Badge`
- [x] **1.3** — Page **Accueil** (`/fr/`) : hero, stats, services preview, équipe preview, projets preview, CTA contact
- [x] **1.4** — Page **`/fr/oran/`** (SEO local prioritaire — non navbar)
- [x] **1.5** — Page **`/fr/services/etude-impact-environnemental/`** (mot-clé principal)
- [x] **1.6** — Page **`/fr/equipe/`** (Amine + Abdellah, signal E-E-A-T)
- [x] **1.7** — Page **`/fr/contact/`** (form sécurisé Netlify Forms + panel info)
- [x] **1.8** — JSON-LD complet sur chaque page (LocalBusiness, Service, Person)
- [x] **1.9** — OG images générées par page (`opengraph-image.tsx` au niveau `[lang]`)

**Sortie Phase 1 :** site déployable avec les 5 pages SEO-prioritaires, prêt à indexer.

---

## 🟢 Phase 2 — Complétude contenu

- [x] **2.1** — Pages services restantes : étude de dangers (EDD), audit HSE, plan de gestion (PGE)
- [x] **2.2** — Pages secteurs : industrie & pétrochimie, énergie & hydrocarbures, infrastructures & BTP, agriculture & hydraulique
- [x] **2.3** — Page **`/fr/a-propos/`** : histoire, agrément, partenariat BTH Consult
- [x] **2.4** — Études de cas : 3 projets détaillés avec page dédiée (contenu indicatif, à valider client)
- [x] **2.5** — Page **`/fr/projets/`** : liste avec filtres par secteur

**Sortie Phase 2 :** contenu complet en français.

---

## 🟡 Phase 3 — CMS, blog & traduction auto

- [x] **3.1** — Installation Keystatic + intégration Next.js
- [x] **3.2** — Schémas Keystatic : tous les champs texte du site (collections services/secteurs/projets/équipe/blog + singletons pour chaque page), génération de `dictionaries/fr.json` via `npm run content:sync` (lancé en `prebuild`)
- [x] **3.3** — Système de blog : pages dynamiques `[slug]`, listing, pagination
- [x] **3.4** — Agent IA blog : Netlify scheduled function (mensuel) + API Anthropic + draft mode
  - ⚠️ [CLIENT/CONFIG] Variables d'env à ajouter sur Netlify avant que ça tourne : `ANTHROPIC_API_KEY`, `BLOG_AGENT_GITHUB_TOKEN` (PAT GitHub, accès écriture au repo). Optionnel : `GITHUB_REPO`, `BLOG_AGENT_BRANCH`, `ANTHROPIC_MODEL`. Voir commentaire en tête de `netlify/functions/generate-blog-post.mts`.
  - ⚠️ [CLIENT/CONFIG] `BLOG_AGENT_GITHUB_TOKEN` créé le 2026-06-17 avec expiration à 366 jours → à régénérer avant le **2027-06-17**, sinon l'agent blog échoue silencieusement (la fonction tourne mais le commit GitHub échoue).
  - Sujets prédéfinis dans `netlify/functions/blog-topics.json` (12 sujets) — chaque exécution traite le premier sujet non encore présent dans `content/fr/blog/`.
  - Les articles générés arrivent en `status: draft` (jamais visibles publiquement) — à valider/publier depuis `/keystatic`.
  - Génération en deux passes (premier jet + relecture éditoriale) pour limiter le ton « IA générique » ; image de couverture par sujet (illustrations déjà existantes dans `/public/generated`, pas de génération d'image).
- [x] **3.4b** — Stockage Keystatic en mode `cloud` (Keystatic Cloud, projet `bth-expert/bth-expert`) au lieu de `local`, pour que `/keystatic` persiste réellement les modifications une fois déployé sur Netlify (le mode `local` écrit sur un disque qui ne survit pas aux fonctions serverless) et pour que le client édite le contenu **sans avoir besoin d'un compte GitHub** (authentification par email via cloud.keystatic.com, jusqu'à 3 utilisateurs gratuits par équipe).
  - Le chemin `/keystatic` (page et API) est codé en dur dans `@keystatic/core` quel que soit le mode de stockage choisi (vérifié pour `local`, `github` et `cloud`) — ne jamais le renommer en `/admin`.
  - ⚠️ `app/keystatic/[[...params]]/page.tsx` DOIT commencer par `"use client"`. Sans cette directive, Next.js 16 rend la page comme Server Component : l'import `Keystatic` est résolu via la condition d'export `react-server` (qui renvoie `null`), le serveur n'émet qu'un Suspense vide (`<div hidden>`) et le vrai bundle UI client n'est jamais chargé → page blanche. `@keystatic/next` n'a pas été mis à jour depuis février 2025 (Next 16 est sorti en octobre 2025), d'où cette régression à corriger côté app.
  - ⚠️ [CLIENT/CONFIG] Inviter le client comme membre de la team Keystatic Cloud (cloud.keystatic.com → team → invite par email) une fois le CMS testé et validé.
  - Aucune variable d'env Netlify requise pour Keystatic en mode `cloud` (l'auth passe par cloud.keystatic.com, pas par notre app). Les variables `KEYSTATIC_GITHUB_CLIENT_ID` / `KEYSTATIC_GITHUB_CLIENT_SECRET` / `KEYSTATIC_SECRET` posées précédemment pour le mode `github` ne sont plus utilisées — peuvent être retirées de Netlify (pas urgent, sans risque si laissées).
  - Le chemin `/keystatic` et `/api/keystatic` est codé en dur dans `@keystatic/core` (pas de préfixe configurable) — ne pas le renommer en `/admin` à nouveau, ça casserait l'auth GitHub.
- [x] **3.5** — Script `scripts/translate.ts` : FR → AR + EN via API Anthropic avec glossaire métier
  - Glossaire métier dans `scripts/glossary.json` (construit à partir des traductions déjà en place sur le site).
  - Régénère entièrement `dictionaries/{ar,en}.json` depuis `dictionaries/fr.json`, et traduit les articles de blog **publiés** (`status` ≠ `draft`) vers `content/{ar,en}/blog/`. N'écrase pas un article déjà traduit sauf `--force`.
- [x] **3.6** — GitHub Action `.github/workflows/translate.yml` : déclenchée sur push `content/fr/**` (branche `main`), commit auto des fichiers traduits.
  - ⚠️ [CLIENT/CONFIG] Ajouter le secret `ANTHROPIC_API_KEY` dans Settings → Secrets → Actions du repo GitHub (en plus de la variable d'env du même nom sur Netlify, utilisée par l'agent blog).
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

## 🟢 Phase 5 — Audit design : corrections & différenciation (sans photos)

> Issu de l'audit design du 2026-10-29. Objectif : sortir de l'esthétique « site généré 2025 »
> sans refonte visible, en attendant les photos réelles (pas de bureau pour le moment).

- [x] **5.1** — AR : italique synthétique (faux « / » dans le hero), odomètre et téléphones inversés par le bidi
- [x] **5.2** — Contact : message réellement facultatif (client + fonction Netlify), délai 48h partout, monogrammes dérivés des noms FR, stat longue (« Accredited ») sans débordement sur /en mobile
- [x] **5.3** — NAP : source unique `lib/site-config.ts` (`siteContact`), format téléphone unifié `+213 (670) 70 81 38`
- [x] **5.4** — Projets : la home lit les vraies études de cas Keystatic ; mention « à valider avec le client » retirée de l'affichage ; « 150 partenaires » remplacé par l'agrément
- [x] **5.5** — Pages Mentions légales + Confidentialité (FR/AR/EN) dans `lib/legal-content.ts`, liens footer + formulaire, sitemap
- [x] **5.6** — Zones tactiles 44 px (liens texte, footer mobile, barre utilitaire, sélecteur de langue, menu)
- [x] **5.7** — Typographie FR : espaces insécables devant ? ! : ; et dans les guillemets (`lib/typography.ts`, appliqué au dictionnaire FR et au markdown)
- [x] **5.8** — Copy : réécriture des phrases à cadence « IA » (tirets cadratins, triades, slogans) en FR source + AR/EN
- [x] **5.9** — Heros des pages index à hauteur de contenu + index numéroté de la page (`TerrainHero`)
- [x] **5.10** — Home : section « Cadre réglementaire » (loi 03-10, décrets 07-145 / 06-198 / 07-144, loi 04-20) dans `lib/reglementation.ts`
- [ ] **5.11** — [CLIENT] Valider les 3 études de cas (`content/fr/projets/`) : la mention « exemple représentatif » n'est plus affichée, le contenu doit donc être exact. Ajouter des chiffres (surface, délai d'instruction, wilaya) dès que possible.
- [ ] **5.12** — [CLIENT] Numéro et date d'agrément ministériel → à afficher dans la bande chiffres et sur /a-propos
- [ ] **5.13** — [CLIENT] Forme juridique, capital, RC, NIF, NIS, AI et référence d'agrément → à renseigner dans `legalRegistration` (`lib/site-config.ts`) ; les lignes n'apparaissent sur les mentions légales que si la valeur est connue. Hébergeur à mettre à jour si le site quitte Netlify.
- [ ] **5.14** — [CLIENT] Photos réelles (équipe, bureau, terrain, dossiers reliés) → remplacer les initiales sur /equipe et les SVG topographiques des bandes sombres
- [ ] **5.15** — [CLIENT] URLs LinkedIn / Instagram / Facebook → `socialProfiles` dans `lib/site-config.ts`
- [x] **5.16** — Centre de ressources `/ressources` : 6 fiches par texte (03-10, 07-145 modifié 2018/2019, 06-198 modifié 2022, 07-144, **24-04 qui remplace 04-20**, 23-324 agrément) + guide de procédure en 6 étapes avec les délais réglementaires. Contenu **dans Keystatic** (collection « Ressources » + singleton « Page Ressources »), synchronisé dans `fr.json`, AR/EN semés à la main dans les dictionnaires en attendant le pipeline. JSON-LD Article + FAQPage, sitemap, « Ressources » remplace « Blog » dans la nav. Vérification contre les sources : `docs/REGLEMENTATION-SOURCES.md`.
- [x] **5.16b** — Vérification de chaque texte cité sur le site sur les PDF du Journal officiel (joradp.dz) : fiches, guide, FAQ accueil, page EIE, page À propos, trois articles de blog (FR/AR/EN), mentions légales. Corrections listées dans `docs/REGLEMENTATION-SOURCES.md` (loi 04-20 abrogée, délais du 07-145 depuis 2018, approbation ministre/wali, accord préalable 15 jours, etc.).
- [ ] **5.16c** — [CLIENT] Relecture finale par Amine des 7 fiches et des 3 articles (lecture métier, pas juridique : les citations sont vérifiées), plus les 4 points de `docs/REGLEMENTATION-SOURCES.md` § « Points qui restent de la responsabilité du client ».
- [x] **5.17** — Pages secteurs : trois blocs ajoutés sous les enjeux, tous éditables dans Keystatic (collection « Secteurs » : `nomenclatureNote`, `textes[fiche, note]`, `parcours[title, description, service]`) : « Textes applicables » (lien vers la fiche Ressources + lecture propre au secteur), « Études exigées, dans l'ordre » (6 étapes avec lien service), « Étude de cas dans ce secteur » (projets filtrés sur `secteurSlug`, masqué si aucun). Seuils et rubriques relus sur le JO (`docs/REGLEMENTATION-SOURCES.md` § Pages secteurs). AR/EN semés à la main (même réserve que 5.19). Un `textes.fiche` inconnu fait échouer `npm run content:sync`.
- [x] **5.18** — Poids JS mesuré sur le build (31 oct.) : 822 KB bruts / 256 KB gzip sur la home, 786 KB / 246 KB sur une page intérieure, 13 à 14 chunks. Répartition : React + runtime Next ≈ 470 KB bruts (3 chunks, incompressibles côté projet), GSAP + ScrollTrigger + SplitText 118 KB bruts / 46 KB gzip (un seul chunk partagé, mis en cache entre les pages), Lenis 30 KB, reste = composants. Essai de chargement différé de SplitText (`import()` dans les 3 sections sous la ligne de flottaison) : **abandonné**. SplitText est aussi utilisé par `RevealText` dans tous les heros (ServiceHero, TerrainHero, home, contact), donc nécessaire au premier rendu ; Turbopack l'a dupliqué dans 11 chunks de page (~16 KB chacun) au lieu d'un chunk partagé, ce qui est pire en navigation. Gain possible restant : réécrire le masque de mots des heros sans SplitText (≈ 9 KB gzip, soit 3,5 % du JS) au prix d'une régression visuelle possible sur l'animation signature ; pas prioritaire.

- [x] **5.19** — Action `translate.yml` vérifiée sur GitHub : 9 runs, le dernier (10 sept. 2026, push sur main) a réussi, la clé `ANTHROPIC_API_KEY` fonctionne donc. Risque réel corrigé : le script ne retraduit que les sections dont le hash FR a changé, et les hashes dataient du 29 oct. 11h10 ; au premier push sur main, `ressources`, `secteurs`, `home`, `eie`, `edd`, `apropos`, `projets`… auraient été réécrits par la machine, effaçant l'arabe et l'anglais relus à la main. Ajout de `npm run translate -- --seal` (sans API) qui enregistre les hashes FR courants pour les sections déjà traduites ; lancé le 31 oct. (18 sections scellées pour AR et EN). **Règle** : après toute relecture manuelle de `ar.json` / `en.json`, relancer `--seal` avant de pousser. Les articles de blog ne sont retraduits qu'avec `--force`. Modèle de traduction : `claude-sonnet-4-6` (variable `ANTHROPIC_MODEL`).
- [ ] **5.20** — Revue complète avant merge de `ccr-bac5c324-z7k16j` sur `main` (rien ne part en prod sans validation) :
  - [ ] relecture FR / AR / EN des pages Mentions légales et Confidentialité (textes juridiques, noms des lois, ANPDP)
  - [ ] test du formulaire de contact en preview Netlify : case de consentement, message vide, email reçu via Resend
  - [ ] vérification visuelle desktop + mobile des 3 langues (hero, stats, section réglementaire, footer)
  - [ ] `npm run build` 0 erreur / 0 warning, sitemap contenant `/mentions-legales/` et `/confidentialite/`
  - [ ] validation client des textes des études de cas (5.11)
  - [ ] relecture métier des 7 fiches Ressources (5.16c) et de l'arabe
  - [ ] test de l'édition d'une fiche depuis `/keystatic` (collection Ressources) sur la preview Netlify

- [ ] **5.21** — [CLIENT/CONFIG] Localisation des données (loi 18-07) : aujourd'hui l'hébergement (Netlify) et l'acheminement des emails du formulaire (Resend) passent par des serveurs hors Algérie. Les pages légales ne le mentionnent pas à la demande du client ; à régler avant le lancement, soit par un hébergeur et un relais email établis en Algérie, soit par l'autorisation de transfert prévue par la loi. Mettre ensuite à jour `lib/legal-content.ts` (sections Hébergement et Destinataires).

**Sortie Phase 5 :** site cohérent, conforme (légal, a11y, typo), avec une section que seul un bureau d'études algérien peut avoir.

---

## Légende

- 🟢 Phase en cours / proche
- 🟡 Phase à venir
- 🔵 Phase terminée
- `[CLIENT]` : action nécessitant l'intervention du client BTH Expert
