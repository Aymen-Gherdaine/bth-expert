# BTH Expert — Design Manifesto

> La loi du système. Aucune décision visuelle hors de ce document.
> Si une décision n'est pas couverte ici, elle se prend en relisant les principes du Nord — jamais par instinct.

---

## 1. Le Nord

BTH Expert est un cabinet d'études environnementales certifié par le Ministère. Son site doit projeter ce que projettent les cabinets premium dans le monde : **autorité tranquille, rigueur éditoriale, qualité documentaire**. Pas une SaaS. Pas une agence digitale. Pas un site "moderne".

**La référence n'est pas une autre startup. La référence est un livre, un rapport ministériel, ou un cabinet d'avocats new-yorkais.**

Trois principes structurent toutes les décisions :

1. **La typographie porte la marque.** Pas les couleurs, pas les images, pas les effets.
2. **La restriction signale le niveau.** Premium = enlever. Cheap = ajouter.
3. **Le contenu dicte la grille.** Pas l'inverse.

---

## 2. Les 8 lois

### 01 — Zéro effet décoratif
Aucun `box-shadow`. Aucun `backdrop-blur`. Aucun `gradient` (sauf SVG techniques). Aucun glow. Aucun glassmorphism. Si un élément a besoin d'une ombre pour exister, il ne devrait pas exister.

### 02 — Une famille display, une famille body. Point
**Fraunces** pour le display (variable, supports italic native, opsz axis). **Geist** pour le body (400 et 500, c'est tout). Toute autre police est interdite.

### 03 — Échelle éditoriale
Hiérarchie typographique forte ou pas de hiérarchie du tout. `clamp()` agressif sur les titres. Letter-spacing négatif sur le serif display (-0.02em). Line-height serré sur les titres (1.05–1.15), généreux sur le corps (1.65–1.75).

### 04 — Numérotation éditoriale partout
Sections numérotées 01, 02, 03. C'est l'opposé du SaaS — c'est le signal "document de qualité, structuré, pensé". Présent dans Pentagram, dans les rapports McKinsey, dans tous les cabinets sérieux.

### 05 — Layout asymétrique
Pas de grilles 3-colonnes répétées. Une grille 12 utilisée à 5/12, 7/12, 11/12 selon le contenu. La symétrie répétée est le signal d'un site fait par template, pas par senior designer.

### 06 — Motion invisible ou pas du tout
Pas de fade-in au scroll. Pas de parallax. Pas de cards qui montent. Pas d'AOS. Les seules motions autorisées : transitions de page (200–300ms cubic-bezier custom), underline qui se trace au hover sur les liens, cursor change sur les zones cliquables. C'est tout.

### 07 — Imagerie intentionnelle ou absente
Photographie sur site (projets réels, format documentaire, noir et blanc ou couleur désaturée). OU illustration ligne fine éditoriale. OU rien — le texte porte tout. Jamais d'icônes Lucide partout. Jamais d'illustrations 3D AI. Jamais d'Unsplash.

### 08 — Le détail invisible compte
Hyphens activés, veuves/orphelines évitées, smart quotes (« » au lieu de " "), espaces insécables avant les ponctuations doubles, ligatures activées. Le lecteur ne le voit pas — il le ressent.

---

## 3. Système typographique

### Display — Fraunces (variable, Google Fonts)
- Axes utilisés : `opsz` (9–144), `wght` (300–700), italic
- Usage : H1, H2, H3, citations, eyebrows display
- Letter-spacing : -0.02em sur grandes tailles, -0.01em sur moyennes
- Line-height : 1.05 sur display, 1.15 sur H1, 1.2 sur H2

### Body — Geist (Google Fonts)
- Weights : **400, 500 uniquement** (jamais 300, jamais 600+)
- Usage : corps, nav, UI, captions
- Line-height : 1.7 sur corps, 1.5 sur captions
- Letter-spacing : 0 sur corps, +0.08em sur caps/eyebrows

### Échelle (tokens CSS)

| Token | Mobile | Desktop | Usage |
|---|---|---|---|
| `--text-display` | 3rem | 5.5rem | Hero |
| `--text-h1` | 2rem | 3.5rem | Page titles |
| `--text-h2` | 1.5rem | 2.25rem | Section titles |
| `--text-h3` | 1.25rem | 1.625rem | Subsections |
| `--text-body` | 1rem | 1.0625rem | Body text |
| `--text-small` | 0.875rem | 0.9375rem | Secondary |
| `--text-caption` | 0.75rem | 0.8125rem | Labels, eyebrows |

Tout `clamp()`-isé pour fluidité entre mobile et desktop.

---

## 4. Système chromatique

### Trois couleurs de marque. Point.

| Token | Hex | Rôle |
|---|---|---|
| `--color-brand` | `#1a2e1e` | Vert forêt — fonds sombres, autorité, texte sur cream |
| `--color-gold` | `#c9a96e` | Or — repère, jamais décoration. **2 instances par page max.** |
| `--color-cream` | `#f5f0e8` | Crème — surface principale |

### Règle du gold
Le gold est un **repère**, pas une décoration. Il marque ce qui est important (un numéro de section, une donnée chiffrée, un détail typographique signifiant). Il ne souligne pas les H1. Il n'encadre pas les cards. Il n'apparaît pas sur les bordures de section. Il n'apparaît pas dans les logos texte. **Si tu peux enlever le gold sans changer le sens, enlève-le.**

### Couleurs dérivées (warm-only, jamais de gris froid)
- `--color-ink` : `#1a2e1e` — texte principal
- `--color-ink-soft` : `#3d4a40` — texte secondaire
- `--color-muted` : `#6b7455` — texte tertiaire, captions
- `--color-line` : `#d8d0bc` — filets rares, séparateurs

### Texte sur fond brand (footer) — via `color-mix()`
- `--color-on-brand-strong` : cream pleine
- `--color-on-brand-muted` : `color-mix(in srgb, cream 65%, brand)`
- `--color-on-brand-faint` : `color-mix(in srgb, cream 40%, brand)`

Plus jamais d'opacités arbitraires (`/40`, `/60`, `/80`).

---

## 5. Système d'espacement et de proportion

### Échelle
Base 4px. Multiples utilisés : 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 192.

### Padding container (latéral)
- Mobile : 24px
- Tablet : 48px
- Desktop : 80px
- Wide : 128px

### Rythme vertical des sections
- Petite section : 64–96px
- Section standard : 96–160px
- Section hero : 160–240px

### Max-widths
- `--container-max` : 1280px (sections marketing)
- `--container-narrow` : 720px (texte éditorial long, blog)
- `--container-prose` : 640px (prose dense)

### Radius
- `--radius-sm` : 4px (boutons, inputs)
- `--radius-md` : 6px (cards rares)
- **Aucun lg, xl, 2xl, 3xl. Aucun `rounded-full` sauf points/avatars très exceptionnels.**

---

## 6. Système de motion

### Durations
- `--duration-fast` : 200ms (hover, focus)
- `--duration-base` : 300ms (transitions standard)
- `--duration-slow` : 500ms (transitions de page)

### Easings
- `--ease-out-expo` : `cubic-bezier(0.16, 1, 0.3, 1)` — sortie premium
- `--ease-out-quart` : `cubic-bezier(0.25, 1, 0.5, 1)` — sortie douce
- `--ease-in-out-soft` : `cubic-bezier(0.4, 0, 0.2, 1)` — symétrique

### Autorisé
- Underline qui se trace au hover (scaleX du pseudo-élément)
- Color shift au hover (texte uniquement, jamais sur fond plein)
- Transition de page (fade 200–300ms, easing custom)
- Cursor change sur zones cliquables
- Letter-spacing micro-shift sur les CTAs (+0.01em au hover)

### Interdit
- AOS, scroll-trigger fade-up
- Parallax
- Cards qui montent au scroll
- Tilting, magnetic buttons, blob followers
- Loaders animés (sauf form submit subtle)
- `scroll-behavior: smooth` global
- Cursor custom (sauf change de forme sur liens)

---

## 7. Système d'imagerie

### Trois directions autorisées (choisir UNE par projet)

**a. Photographie documentaire sur site.** Projets réels, anonymisés si besoin. Noir et blanc ou couleur très désaturée. Format strict : 3:2 ou 4:5. Pas de portraits sourires en chemise blanche.

**b. Illustration ligne fine éditoriale.** Schémas techniques (process EIE, méthodologie EDD, cartes zones d'intervention) au trait fin, monochrome brand ou ink-soft.

**c. Aucune imagerie.** Le texte porte tout. La typographie est l'image.

### Interdit absolument
- Photos stock Unsplash/Pexels (les concurrents en abusent — c'est la signature du cheap)
- Icônes Lucide / Heroicons partout (utilisables 1–2 fois max sur tout le site, pour des micro-indicateurs)
- Illustrations 3D AI
- Memojis, mascottes, abstractions colorées
- Photos people-stock générique

---

## 8. La blacklist

Liste explicite de ce qui ne doit **jamais** apparaître dans le code :

**Effets CSS :**
- `backdrop-blur`, `backdrop-filter`
- `box-shadow` décoratif (les seules ombres permises sont sur form inputs au focus)
- `bg-gradient-*` (sauf gradients de marque très subtils en SVG)
- `text-shadow`

**Geometry :**
- `rounded-full` sur boutons (jamais)
- `rounded-2xl`, `rounded-3xl` (jamais)
- `rounded-xl` (jamais)

**Patterns visuels :**
- Glassmorphism
- Neumorphism
- Dark mode
- Light mode toggle
- Particules animées, étoiles, blobs
- Cursor custom
- Scroll-jacking, locomotive scroll spectaculaire
- Loading screens prétentieux

**Polices interdites :**
Inter, Roboto, Montserrat, Poppins, Open Sans, Lato, Nunito, Outfit, Plus Jakarta Sans, Cormorant Garamond, DM Sans, Playfair Display, Space Grotesk.

**Couleurs interdites :**
Tout violet, magenta, cyan, néon. Tout dégradé multi-couleurs. Tout gris froid (zinc, slate, neutral Tailwind défaut).

---

## 9. Références — les sites qui incarnent ce manifesto

À consulter avant chaque décision visuelle importante :

- **pentagram.com** — typographie éditoriale absolue, case studies sans décor
- **klim.co.nz** — typo-led extreme, comment un site retient sans rien d'autre
- **practique.com** — cabinet d'architecture, exactement le ton visé
- **burohappold.com** — cabinet ingénierie premium international, référence directe
- **stripe.com/customers** — comment atteindre un niveau cabinet en SaaS
- **arcadis.com** — cabinet environnemental international (palette claire récente)
- **rambol l.com** — autre référence environnement, plus moderne

---

## 10. Comment ce document s'applique

**Avant d'écrire du code :** relire la section 2 (les 8 lois) et la section 8 (la blacklist).

**Pendant le code :** si un effet visuel n'est pas explicitement autorisé dans les sections 5–7, il est interdit.

**Pendant la review :** chercher activement la blacklist. Un seul élément blacklisté = la PR ne mergue pas.

**Mise à jour de ce document :** uniquement avec décision explicite documentée dans un commit dédié au manifesto. Pas de drift silencieux.

---

*Document évolutif. Version 1 — Juin 2026.*
