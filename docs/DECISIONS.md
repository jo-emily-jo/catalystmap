# Architecture Decision Records

## ADR-001: Next.js App Router

**Context:** The application needs server-side rendering for SEO, server components for data-heavy pages, and Server Actions for admin form handling.

**Decision:** Next.js 14 with the App Router (not Pages Router).

**Alternatives considered:** Pages Router (more mature, more community examples); Remix (similar SSR model); plain React SPA with API routes.

**Consequences:** Server components reduce client bundle size for public pages. Server Actions eliminate the need for separate API endpoints for admin forms. The App Router's file-system routing maps cleanly to our URL structure. Trade-off: some ecosystem libraries haven't fully adapted to RSC patterns.

---

## ADR-002: Supabase (managed Postgres)

**Context:** The application needs a relational database with row-level security, a REST API layer, and minimal operational overhead for a single-developer MVP.

**Decision:** Supabase (managed Postgres with PostgREST, RLS, and a JS client).

**Alternatives considered:** Self-hosted Postgres + Prisma (more control, more ops burden); PlanetScale (MySQL, no native RLS); Firebase (NoSQL, poor fit for relational data model).

**Consequences:** RLS policies enforce read/write boundaries without application-level checks. The Supabase JS client provides typed queries. Service role key bypasses RLS for admin writes. Trade-off: vendor lock-in on the hosting layer, though the underlying Postgres is portable.

---

## ADR-003: Modern Data Tool visual identity

**Context:** The product needs a visual identity that signals credibility and professionalism for a financial research tool, without looking like a consumer social app or a 1990s finance terminal.

**Decision:** "Modern Data Tool" direction — reference: Linear, Vercel, Stripe Dashboard. Light mode only for MVP. Geist fonts, indigo-600 accent, flat surfaces, hairline borders, generous whitespace.

**Alternatives considered:** "Editorial" (NYT/FT-inspired serif typography — too content-heavy for a data tool); "Finance Pro" (Bloomberg-inspired dark mode with dense data tables — intimidating for retail investors and overkill for MVP data volume).

**Consequences:** Clean, approachable interface that positions the product between consumer and institutional. Consistent with the portfolio-piece goal. Trade-off: light-mode only may feel incomplete to users who prefer dark mode (deferred to post-MVP).

---

## ADR-004: Application-level score recompute (not DB trigger)

**Context:** When a relationship or source is created/updated/deleted, the relevance score must be recomputed. This could happen in a Postgres trigger or in the application layer.

**Decision:** Application-level recompute inside `/lib/db/relationships.ts` and `/lib/db/sources.ts`. The `recomputeAndSaveScore()` function is called after every write.

**Alternatives considered:** Postgres trigger calling a plpgsql function (keeps logic in the DB, but scoring formula is complex and harder to test); Postgres trigger calling an edge function (adds latency and deployment complexity).

**Consequences:** Scoring logic stays in TypeScript where it's testable with Vitest. All writes go through `/lib/db/*`, so the recompute hook is guaranteed to fire. Trade-off: if someone writes directly to the DB (bypassing the app), scores won't update — acceptable for a single-curator MVP.

---

## ADR-005: Claude Sonnet 4.6 for AI research

**Context:** The AI research helper needs to identify supply-chain relationships with structured evidence. The model must be capable enough for accurate financial relationship identification but fast enough for interactive use.

**Decision:** Claude Sonnet 4.6 (`claude-sonnet-4-6`).

**Alternatives considered:** Claude Haiku 4.5 (faster and cheaper, but too shallow for evidence-quality output — tends to hallucinate sources); Claude Opus 4.6 (highest quality, but 3-5x slower and more expensive — overkill for a propose-and-review workflow where the curator validates everything).

**Consequences:** Good balance of speed (~5-15s per request), cost, and evidence quality. The curator-in-the-loop model means AI mistakes are caught before they enter the database. Rate-limited to 5 calls/hour per session.

---

## ADR-006: Native forms + Server Actions (not react-hook-form)

**Context:** Admin forms need validation, error display, and server-side submission. The project could use react-hook-form (popular, feature-rich) or native HTML forms with Server Actions (modern RSC pattern).

**Decision:** Native HTML `<form>` + Server Actions + Zod validation + `useFormState`.

**Alternatives considered:** react-hook-form + zod resolver (widely adopted, but adds a dependency and fights against the Server Actions model); Formik (legacy, larger bundle).

**Consequences:** No extra dependency. Forms work as progressive enhancement — they submit even without JavaScript. Zod schemas validate on the server inside each action. `useFormState` surfaces field-level errors. Trade-off: less ergonomic for complex multi-step forms (not needed in MVP).

---

## ADR-007: Score breakdown stored as JSONB on relationships

**Context:** The score breakdown (all component values + weights) must be available in the UI for the popover. It could be fetched from `score_snapshots` (the audit log) or denormalized onto the `relationships` row.

**Decision:** Add a `score_breakdown` JSONB column on `relationships`, written alongside `relevance_score` on every recompute. `score_snapshots` remains as the append-only audit trail.

**Alternatives considered:** Fetch the latest `score_snapshots` row per relationship at read time (schema unchanged, but requires an extra subquery per relationship); recompute at read time in the server component (zero storage cost, but violates SCORING.md rule "the frontend never recomputes").

**Consequences:** Single fetch per page load — no extra join. The breakdown is always consistent with the cached score. `score_snapshots` provides historical audit. Trade-off: mild denormalization (breakdown is stored in two places), but the source of truth is always the latest recompute.
