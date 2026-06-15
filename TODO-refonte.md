# TODO — Refonte premium

Branche : `refonte/premium-storytelling` · Plan détaillé : [`docs/REFONTE-PLAN.md`](docs/REFONTE-PLAN.md)

Règle : **1 case = 1 commit**, `npm run build` 0 erreur / 0 warning avant chaque commit.

## Phase 0 — Hygiène
- [x] `fix(header): retirer backdrop-blur` — globals.css + Header.tsx + ScrollToTop (0 backdrop-filter dans le code)

## Phase 1 — Hero
- [x] `fix(hero): échelle typo + italique + i18n` — `page.tsx`
- [x] `fix(motion): RevealText vrai masque` — `RevealText.tsx`
- [x] `refine(hero): voile gradient` — `page.tsx`

## Phase 2 — Cream-dominant (plus gros levier)
- [x] `refactor(landing): cream-dominant` — `AboutSection.tsx` (dark→cream), `page.tsx` (wrapper)

## Phase 3 — Sections signature
- [x] ⭐ `feat(services): pin-scroll` — nouveau `ServicesPinScroll.tsx` **(proof, en premier)**
- [x] `feat(stats): barre count-up` — nouveau `StatsBand.tsx` (consolidé, retiré d'About)
- [x] `feat(statement): brancher StatementSection` — `page.tsx` (+ bg froid→cream-warm)

## Phase 4 — Copy POV
- [x] `content(copy): POV hero + about` — `dictionaries/fr.json` + `AboutSection.tsx`

## Phase 5 — Pages services (option B clair éditorial, 4 pages)
- [x] `feat(svc): layout + composants premium` — `services/layout.tsx`, `ServiceHero`, `MethodPinScroll`, `Faq`, `ServicePageBody`
- [x] `feat(svc): 4 pages branchées` — eie/edd/hse/pge → `ServicePageBody` + heroMeta/faq (FR props)
- [ ] (suite) migrer heroMeta/faq vers le pipeline i18n (fr→ar/en) quand souhaité

## Phase 6 — Mobile premium
- [x] `feat(mobile): gate pin choreography to desktop` — `ServicesPinScroll`, `MethodPinScroll` (mobile = rows pleine opacité, scannables ; hero/stats/services vérifiés premium à 390px)
- [x] bande image mobile pour les sections pin — ajoutée (`ServicesPinScroll` + `MethodPinScroll`)

## Phase 7 — Polish motion
- [x] `feat(a11y): reduced-motion pour framer-motion` — `MotionProvider` global (MotionConfig)
- [x] `refine(motion): allonger la tenue du pin` — `ServicesPinScroll`, `MethodPinScroll`
- [~] cross-fade des surfaces — **sauté** (gain marginal, tons cream proches, risque)

## Phase 0 — Hygiène ✅ (voir plus haut)

---
Légende : `[ ]` à faire · `[~]` en cours · `[x]` fait & commité
