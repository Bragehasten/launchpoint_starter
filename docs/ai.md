# AI Content Layer

Admin-only content generation via the Anthropic API. Everything the model
produces is a **draft a human reviews** — nothing auto-publishes, ever.

## Setup

```bash
# .env.local (per project — each client gets its own key + spend limit)
ANTHROPIC_API_KEY=sk-ant-…       # console.anthropic.com → API keys
ANTHROPIC_MODEL=                 # optional override; sensible default set in lib/env.ts
```

Without the key, AI Studio shows a "not configured" note and everything
else works normally. Costs are usage-based — single generations cost cents.

## AI Studio (Admin → AI Studio)

Eight presets: service descriptions, SEO title + meta (3 options), FAQ
sets, blog drafts (Markdown), rewrite-in-brand-voice, testimonial
summaries, social posts, and service-area page copy. Output lands in a
result pane with a copy button — intentionally not auto-inserted.

Every prompt automatically carries the **business context** (name,
industry, positioning, real services, locations, and areas from the
database) plus brand-voice rules that ban filler phrases and — most
importantly — **forbid inventing facts**. The "Facts / notes" field exists
so YOU supply the true specifics; the model is told to use those and claim
nothing else.

## The flagship: service-area drafts

The "Draft a service-area page" panel generates a unique intro, body, and
three FAQs for a city and saves it as an **inactive** `service_areas` row.
Workflow: feed it true local facts → review the draft in Admin → Service
Areas → edit → flip Visible. Ten unique city pages become an afternoon of
review instead of a week of writing — with the doorway-page rule
(docs/service-areas.md) enforced by prompt design and by you.

## Guardrails (implementation)

Server-only key (`lib/ai/client.ts`, one choke point for all usage), editor
role required, 10 generations/min per user, output validated with Zod where
structured (area drafts), rejected when malformed. Architecture note: the
prompt presets live in `lib/ai/tasks.ts` — tune voice rules per client in
`lib/ai/context.ts` (`BRAND_VOICE_RULES`).
