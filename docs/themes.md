# Theme System

A theme restyles the entire site — typography, color, radius, shadows,
spacing, motion, header behavior — without touching a single component.
Components read tokens; themes set tokens.

## Picking a theme (per client)

```ts
// config/theme.ts
export const activeThemeName: ThemeName = "luxury";
```

That's the whole switch. Shipped themes: **Modern** (neutral base),
**Luxury**, **Minimal**, **Bold**, **Industrial**. Preview them live at
`/dev/themes` in both color modes.

## Anatomy of a theme

Two files:

1. **`themes/<name>.css`** — token overrides under `html[data-theme="<name>"]`:
   colors (oklch), `--display` font stack, `--heading-weight/-tracking/-transform`,
   `--radius`, `--elevation-card/-high`, `--section-space`.
2. **An entry in `themes/index.ts`** — what CSS can't express: motion
   intensity (`none | subtle | expressive`) and header defaults
   (`split | centered`, sticky, transparent).

## The token vocabulary

| Token                                   | Consumed by                                  |
| --------------------------------------- | -------------------------------------------- |
| shadcn color set (`--primary`, …)       | every component, via Tailwind utilities      |
| `--display` + `--heading-*`             | the `heading` utility — all headings at once |
| `--radius`                              | buttons, inputs, cards (shadcn scale)        |
| `--elevation-card` / `--elevation-high` | `shadow-card` / `shadow-elevated` utilities  |
| `--section-space`                       | `section-space` utility (`<Section>` rhythm) |
| `motion` (TS)                           | animation wrappers scale or go static        |
| `header` (TS)                           | header layout/sticky/transparent variants    |

## Writing theme #6

1. Copy the closest shipped theme's CSS file; rename the selector.
2. **Every color set in the light block must also be set in `.dark`** —
   `html[data-theme]` outranks the base `.dark` selector, so a missing dark
   value shows the light color in dark mode.
3. New display font? Self-hosted only: add the `@fontsource-variable/*`
   package, `@import` it in `app/globals.css`. Font files are lazy — unused
   theme fonts are never downloaded by browsers.
4. Import the CSS file in `app/globals.css`, add the meta entry in
   `themes/index.ts`, QA at `/dev/themes` in both modes.

## Client tweaks vs. new themes

A client who wants Luxury with a different primary is an override block in
`globals.css` — not a new theme. A new theme is warranted when the
_personality_ differs (type, shape, motion), not just the palette.
