# Architecture

## Folder structure

```
app/                    Routes only. Pages compose components; they contain no business logic.
actions/                Server actions ("use server"). All mutations live here, validated with Zod.
components/
  ui/                   shadcn/ui primitives. Generic, unopinionated, no business logic.
  shared/               App-level building blocks (header, footer, theme, container).
  sections/             Marketing page sections (hero, features, pricing...). Config/props-driven.
config/                 Site identity & feature flags. The rebrand surface.
lib/                    Pure utilities and integrations (env, fonts, utils; later: supabase, stripe).
hooks/                  Reusable client hooks.
types/                  Shared TypeScript types.
emails/                 React Email templates (Resend).
docs/                   This documentation.
```

## Rules

**Server Components by default.** Add `"use client"` only when the component needs state, effects, or browser APIs — and push the client boundary as deep as possible (e.g. `ThemeToggle` is a client component; `SiteHeader` that renders it is not).

**No raw `process.env`.** Import `env` from `lib/env.ts`. Every variable is declared and validated with Zod; the app fails fast at boot with a readable error. Add new vars to the schema and `.env.example` in the same commit.

**No hardcoded site identity.** Name, nav, URLs, and feature toggles come from `config/site.ts`. Colors, radius, and fonts come from CSS variables in `app/globals.css` and `lib/fonts.ts`.

**Class composition with `cn()`.** Never concatenate class strings manually. Variant-driven components use `cva`.

**Validation at the boundary.** All external input (forms, webhooks, query params) is parsed with Zod before use. Internal code can then trust its types.

**Accessibility is not optional.** Landmarks (`header`, `main`, `footer`, `nav` with labels), skip-to-content link, `aria-label` on icon-only buttons, focus-visible styles, and reduced-motion support are already wired in — keep them intact when extending.

## Theming and dark mode

`next-themes` toggles the `.dark` class on `<html>` (`suppressHydrationWarning` prevents a hydration mismatch, `disableTransitionOnChange` prevents flashes). Tokens are defined twice in `globals.css` (`:root` and `.dark`) and mapped to Tailwind utilities via `@theme inline` — components never reference raw colors, only semantic utilities like `bg-background` or `text-muted-foreground`.

## Conventions

- Files: kebab-case (`site-header.tsx`). Components: PascalCase. One exported component concern per file.
- Imports: `@/` alias always; no relative `../../` climbing.
- Named exports for components (default exports only where Next.js requires them: pages, layouts).
- Every non-obvious module gets a short doc comment explaining _why_ it exists.

## Verification gates

Before a milestone is complete: `npm run build`, `npm run lint`, `npm run typecheck`, and `npm run format:check` all pass clean.
