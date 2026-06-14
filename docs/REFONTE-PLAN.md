# BTH Expert — Plan de refonte premium

> Branche : `refonte/premium-storytelling`
> Suivi des tâches : [`TODO-refonte.md`](../TODO-refonte.md)
> Maquette Figma : https://www.figma.com/design/KAsrSoBbvq9bYzcCWfHTqu
> Référence loi : [`docs/DESIGN-MANIFESTO.md`](DESIGN-MANIFESTO.md) (v2.1)

## Pourquoi cette refonte

Le rendu actuel n'atteint pas le niveau visé (GISI, Cohere, Clay) : ultra-premium, ultra-fluide, storytelling. Audit du landing + des pages services, comparé au manifesto v2.1 et à trois design systems de référence. Constat mesurable, pas une affaire de goût.

### Les 7 écarts diagnostiqués

1. **Mur vert.** 4 sections sur 6 en `bg-brand-deep`. Le manifesto §1.3 impose « cream dominant, le vert est une ponctuation ». Inversé → contraste mort, « fade ».
2. **Hero typo timide.** `page.tsx` hardcode `clamp(... 4.5rem)` au lieu du token `--text-hero` (6.5rem). 30 % sous le standard. Hiérarchie inversée (les stats sont plus grosses que le hero).
3. **Image étouffée.** Voile uniforme 62 % sur le hero au lieu du gradient `--overlay-hero`. « L'image EST le design » (§4) contredit.
4. **Or qui chuchote.** Filets or à `opacity 0.3` → quasi invisibles. Doit être un repère qui frappe (§3).
5. **Écriture sans POV.** Le copy décrit ce que BTH *est* (listes de capacités), ne raconte rien. La meilleure phrase du repo dort dans un composant mort.
6. **Motion = entrées, pas narration.** 90 % du GSAP = reveal-on-enter `once:true` (l'AOS interdit §5). Le pattern DOMINANT (pin-scroll) n'est pas codé. Le meilleur composant (`StatementSection` clip-path wipe) n'est jamais importé.
7. **Pages services catastrophiques.** Server components statiques, zéro image, zéro motion, hero 52px sur texte nu, pas de FAQ, pas de pin-scroll méthode.

### Violations directes du manifesto (blacklist §10)

- `backdrop-filter: blur(12px)` dans le header ([`app/globals.css`](../app/globals.css)) — blur interdit « en toutes circonstances ».
- Count-up promis (§2) absent. Italique de hiérarchie (§2) défini dans le dict mais non rendu.

## La cible (= maquette Figma)

Rythme des fonds, **cream-dominant, 2 ponctuations sombres** :

```
Hero        sombre (image-led, gradient)     ← ponctuation 1
Stats       cream-warm   (count-up)
À propos    cream-soft   (POV statement)
Services    cream        (PIN SCROLL signature)
Statement   cream-warm   (grande phrase + italique + photo wipe)
Zones       brand-deep   (glow or Oran)       ← ponctuation 2
CTA         brand-deep   (image-led)          ← ponctuation 2 (suite)
Footer      brand-deep   (asymétrique)
```

Type monumental (hero 6.5rem, italique Fraunces sur *environnementale*), or repère, motion narratif (pin + scrub + count-up + wipe), mobile pensé mobile (stats 2×2, services empilés).

## Phases & commits

> Règles CLAUDE.md : **1 tâche = 1 commit**, `npm run build` à 0 erreur / 0 warning avant chaque commit, Server Components pour le contenu (client uniquement pour le motion/interaction), TypeScript strict, changements minimaux, pas de scope creep.

### Phase 0 — Hygiène
- `fix(header): retirer backdrop-blur` — `app/globals.css`. Remplacer le blur par un fond `cream-soft` opaque (~0.94). Critère : aucun `backdrop-filter` dans le repo.

### Phase 1 — Hero
- `fix(hero): échelle typo + italique + i18n` — `app/[lang]/(landing)/page.tsx`. Utiliser `--text-hero`, italique sur `dict.home.hero.headlineEmphasis`, consommer le dict (arrêter le FR hardcodé qui casse AR/EN).
- `fix(motion): RevealText vrai masque` — `components/animations/RevealText.tsx`. Wrap `overflow:hidden`, retirer `opacity:0`, translateY pur 100→0.
- `refine(hero): voile gradient` — `page.tsx`. Aplat 62 % → `--overlay-hero`.

### Phase 2 — Casser le mur vert (plus gros levier)
- `refactor(landing): cream-dominant` — `page.tsx`, `components/sections/AboutSection.tsx`, `components/sections/ServicesList.tsx`. About `brand-deep`→`cream-soft` (texte flip ink), Services `white`→`cream`. Conserver Zones + CTA sombres (ponctuation). Critère : ≤ 2 bandes sombres sur le landing.

### Phase 3 — Sections signature
- ⭐ `feat(services): pin-scroll` — nouveau `components/sections/ServicesPinScroll.tsx`. Image/schéma `ScrollTrigger.pin`, steps en scrub. **Pièce qui change le storytelling. À coder en premier (proof).**
- `feat(stats): barre count-up` — nouveau `components/sections/StatsBand.tsx`. Consomme `dict.home.stats` (inutilisé aujourd'hui). Count-up GSAP, `prefers-reduced-motion` respecté.
- `feat(statement): brancher StatementSection` — `page.tsx`. Importer le composant mort, le placer avant Zones.

### Phase 4 — Copy POV
- `content(copy): POV hero + about` — `dictionaries/fr.json`. AR/EN régénérés (Phase 3 i18n). Remplacer les listes de capacités par des phrases à point de vue.

### Phase 5 — Pages services
- `feat(svc): hero image-led + contexte POV` — template service + nouveau `components/sections/ServiceHero.tsx`.
- `feat(svc): méthode pin-scroll` — nouveau `components/sections/MethodPinScroll.tsx`.
- `feat(svc): FAQ + livrable band` — nouveau `components/sections/Faq.tsx`.
- Le template est partagé → les 4 pages services en bénéficient d'un coup.

### Phase 6 — Mobile premium
- `feat(mobile): sections mobile-native` — stats 2×2, services empilés, type recalibré (cf. maquette HTML). Pas de `responsive-to-small`.

### Phase 7 — Polish motion
- `refine(motion): cross-fade + élaguer` — Pattern 2 (cross-fade des surfaces), retirer les tweens superflus (premium = sélectif).

## Ordre d'exécution

**Phase 3 (pin-scroll) → Phase 2 (couleur) → Phase 1 (hero) → reste.**
Les trois premières = ~80 % du saut de qualité visible.

## Accessibilité (non négociable, §5)

`prefers-reduced-motion: reduce` désactive pin, parallax, count-up, Ken Burns ; garde les fades simples. Vérifié sur chaque composant motion.
