# The Drafting Table — Design System

The living reference for abialas.pl. Documents what is **built**, not what was planned —
every value below is verified against the code. If you change the code, change this doc.

Specs this system grew from:
- `docs/superpowers/specs/2026-06-14-abialas-pl-redesign-design.md` — the Drafting Table concept
- `docs/superpowers/specs/2026-07-05-drafting-table-color-system.md` — the Variant C color system (added 2026-07)

## 1. Identity

**The Drafting Table.** A marketing engineer's work surface: mist ground, ink-blue type,
faint blueprint sheets behind hero zones, mono "measure" marks, hairline rules. Newsreader
carries the voice; Geist carries the UI. Vermilion was the single scarce accent until
2026-07, when the **Variant C color system** added room hues — color as wayfinding, never
decoration.

## 2. Palette

Core tokens — `src/styles/global.css` `@theme`:

| Token | Value | Role |
|---|---|---|
| `--color-bg` | `#E9EDF2` | mist — ground |
| `--color-ink` | `#15324E` | ink-blue — dominant |
| `--color-paper` | `#EAF0F6` | text on ink |
| `--color-body` | `#26384A` | body text |
| `--color-muted` | `#5F7384` | secondary text |
| `--color-accent` | `#DE3C26` | vermilion — scarce accent (= the system hue) |
| `--color-line` | `rgb(21 50 78 / 0.20)` | hairlines |
| `--color-line-2` | `rgb(21 50 78 / 0.42)` | stronger hairlines |

Hue registry — source of truth `src/data/hues.ts`, mirrored as tokens in `global.css`
(the mirror is **enforced by `tests/unit/hues.test.ts`** — registry, tokens, and
`[data-room]` block must all agree or the unit suite fails):

| Room | `raw` (decorative) | `text` (AA text/fills) |
|---|---|---|
| system | `#DE3C26` | `#C22D18` |
| ai | `#2257D6` | `#2257D6` |
| work | `#A5700C` | `#8A5D0B` |
| writing | `#2E7D4F` | `#297147` |
| about | `#7A4A9E` | `#7A4A9E` |

Plus `--link-on-ink: #E8A13C` (ochre link on the ink About band) and
`--gradient-spectrum: linear-gradient(90deg, #DE3C26, #A5700C, #2E7D4F, #2257D6)`.

**The usage rule:** `raw` = decorative marks, washes, underline bars, borders;
`text` = anything read (tinted labels, link hovers, fills under paper text).
Contrast is a hard gate, not a taste call: `tests/unit/hues.test.ts` computes WCAG
ratios for every declared pair — text variants ≥ 4.5:1 on mist, paper ≥ 4.5:1 on
text-variant fills, ochre ≥ 4.5:1 on ink, raw hues ≥ 3:1 on mist.
(That gate is why work is `#A5700C`, darkened from the spec's `#B97F14`, which
measured 2.92:1 on mist.)

## 3. Type

Fonts load via Fontsource variable imports at the top of `global.css`:

| Family | Token | Used for |
|---|---|---|
| Newsreader Variable | `--font-serif` | display headings, standfirsts, prose, InkedLink |
| Geist Variable | `--font-sans` | UI, nav, CTAs, body chrome |
| Geist Mono Variable | `--font-mono` | `.measure` marks, PieceMeta, code |

Scale (`@theme`, with `--text-*--line-height` pairs): display `3.75rem/1.05`,
h2 `2.25rem/1.15`, h3 `1.4rem/1.25`, body `1.125rem/1.65`, meta `0.8125rem/1.5`.
At ≤ 640px the display/h2/h3/body sizes step down via `:root` overrides
(`2.75rem / 1.85rem / 1.25rem / 1rem`).

## 4. Layout idioms

- `.container` — `max-width: var(--container-max)` (1200px), 24px side padding.
- `--section-padding` — `clamp(64px, 9vw, 150px)`; the vertical rhythm unit.
- `.blueprint` — 28px hairline grid (`background-image` line pairs) behind hero
  zones only, usually masked to fade (`.masthead`, `.alley-head__grid`, `.work-head__grid`).
- `.measure` — mono, `--text-meta`, uppercase, `0.08em` tracking, muted; the
  drafting-table annotation voice. Tinted per room (see §5).
- `.section-head` — measure label + trailing `.section-head__rule`, now a
  `height: 3px; background: var(--gradient-spectrum)` bar (per-page style blocks).
- `.display__grid` — the homepage exhibit grid (hairline-separated product cards).

## 5. Color as wayfinding — the rules

Where color may appear (everything on this list is built):

1. Masthead gradient wash — three radial tints (vermilion/cobalt/moss, 13–16% alpha) under the home blueprint (`index.astro` `.masthead::before`).
2. Gradient sliver under the home h1 — 130×6px `--gradient-spectrum` bar (`.masthead__name::after`).
3. Product-card hue bars — full-bleed `--card-hue-text` fill with paper text (see ProductCard, §7).
4. Gradient section rules — 3px `--gradient-spectrum` after section labels.
5. Tinted section labels — home: On display vermilion, Latest moss, About plum (`.measure--system/--writing/--about`).
6. Ink About band — full-width `--color-ink` panel, paper text, `--link-on-ink` ochre link (`index.astro` `.about`).
7. Essay-row ticks — 9px square before each meta in the essay's topic hue; title tints on row hover (EssayCard).
8. Room hues — every room: 6px `--room` top border on `main[data-room]`, measures tinted `--room-text`, h1 `.room-title::after` underline bar (96×10px).
9. Reading pages — progress bar, kicker, and prose link hover take the topic hue.
10. Featured ink plate — `/writing` opens with one essay in full inversion (ink
    ground, paper text, `--link-on-ink` ochre read-link — the About band's
    vocabulary). Topic hue appears only as a paper-outlined 9px tick; hues read
    muddy on ink, so nothing else on the plate is tinted. Selection:
    `featured: true` frontmatter, else newest published; the essay stays in its
    archive group below (the plate highlights, the catalog stays complete).

Where color may **not** appear: body text (always `--color-body`/`--color-ink`),
backgrounds outside the About band, the footer, and the nav — with one pre-existing
exception: the nav's active-page link uses `--color-accent` (`Nav.astro`
`a[aria-current="page"]`).

**Room mechanics:** a page opts in by passing `room` (a `HueKey`) to `BaseLayout`,
which stamps `data-room` on `<main>`. Global rules in `global.css` map
`[data-room="<key>"]` → `--room`/`--room-text` and apply the border/tint/underline.
Cards and essays get their hue **from data** (`products.ts` `hue` field; essay
`topics[0]` via `topicHue()`), never from position. The writing archive's group
labels wear the *target* product's hue via a per-group inline
`--room-text` override (`writing/index.astro`).

## 6. Motion

- **Masthead reveal** — `.reveal` fade-rise, 0.62s, staggered by `--i` (home masthead only).
- **Card lift** — product cards translate up 3px on hover/focus-within, with a hue
  corner mark (`.card::after`) and a paper-toned leader rule off the index label.
- **Reading progress** — 2px fixed bar, CSS scroll-driven animation
  (`animation-timeline: scroll(root block)`); hidden where unsupported.
- **CTA micro-motion** — Primary's dithered vermilion fill sweep; Secondary's corner
  brackets pull in 4px; InkedLink's node dot scales in.
- **The reduced-motion contract:** a global `prefers-reduced-motion` clamp sets all
  animation/transition durations to 0.01ms; components with transforms add explicit
  guards — cards drop the `transform` from their transition list entirely, the
  progress bar `display: none`, CTA corners stop translating. New transform motion
  MUST ship with a reduce guard; color transitions are always allowed.

## 7. Component inventory

| Component | One line |
|---|---|
| `Nav.astro` | Sticky mist bar; serif brand, sans links; active page in `--color-accent`. |
| `Footer.astro` | Title block on mist: identity row (name + tagline · social icon tiles), Substack embed framed by our hairline, Explore/Contact/Elsewhere columns, © strip. Outside `main`, never room-tinted; only accent-on-hover. |
| `ProductCard.astro` | Exhibit card. Reads `product.hue` → inline `--card-hue`/`--card-hue-text`; full-bleed `head--bar` fill (text variant) with paper index; hue corner mark; 3px hover lift. |
| `EssayCard.astro` | Archive row. `topicHue(topics[0])` → inline `--tick`; 9px square before the meta; title tints to `--tick` on row hover. |
| `PieceMeta.astro` | Role · timeframe · scope marks in mono between hairlines (outcome essays). |
| `ReadingProgress.astro` | 2px scroll-progress bar in `var(--room, var(--color-accent))`. |
| `PillarSchematic.astro` | The /system three-pillar schematic; its vermilion accents are already the room hue. |
| `cta/PrimaryCta.astro` | Ink plate, paper label, dithered vermilion `.fill` sweep on hover. |
| `cta/SecondaryCta.astro` | Transparent, four corner brackets that pull in and warm to accent. |
| `cta/InkedLink.astro` | Serif underline link with a vermilion node dot on hover. |

Layouts: `BaseLayout.astro` (shell + `room?: string` prop → `data-room`),
`PieceLayout.astro` (reading column; derives `room` from the essay topic).

## 8. Cookbook — how to add things

**A new room** (say `/labs`):
1. Add the entry to `HUES` in `src/data/hues.ts` (pick `raw`; add a darker `text` if raw fails AA).
2. Mirror both tokens in `global.css` `@theme` **and** add the `[data-room="labs"]` line.
3. If it's a product: add the `products.ts` entry with `hue: "labs"` — cards and the archive pick it up automatically.
4. The page passes `room="labs"` to `BaseLayout` and puts `room-title` on its h1.
5. Run `npx vitest run` — the hue test fails until registry, tokens, and `[data-room]` all agree, and until the contrast gate passes.

**A new essay topic:** extend `topicHue()` in `hues.ts` if the topic should map to a
room; anything unmapped already falls back to `writing` moss.

**A new colored element:** decide raw vs text by the rule in §2 (is it read?). Any
new text/surface pair must be added to `tests/unit/hues.test.ts` so the gate covers it.

## 9. Verification

```bash
npx vitest run        # unit — includes the hue mirror + WCAG contrast gate
npx playwright test   # e2e — 12 tests across all routed pages
npm run build         # 9 pages, must be green
```

Visual acceptance is screenshot comparison: shoot pages at 1440×900 fullPage with
`animations: 'disabled'` into `docs/superpowers/specs/reference/accent-variants/shots/built-*.png`
and read them against the `*-C.png` mockups (regenerable via `make-shots.mjs` there —
the mockups include injection hacks, so match *intent*; AA text variants are the
sanctioned difference). Note: `animations: 'disabled'` freezes the scroll-driven
progress bar — verify it via computed styles instead.

The Astro dev toolbar is disabled (`astro.config.mjs` `devToolbar`) — its
injected h1s ("Audit", "Settings"…) broke strict-mode `h1` assertions whenever
playwright reused a running dev server on :4321 instead of spawning `preview`.

---

**Deferred (not built):** OG-image refresh using the color system; a hue for any
future sixth room.
