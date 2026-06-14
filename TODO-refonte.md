# TODO — Refonte premium

Branche : `refonte/premium-storytelling` · Plan détaillé : [`docs/REFONTE-PLAN.md`](docs/REFONTE-PLAN.md)

Règle : **1 case = 1 commit**, `npm run build` 0 erreur / 0 warning avant chaque commit.

## Phase 0 — Hygiène
- [ ] `fix(header): retirer backdrop-blur` — `app/globals.css`

## Phase 1 — Hero
- [x] `fix(hero): échelle typo + italique + i18n` — `page.tsx`
- [ ] `fix(motion): RevealText vrai masque` — `RevealText.tsx`
- [ ] `refine(hero): voile gradient` — `page.tsx`

## Phase 2 — Cream-dominant (plus gros levier)
- [x] `refactor(landing): cream-dominant` — `AboutSection.tsx` (dark→cream), `page.tsx` (wrapper)

## Phase 3 — Sections signature
- [x] ⭐ `feat(services): pin-scroll` — nouveau `ServicesPinScroll.tsx` **(proof, en premier)**
- [ ] `feat(stats): barre count-up` — nouveau `StatsBand.tsx`
- [ ] `feat(statement): brancher StatementSection` — `page.tsx`

## Phase 4 — Copy POV
- [ ] `content(copy): POV hero + about` — `dictionaries/fr.json`

## Phase 5 — Pages services
- [ ] `feat(svc): hero image-led + contexte POV` — template + `ServiceHero.tsx`
- [ ] `feat(svc): méthode pin-scroll` — `MethodPinScroll.tsx`
- [ ] `feat(svc): FAQ + livrable band` — `Faq.tsx`

## Phase 6 — Mobile premium
- [ ] `feat(mobile): sections mobile-native`

## Phase 7 — Polish motion
- [ ] `refine(motion): cross-fade + élaguer`

---
Légende : `[ ]` à faire · `[~]` en cours · `[x]` fait & commité
