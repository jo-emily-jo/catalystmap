# CLAUDE.md

This file is the persistent system context for Claude Code while working on this project. Read it at the start of every session.

---

## Project

**Project name:** CatalystMap
**Domain:** getcatalystmap.com (brand stays **CatalystMap**; the `get` prefix is a domain convention only and must never appear in product copy, headers, logos, or page titles)
**Repository:** github.com/jo-emily-jo/catalystmap
**One-liner:** A research web app that maps **catalyst companies** (companies currently driving major market narratives) to publicly traded companies with evidence-based exposure.

**This is a research and education tool. Not financial advice. Not a recommendation engine. Not a trading product.**

---

## Domain vocabulary (use these terms exactly)

- **Catalyst company** — any company (public or private) currently gaining major market attention because it represents an important theme. The set is open and lives in data. Examples are seed data, not product invariants. **Never hard-code specific catalyst names or slugs anywhere in code.**
- **Theme** — a market-level narrative bucket (AI, Semiconductors, Space, Defense, Data Center, Robotics, Energy, Biotech, …). Extensible. Lives in the `themes` table.
- **Related company** — a publicly traded company with some exposure to a catalyst.
- **Relationship** — typed, evidenced, scored link from catalyst to related company.
- **Source** — a URL with a quality tier supporting a relationship.
- **Relevance score** — 0–100 deterministic composite. Defined in `docs/SCORING.md`.

Do not invent synonyms. Do not call catalysts "core companies."

---

## Source-of-truth documents

Always re-read these before non-trivial work:

- `docs/PRD.md` — product scope and non-goals
- `docs/DATA_MODEL.md` — DB schema and TypeScript types
- `docs/SCORING.md` — relevance scoring formula
- `docs/ARCHITECTURE.md` — folder structure and runtime topology (to be drafted)
- `docs/DECISIONS.md` — ADRs for material choices (to be drafted)

If a request conflicts with these docs, **stop and ask** rather than diverging.

---

## Tech stack (do not change without asking)

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript, `strict: true`, no `any`
- **Styling:** Tailwind CSS + shadcn/ui
- **DB:** Supabase (Postgres) — service-role writes only on the server
- **Hosting:** Vercel
- **Testing:** Vitest for unit, Playwright for e2e
- **Lint/format:** ESLint + Prettier + Husky pre-commit

---

## Visual identity

**Direction:** Modern data tool — reference look: Linear, Vercel, Stripe Dashboard.

**Tokens (apply in `tailwind.config.ts` and `app/globals.css`):**

- Font sans: Geist (Next.js default), fallback Inter
- Font mono: Geist Mono, fallback JetBrains Mono
- Accent: `indigo-600` (`#4F46E5`)
- Background primary: `#FFFFFF`
- Background secondary: `#FAFAFA`
- Text primary: `#0A0A0A`
- Text secondary: `#525252`
- Border: `#E5E5E5` (default), `#D4D4D4` (emphasized)
- Radius: shadcn default (`--radius: 0.5rem`)
- Mode: **light only for MVP**. Dark-mode toggle is a Sprint 5 polish item — do not implement now.

**Aesthetic rules:**

- Flat surfaces — no gradients, no heavy shadows, no glow effects
- Hairline borders (1px or thinner), never heavy
- Generous whitespace; never crowd
- Typography hierarchy through size and weight (400 / 500 only — no 600/700)
- Mono font for tickers, numerical scores, and source dates only; never for body copy
- Sentence case in UI copy; no Title Case, no ALL CAPS
- Avoid emoji in product UI

---

## Folder layout

```
/app                Next.js routes (App Router)
  /(public)         public pages: home, theme, catalyst, search
  /admin            password-gated curator routes
  /api              route handlers (server-only writes)
/components         React components (kebab-case files, PascalCase exports)
  /ui               shadcn primitives
/lib
  /db               Supabase query functions — ALL DB access goes here
  /scoring          pure scoring functions + tests
  /types            shared TypeScript types (mirror docs/DATA_MODEL.md)
  /utils
/data
  /seed             JSON seed files, one per catalyst
/scripts            seed, migrate, recompute-scores
/supabase
  /migrations       SQL migrations, numbered
/docs               source-of-truth docs (PRD, DATA_MODEL, SCORING, …)
```

---

## Coding rules

1. **TypeScript strict.** No `any`, no implicit `unknown` escape hatches.
2. **No inline DB queries in components.** All DB access goes through `/lib/db/*.ts`.
3. **Server components by default.** Use `"use client"` only when an interaction or hook requires it.
4. **Component size:** if a component exceeds ~150 lines, propose splitting before continuing.
5. **No catalyst names in code.** Catalysts are data. The codebase must work identically if every seed catalyst is replaced.
6. **Scoring is pure.** Every function in `/lib/scoring/` is deterministic and side-effect-free.
7. **Every relationship has at least one source.** Enforce in admin form validation and at the DB layer (via trigger or app-level check).
8. **All public pages render a disclaimer footer.** Wording: _"For research and educational purposes only. Not financial advice."_

---

## Verification

Before marking any task complete:

1. `npm run typecheck` passes
2. `npm run lint` passes
3. `npm test` passes (for any file touched in `/lib/scoring`, `/lib/db`, `/lib/utils`)
4. For UI changes: describe in 2–3 sentences what the user should see when they reload, and confirm no console errors.
5. For DB changes: a migration file exists and runs cleanly against a fresh DB.

Do **not** mark work done by saying "I've implemented X." Show the diff, paste the test output, describe the visible behavior.

---

## Before doing any of these, ask first

- Adding a new dependency
- Changing the DB schema (writing or modifying a migration)
- Changing the scoring formula or weights
- Adding a new route
- Touching authentication / authorization
- Modifying `CLAUDE.md` itself

---

## Working style

- Default to **Plan Mode** for non-trivial tasks. Propose a plan, list files to touch, list risks, then wait for approval.
- Prefer many small commits over one large one. One logical change per commit.
- When uncertain about an interface or library behavior, write a tiny isolated probe first instead of guessing.
- When the user asks for a feature, restate it back in your own words before starting.

---

## What this product is not (rules of engagement)

- Not a stock-picking tool
- Not a price predictor
- Not a portfolio tracker
- Not connected to any brokerage
- Not auto-discovering catalysts in v1 — humans curate

If a request would push the product in any of these directions, flag it before implementing.

---

## Disclaimer text

This exact text must appear in the global footer of every public page:

> For research and educational purposes only. Not financial advice and not a recommendation to buy or sell any security.
