# Claude Code — Step 2: Design tokens + enriched palette (manifesto v2)

## Context

The design system for bthexpert.com is being consolidated onto `docs/DESIGN-MANIFESTO-v2.md` (already in the repo). This task brings `app/globals.css` to the v2 target token set: enriched palette (new cream/forest surfaces), re-authorized subtle shadows, motion tokens, hero overlays, and the full type scale.

**Important:** the codebase was refactored manually this morning. Do NOT assume the current state of `globals.css`. Read it first, then converge to the target end-state below.

## Rules (strict)

1. ONE commit for this task.
2. Read `globals.css` and grep the codebase BEFORE editing — current token names are unknown.
3. This task touches `app/globals.css` primarily; it may ALSO touch component files ONLY to update references to renamed tokens (see "Renamed tokens" below). No other changes.
4. Run `npm run build` — 0 errors before committing.
5. If a token rename would break a component and the fix is ambiguous, STOP and ask.
6. Use Plan Mode (Shift+Tab) first.

## Pre-flight

1. View `docs/DESIGN-MANIFESTO-v2.md` sections 2 (typography), 3 (color), 5 (motion tokens), 6 (depth).
2. View `app/globals.css` — note every token currently defined.
3. Grep for token usage that might be renamed/removed:
   ```bash
   grep -rn "shadow-soft\|shadow-medium\|shadow-deep\|shadow-subtle\|shadow-card\|shadow-float" app/ components/
   grep -rn "radius-xl\|radius-lg\|radius-md\|radius-sm" app/ components/
   grep -rn "duration-" app/ components/
   ```
4. Report: current token state + which components reference tokens that will change. Then proceed.

## Target end-state — the `@theme` block must contain EXACTLY these tokens

```css
@theme {
  /* ── Brand ── */
  --color-brand:        #1a2e1e;
  --color-brand-deep:   #0f1c12;
  --color-brand-soft:   #2a4530;

  /* ── Gold (accent — repère only, never decoration) ── */
  --color-gold:         #c9a96e;
  --color-gold-deep:    #a88a4c;

  /* ── Light surfaces — the canvas ── */
  --color-cream-soft:   #faf7f2;
  --color-cream:        #f5f0e8;
  --color-cream-warm:   #efe7d6;
  --color-cream-deep:   #ede8dc;
  --color-forest-light: #eef2ec;

  /* ── Text ── */
  --color-ink:          #1a2e1e;
  --color-ink-soft:     #3d4a40;
  --color-muted:        #6b7455;
  --color-line:         #d8d0bc;

  /* ── Text on brand surfaces (footer, hero overlay) ── */
  --color-on-brand-strong: var(--color-cream);
  --color-on-brand-muted:  color-mix(in srgb, var(--color-cream) 65%, var(--color-brand));
  --color-on-brand-faint:  color-mix(in srgb, var(--color-cream) 40%, var(--color-brand));

  /* ── Cinematic hero overlays ── */
  --overlay-hero:      linear-gradient(180deg, rgb(15 28 18 / 0.35) 0%, rgb(15 28 18 / 0.65) 100%);
  --overlay-hero-side: linear-gradient(90deg, rgb(15 28 18 / 0.7) 0%, transparent 70%);

  /* ── Fonts (locked: Fraunces + Geist) ── */
  --font-display: var(--font-fraunces), Georgia, serif;
  --font-sans:    var(--font-geist), system-ui, sans-serif;

  /* ── Type scale (fluid) ── */
  --text-hero:    clamp(2.75rem, 5vw + 1.5rem, 6.5rem);
  --text-display: clamp(2.25rem, 4vw + 1rem, 4rem);
  --text-h1:      clamp(2rem, 3vw + 0.75rem, 3.25rem);
  --text-h2:      clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem);
  --text-h3:      clamp(1.25rem, 2vw, 1.625rem);
  --text-body:    clamp(1rem, 0.4vw + 0.875rem, 1.0625rem);
  --text-small:   0.9375rem;
  --text-caption: 0.8125rem;

  /* ── Easing — premium curves, never defaults ── */
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:   cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out-soft: cubic-bezier(0.4, 0, 0.2, 1);

  /* ── Durations ── */
  --duration-fast: 200ms;
  --duration-base: 400ms;
  --duration-slow: 700ms;
  --duration-hero: 1000ms;

  /* ── Shadows — subtle, double-layer, brand-tinted, ≤0.08 opacity ── */
  --shadow-subtle: 0 1px 2px rgb(26 46 30 / 0.04), 0 2px 8px rgb(26 46 30 / 0.04);
  --shadow-card:   0 1px 3px rgb(26 46 30 / 0.05), 0 8px 24px rgb(26 46 30 / 0.06);
  --shadow-float:  0 4px 12px rgb(26 46 30 / 0.08), 0 16px 48px rgb(26 46 30 / 0.08);

  /* ── Radius ── */
  --radius-sm:   4px;
  --radius-md:   8px;
  --radius-lg:   12px;
  --radius-full: 9999px;

  /* ── Containers ── */
  --container-max:    1280px;
  --container-narrow: 720px;
  --container-prose:  640px;
}
```

Remove any token NOT in this list (e.g. old `--shadow-soft/medium/deep`, `--radius-xl`, `--color-gold-soft` if unused, etc.) — but only after handling references (next section).

## Base styles (`@layer base`) — target

```css
@layer base {
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    /* NOTE: no scroll-behavior: smooth — Lenis will handle scroll in a later step */
  }

  body {
    background-color: var(--color-cream);
    color: var(--color-ink);
    font-family: var(--font-sans);
  }

  h1, h2, h3, h4 {
    font-family: var(--font-display);
    font-weight: 500;
    letter-spacing: -0.02em;
    line-height: 1.1;
    color: var(--color-ink);
  }

  ::selection {
    background-color: var(--color-brand);
    color: var(--color-cream);
  }

  :focus-visible {
    outline: 2px solid var(--color-gold);
    outline-offset: 3px;
    border-radius: var(--radius-sm);
  }
}
```

If `scroll-behavior: smooth` is present, remove it.

## Renamed / removed tokens — handle references first

If the grep found components using tokens that change name or are removed, update those references in the SAME commit. Likely mappings:

- `--shadow-soft` → `--shadow-subtle`
- `--shadow-medium` → `--shadow-card`
- `--shadow-deep` → `--shadow-float`
- `--radius-xl` (24px) → `--radius-lg` (12px)
- Any `shadow-soft`/`shadow-medium`/`shadow-deep` Tailwind utility classes → the new names

Do NOT leave dangling references to removed tokens. If a component uses a removed token in a way that has no clean mapping, STOP and ask.

## Acceptance

- `npm run build` passes, 0 errors.
- `npm run dev` — the site still renders on `/fr`, `/ar`, `/en` (no broken styles).
- Grep confirms no remaining references to removed token names:
  ```bash
  grep -rn "shadow-soft\|shadow-medium\|shadow-deep\|radius-xl" app/ components/
  ```
  → returns nothing.
- The `@theme` block matches the target end-state exactly.

## Commit message

```
feat(design): consolidate tokens to manifesto v2 — enriched palette, motion, depth

Per docs/DESIGN-MANIFESTO-v2.md sections 2, 3, 5, 6.

- Adds light surfaces: cream-soft, cream-warm, cream-deep, forest-light
- Adds cinematic hero overlay tokens
- Adds full fluid type scale (hero → caption)
- Adds motion tokens (durations) alongside existing easings
- Re-authorizes subtle shadows (double-layer, brand-tinted, ≤0.08)
- Radius capped at 12px (lg); removes xl
- Adds on-brand text color tokens via color-mix
- Removes scroll-behavior: smooth (Lenis handles scroll later)
- Updates component references to renamed shadow/radius tokens
```

## What this task does NOT do

- No font changes (Fraunces + Geist already locked)
- No motion library install (GSAP/Lenis/Framer = a later step)
- No header / hero / section rebuild (later steps)
- No component restyling beyond fixing renamed-token references

End of prompt.
