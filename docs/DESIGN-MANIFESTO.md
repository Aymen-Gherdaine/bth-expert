# BTH Expert — Design Manifesto (v2.1)

> La loi du système. Remplace la v1 et v2.
> v1 était dogmatique et sec — elle a produit du plat. v2 a corrigé la direction. v2.1 intègre les décisions de terrain : pas de blur, container premium, header color-adaptive.
> Principe directeur : **un site éditorial, cinématique, qui bouge avec finesse — pas une brochure, pas un PDF interactif.**

---

## 0. Ce que v1 avait faux (à ne jamais refaire)

- ❌ "Zéro shadow, zéro blur, zéro gradient" → FAUX. Apple/Stripe/Linear ont des shadows subtiles et des gradients de marque. La différence c'est la **maîtrise**, pas l'absence. En revanche, le blur (backdrop-filter) est interdit pour BTH — ce n'est pas notre esthétique.
- ❌ "Motion invisible ou pas du tout" → FAUX. La règle réelle : **motion partout, mais imperceptible**.
- ❌ "Imagerie optionnelle, le texte porte tout" → FAUX pour notre direction. Les sites qu'on vise sont **image-led** : l'image EST le design.
- ❌ Header à 96px "aéré" → FAUX. Le luxe vient de l'exécution serrée à 64-80px, pas de l'espace gratuit.

**Leçon : premium ≠ minimalisme sec. Premium = craft, profondeur maîtrisée, motion fine, image forte.**

---

## 1. Le Nord (v2.1)

BTH Expert est un cabinet d'études environnementales. Le site doit être **immersif et cinématique** (on entre dedans), **éditorial** (architecture de magazine d'expertise, pas de vitrine), et **vivant** (tout bouge subtilement, rien ne saute aux yeux).

Quatre principes tranchent tout :

1. **L'image porte l'émotion, la typo porte l'autorité, la motion porte la vie.** Les trois ensemble.
2. **Le hero est cinématique.** Image full-bleed avec Ken Burns subtle + parallax léger, texte minimal en overlay. On entre dans le site comme dans un film.
3. **Le corps respire en clair.** Cream dominant. Le vert foncé est une **ponctuation** (hero, carte, footer), jamais la toile de fond.
4. **La finesse est dans les détails invisibles.** Easing custom, letter-spacing calibré, staggers, grain photo unifié. Le visiteur ne les voit pas — il sent "ce site est différent".

---

## 2. Système typographique

### Display — Fraunces (variable, Google Fonts)
- Axes : `opsz` (optical sizing, 9-144), `wght` (300-600), italic natif
- Usage : hero, H1, H2, H3, citations, chiffres clés
- Letter-spacing : **-0.03em** sur les très grandes tailles (hero), -0.02em sur H1, -0.01em sur H2/H3
- Line-height : 1.0 sur hero, 1.1 sur H1, 1.2 sur H2
- L'italique de Fraunces est un **outil de hiérarchie** (ex. *environnementale* en italique dans le hero) — usage intentionnel, pas décoratif

### Body — Geist (Google Fonts)
- Weights : 400, 500 uniquement
- Line-height : 1.7 corps, 1.5 captions
- Letter-spacing : 0 corps, +0.12em sur les eyebrows/labels en capitales

### Échelle (tokens, clamp pour fluidité)

| Token | Mobile | Desktop | Usage |
|---|---|---|---|
| `--text-hero` | 2.75rem | 6.5rem | Hero titles |
| `--text-display` | 2.25rem | 4rem | Section statements géants |
| `--text-h1` | 2rem | 3.25rem | Page titles |
| `--text-h2` | 1.5rem | 2.25rem | Section titles |
| `--text-h3` | 1.25rem | 1.625rem | Subsections |
| `--text-body` | 1rem | 1.0625rem | Body |
| `--text-small` | 0.9375rem | 0.9375rem | Secondary |
| `--text-caption` | 0.75rem | 0.8125rem | Eyebrows, labels |

### Animation des textes (signature du site)
- **Hero & grands titres** : reveal par mots, mask + translateY (de 100% à 0), stagger 60-80ms, easing `expo.out`, durée 0.8-1s. Jamais lettre par lettre sur du texte long (trop lourd) — uniquement sur des titres courts si l'effet le mérite.
- **Titres de section** : reveal par lignes au scroll (ScrollTrigger), une ligne après l'autre.
- **Corps** : fade + translateY léger (16px), au scroll, stagger sur les paragraphes.
- **Chiffres clés** : count-up animé jusqu'à la valeur finale quand ils entrent dans le viewport.
- **Eyebrows / numéros de section** : fade simple, légèrement avant le titre qu'ils annoncent.

---

## 3. Système chromatique (enrichi)

### Couleurs de marque (inchangées)

| Token | Hex | Rôle |
|---|---|---|
| `--color-brand` | `#1a2e1e` | Vert forêt — ponctuation, overlays hero, footer |
| `--color-brand-deep` | `#0f1c12` | Vert profond — overlays sombres, contrastes |
| `--color-brand-soft` | `#2a4530` | Vert adouci — hovers, surfaces vertes secondaires |
| `--color-gold` | `#c9a96e` | Or — repère, 2-3 instances par écran max |
| `--color-gold-deep` | `#a88a4c` | Or profond — hovers gold |

### Surfaces claires — LA TOILE (nouvelles + existantes)

| Token | Hex | Rôle |
|---|---|---|
| `--color-cream-soft` | `#faf7f2` | Surface la plus claire — sections aérées |
| `--color-cream` | `#f5f0e8` | Surface par défaut |
| `--color-cream-warm` | `#efe7d6` | Beige chaud, sections alternées |
| `--color-cream-deep` | `#ede8dc` | Surface plus dense — séparation douce |
| `--color-forest-light` | `#eef2ec` | Vert-cream très subtil, touches environnementales |

### Texte

| Token | Hex | Rôle |
|---|---|---|
| `--color-ink` | `#1a2e1e` | Texte principal sur clair |
| `--color-ink-soft` | `#3d4a40` | Texte secondaire |
| `--color-muted` | `#6b7455` | Tertiaire, captions |
| `--color-line` | `#d8d0bc` | Filets, séparateurs |

### Texte sur fond brand (footer, hero overlay) — via `color-mix()`

| Token | Définition |
|---|---|
| `--color-on-brand-strong` | `var(--color-cream)` |
| `--color-on-brand-muted` | `color-mix(in srgb, cream 65%, brand)` |
| `--color-on-brand-faint` | `color-mix(in srgb, cream 40%, brand)` |

### Overlays cinématiques (pour le hero image-led)

| Token | Définition | Rôle |
|---|---|---|
| `--overlay-hero` | `linear-gradient(180deg, rgba(15,28,18,0.35) 0%, rgba(15,28,18,0.65) 100%)` | Lisibilité du texte sur image hero |
| `--overlay-hero-side` | `linear-gradient(90deg, rgba(15,28,18,0.7) 0%, transparent 70%)` | Pour texte aligné à gauche (style GISI) |

### Le ratio lumière (LA règle clé)

- **Hero** : sombre, mais par l'**image cinématique** + overlay, pas par un aplat vert plein
- **Corps** : cream dominant, alternance `cream-soft` → `cream-warm` → `cream` → `forest-light` pour les transitions
- **Ponctuation verte** : carte des zones, une section statement forte, footer
- **Règle du gold** : repère, jamais décoration. 2-3 instances par écran. Pas de soulignement de titre, pas d'encadrement de card.

---

## 4. Système d'imagerie — IMAGE-LED + anti-AI-cheap

**C'est le cœur de la direction. Tout est généré en IA. La discipline anti-cheap n'est pas optionnelle : c'est ce qui sépare GISI d'un site amateur.**

### Hero cinématique — stratégie image

La stratégie hero est **image fixe avec Ken Burns subtle (zoom lent ~8s) + parallax léger au scroll**. Pas de vidéo pour l'instant — plus léger, autoplay mobile sans souci, génération IA cohérente sur des plans atmosphériques. Vidéo restera une option future si la génération Veo 3 / Sora 2 donne un résultat fiable sur des plans industriels sans humains.

### Les tells de l'AI slop (à éliminer absolument)

- Visages déformés, mains incohérentes → **JAMAIS de personnes, visages, mains**
- Sur-saturation, couleurs criardes → désaturer systématiquement
- Sur-netteté "plastique", rendu HDR → grain + matte + lumière naturelle
- Symétrie parfaite irréelle → compositions asymétriques
- Texte/logos/machines complexes illisibles → éviter ces sujets, ou plans larges où le détail disparaît
- "Look Midjourney" générique → style references documentaires précises

### Règles de génération pour BTH

**Sujets autorisés :**
- Paysages industriels en plan large (raffineries au loin, silhouettes d'usines au crépuscule)
- Textures : béton, métal patiné, surfaces d'eau, fumée/vapeur, terre, végétation aride algérienne
- Nature : paysages désertiques, côtes oranaises, végétation méditerranéenne, ciels
- Détails atmosphériques : contre-jour, brume, heure dorée, reflets

**Sujets interdits :**
- Personnes, visages, mains, silhouettes humaines proches
- Logos, marques, texte
- Machines complexes en gros plan (les détails AI cassent)
- Scènes "corporate stock" (réunions, poignées de main, sourires)

**Direction artistique obligatoire (dans chaque prompt) :**
- Style : photographie documentaire, film 35mm, désaturé
- Lumière : naturelle, heure dorée douce ou brume — jamais HDR
- Composition : asymétrique, espace négatif, règle des tiers
- Palette : tirer vers vert/cream/désaturé pour coller à la marque
- Grain : film grain léger

### Le secret de cohérence : le post-traitement unifié

Des images AI générées séparément sont disparates. **Ce qui les transforme en collection cohérente premium : un même color grade + grain appliqué à TOUTES.**
- Même LUT/color grade (tirage vert-désaturé chaud)
- Même grain
- Même contraste
- Même format selon usage

C'est cette étape qui fait la différence entre "images AI collées" et "direction photographique de cabinet".

### Outils
- **Images** : Nano Banana 2 (Gemini 3 Pro Image), Flux 1.1, Midjourney v7
- **Vidéo hero (future)** : Veo 3, Sora 2, Kling (plans atmosphériques uniquement, jamais de scènes humaines)
- **Voix off** (si vidéos explicatives) : ElevenLabs
- **Post-traitement** : color grade + grain uniforme, batch

### Ce qui reste NON-IA
- Portraits équipe → vrais photos (crédibilité non-négociable)
- Logos clients → jamais générés (risque juridique)

---

## 5. Système de motion — GSAP + Framer Motion + Lenis

### Stack

| Lib | Rôle |
|---|---|
| **Lenis** | Smooth scroll de base (toute la page) |
| **GSAP + ScrollTrigger** | Pin scroll, timelines, reveals au scroll, count-up, parallax léger contrôlé |
| **Framer Motion** | Composants React, page transitions, hover states, layout animations |

Règle de répartition : GSAP pour tout ce qui est lié au scroll ; Framer Motion pour tout ce qui est lié à l'interaction et aux composants. On ne mélange pas les deux sur un même élément.

### Les 3 patterns (validés)

**Pattern 1 — Pin scroll cinématique (DOMINANT)**
Un élément reste fixe (image, schéma, chiffre) pendant que le contenu défile à côté. Via `ScrollTrigger.create({ pin: true })`.
*Application BTH : section services — image/schéma fixe à gauche, les services défilent à droite un par un.*

**Pattern 2 — Cross-fade de surfaces (DOMINANT)**
Le fond change progressivement entre sections (`cream-soft` → `cream-warm` → `cream`). Le contenu apparaît en stagger (eyebrow → titre → corps), chaque élément son easing.

**Pattern 3 — Lignes & textes qui se tracent (ACCENT ponctuel)**
Filets gold qui se tracent au scroll (scaleX). Grands titres reveal par mots. Chiffres en count-up. Usage parcimonieux — pas sur chaque section.

### Easings (tokens)

| Token | Courbe | Usage |
|---|---|---|
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Reveals, entrées |
| `--ease-out-quart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Transitions douces |
| `--ease-in-out-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symétrique |

GSAP : utiliser `expo.out`, `power3.out`, `power4.out`. **Jamais `linear` ni les défauts.**

### Durations (tokens)

| Token | Valeur | Usage |
|---|---|---|
| `--duration-fast` | 200ms | Hover, focus |
| `--duration-base` | 400ms | Transitions standard |
| `--duration-slow` | 700ms | Reveals, page transitions |
| `--duration-hero` | 1000ms | Hero reveal initial |

### Le storytelling au scroll

Le scroll n'est pas une liste, c'est une **narration**. Chaque page raconte : **contexte → expertise → preuve → action**.
- Home : hero immersif → qui on est (chiffres) → ce qu'on fait (services en pin scroll) → où on agit (carte) → preuve (projets/insights) → action (contact)
- Pages services : le problème réglementaire → notre méthode (process en pin scroll) → les livrables → FAQ → CTA

### Règles de motion

**Autorisé :**
- Pin scroll, cross-fade, text reveal, count-up, parallax léger (≤15% de déplacement), underline trace, hover micro-shifts
- Page transitions (fade + léger translate, 400-700ms)
- Hover : letter-spacing micro-shift (+0.01em), color shift texte, underline trace
- Ken Burns subtle sur images hero (zoom lent ~8s)

**Interdit :**
- AOS / fade-up générique sur tout
- Scroll-jacking brutal (qui empêche de scroller librement)
- Parallax fort (> 15%)
- Magnetic buttons, blob followers, cursor custom envahissant
- Loaders prétentieux (un fade d'entrée subtil max)
- Tout ce qui empêche de skipper / scroller vite
- `backdrop-blur`, `backdrop-filter` — interdits en toutes circonstances

### Accessibilité motion
- `prefers-reduced-motion` : désactive pin scroll, parallax, count-up, Ken Burns. Garde les fades simples. **Obligatoire.**

---

## 6. Système de profondeur

La profondeur EST autorisée — subtile, à la Apple/Linear.

### Shadows (tokens, ultra-subtiles)

| Token | Valeur | Usage |
|---|---|---|
| `--shadow-subtle` | `0 1px 2px rgb(26 46 30 / 0.04), 0 2px 8px rgb(26 46 30 / 0.04)` | Cards, éléments flottants |
| `--shadow-card` | `0 1px 3px rgb(26 46 30 / 0.05), 0 8px 24px rgb(26 46 30 / 0.06)` | Cards importantes, widgets |
| `--shadow-float` | `0 4px 12px rgb(26 46 30 / 0.08), 0 16px 48px rgb(26 46 30 / 0.08)` | Modales, overlays |

**Règle :** double-couche (une ombre serrée + une diffuse), opacité très basse (≤ 0.08), teintée brand (jamais noir pur). Si l'ombre se voit franchement, elle est trop forte.

### Blur — INTERDIT

Pas de `backdrop-blur`, pas de `backdrop-filter`, en aucune circonstance. Ni sur le header, ni sur les overlays, ni sur les modales. La profondeur passe **uniquement** par color, border, shadow subtle. Les overlays utilisent des fonds opaques ou semi-opaques (ex. `bg-brand-deep/80`), jamais du blur.

### Gradients de marque (subtils)
- Glow de la carte zones (vert → transparent, radial)
- Overlays hero (définis section 3)
- Jamais de gradient multi-couleurs décoratif

### Radius

| Token | Valeur |
|---|---|
| `--radius-sm` | 4px (boutons, inputs) |
| `--radius-md` | 8px (cards) |
| `--radius-lg` | 12px (widgets, images) |
| `--radius-full` | 9999px (points, avatars) |

Jamais 16px+ sur des boutons.

---

## 7. Header — luxe par l'exécution

### Dimensions
- **Hauteur : `h-16 lg:h-20`** (64px / 80px)
- **Logo** : mark SVG fin (la feuille mesurée) + wordmark Fraunces. Mark visible sur toutes les tailles, wordmark masqué sous sm.
- **Nav** : 4 items max (Services / Projets / Équipe / Contact), `text-[0.9375rem]` font-medium tracking-tight, hover underline qui se trace (pseudo-element scaleX)
- **CTA** : `rounded-sm`, letter-spacing premium, micro letter-spacing-shift au hover
- **Lang switcher** : discret, FR · AR · EN

### État scrollé (après 50px)
- `bg-cream-soft` solid + `border-bottom-color: var(--color-line)`
- Pas d'opacité, **pas de backdrop-filter**
- Transition CSS scroll-driven sur `background-color` et `border-color` uniquement

### Color adaptation (overlay ↔ solid)
Le header a deux états visuels selon la page :
- **Overlay** (landing, transparent au-dessus du hero sombre) : logo (mark + wordmark), nav items, lang switcher → en **cream**, entièrement visibles sur le fond cinématique sombre. Au scroll, ils transitionnent vers **ink/brand**.
- **Solid** (pages intérieures) : logo, nav, lang → en **ink/brand** dès le départ. Fond cream-soft.
- **CTA bouton** : style indépendant (`bg-brand text-cream`) dans les deux états. Il a son propre contraste, il ne s'adapte pas.
- **Hover** : doit rester pertinent dans les deux modes. En overlay : cream → gold. En solid : ink-soft → ink.
- **Transition** : synchronisée avec l'animation du background, via CSS scroll-driven (cascade `color`/`currentColor` ou `@property` sur custom properties animatables).

### Entrée animée
- Éléments du header fade-in au load avec stagger CSS pur (via `--enter-delay` custom property sur `.header-item`).
- `prefers-reduced-motion` : pas d'animation d'entrée.

---

## 8. Layout & sections

### Container
- **Container par défaut : pas de max-width strict.** Le padding latéral seul délimite le contenu. (Cap soft optionnel à ~1680px pour écrans XXL.)
- **Padding latéral progressif** : ~20px mobile / 24px sm / 32px md / 40px lg / 48px xl / 64px 2xl.
- **Variantes éditoriales** : `--container-narrow` (720px) et `--container-prose` (640px) pour la prose longue uniquement — ces variantes conservent un max-width fixe.
- **Référence** : Cain Lamarre, Flyward, AKFA, GISI — contenu à ~95% du viewport sur grand écran. Les bandes vides latérales lisent "petite marque" en B2B.
- Hero et certaines sections cinématiques : full-bleed (100vw).

### Grille & asymétrie
- Grille 12 colonnes utilisée à 5/12, 7/12, 11/12 selon le contenu. Pas de 3-colonnes répété.

### Alternance de surfaces
- Chaque section change de toile (cream-soft → cream-warm → cream → forest-light → brand pour ponctuation).

### Rythme vertical
- Sections 96-160px de padding vertical, hero 100vh.

### Numérotation éditoriale
- 01, 02, 03 sur les sections (signal cabinet).

---

## 9. La formule Home BTH (structure cible)

1. **Hero cinématique** — full-bleed 100vh, image terrain IA (Ken Burns subtle + parallax léger) + overlay + titre Fraunces reveal par mots + CTA gold + CTA ghost. Style GISI/Price&Pierce. **Scroll indicator** : bas à droite, track vertical fin + pulse gold descendante en boucle, aucun label (jamais le mot "Scroll").
2. **Barre de stats** — 2009 / 15+ / 200+ / 12, count-up au scroll.
3. **Qui nous sommes** — statement court + lien équipe. Surface cream-warm.
4. **Services en pin scroll** — image/schéma fixe + services qui défilent (pattern 1, via ScrollTrigger). LA section signature.
5. **Carte des zones d'intervention** — Algérie avec glow gold sur Oran + widget adresse (style Cain Lamarre). Ponctuation verte.
6. **Statement environnemental** — grande phrase Fraunces sur surface forte ("Chaque projet industriel commence par une question environnementale").
7. **Projets / Insights** — cards éditoriales (style Arcadis Featured Insights + Atkins Beyond Engineering).
8. **CTA contact** — "Un projet en cours ? Parlons-en." + form ou lien.
9. **Footer** — vert foncé, asymétrique 6/3/3, ponctuation finale.

---

## 10. Blacklist v2.1

**Toujours interdit (vrais signaux cheap) :**
- `backdrop-blur`, `backdrop-filter` — en toutes circonstances
- Photos/vidéos AI avec personnes, visages, mains
- Stock générique corporate (poignées de main, sourires)
- AOS fade-up générique
- Scroll-jacking brutal, parallax fort (>15%)
- `rounded-full` sur boutons, `rounded-2xl`/`3xl`
- Gradients multi-couleurs décoratifs, néon, violet/cyan/magenta
- Gris froid (zinc/slate/neutral Tailwind)
- Dark mode toggle
- Polices : Inter, Roboto, Montserrat, Poppins, Cormorant Garamond, DM Sans, Playfair Display, Space Grotesk
- Gold en décoration (soulignement titre, encadrement card)

**Autorisé avec maîtrise :**
- Shadows subtiles (≤ 0.08 opacité, teintées brand, double-couche)
- Gradients de marque subtils (glow carte, overlays hero)
- Radius jusqu'à 12px (cards/widgets, pas boutons)
- Motion riche (pin scroll, cross-fade, reveals, count-up, parallax léger, Ken Burns)

---

## 11. Références (recalibrées)

**Structure & ton cabinet :**
- **Cain Lamarre** (cainlamarre.ca) — ⭐ étoile polaire. Palette identique, ton cabinet, carte glow, expertises 2 colonnes
- **GISI** (gisi.com) — ⭐ hero cinématique full-bleed image-led
- **Price & Pierce** (price-pierce.co.uk) — ⭐ hero vidéo cinématique, immersion totale
- **Flyward** (flyward.com) — header clean, layout premium, CTA minimal
- **AKFA** (akfa.uz) — container large, contenu ~95% du viewport, header transparent
- **Arcadis** (arcadis.com) — aération, grandes photos éditoriales, Featured Insights
- **Atkins Réalis** — chiffres énormes, magazine "Beyond Engineering" (PAS leurs gradients flashy)

**Motion & craft :**
- **Apple** — pin scroll cinématique, profondeur subtile, motion imperceptible
- **Stripe** — cross-fade sections, stagger, gradients de marque maîtrisés
- **Linear** — précision des détails, motion qui chuchote
- **Vercel** — text reveals, lignes qui se tracent

---

## 12. Application

- **Avant de coder** : relire sections 1, 5 (motion), 4 (imagerie).
- **Pendant** : si un effet n'est pas dans les sections 4-6, il est interdit.
- **Review** : chercher la blacklist (section 10). Un seul élément blacklisté = pas de merge.
- **Imagerie** : toute image passe par le post-traitement unifié (section 4). Pas d'image brute AI en production.
- **Mise à jour de ce doc** : commit dédié uniquement.

---

*v2.1 — Juin 2026. Intègre les décisions de terrain : pas de blur, container premium, header color-adaptive, Ken Burns hero, scroll indicator bottom-right.*
