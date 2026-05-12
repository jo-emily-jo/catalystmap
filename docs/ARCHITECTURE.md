# Architecture

## Runtime topology

CatalystMap is a Next.js 14 App Router application deployed on Vercel, backed by a Supabase-managed Postgres database.

```
User browser
  ↓ HTTPS
Vercel edge network
  ↓
Next.js server (Node.js runtime)
  ├─ Server components → /lib/db/* → Supabase (anon key, RLS-filtered)
  ├─ Server actions (admin) → /lib/db/* → Supabase (service role, bypasses RLS)
  ├─ Server actions (research) → Anthropic API (Claude Sonnet 4.6)
  └─ Middleware → jose JWT verification on /admin/* routes
```

## Folder structure rationale

```
/app                 Next.js routes (file-system routing)
  /admin/(authenticated)  Admin pages behind auth layout
  /admin/login            Login page (no sidebar, no auth required)
  /admin/actions          Server actions for all admin writes
  /catalyst/[slug]        Public catalyst detail page
  /themes/[slug]          Public theme detail page
/components              Reusable React components (kebab-case files)
  /admin                  Admin-specific form and display components
  /ui                     shadcn primitives (Button, Card, Input, etc.)
/lib
  /auth                   Session management (jose JWT)
  /db                     All Supabase query/mutation functions
  /scoring                Pure scoring functions + tests
  /types                  TypeScript interfaces mirroring DATA_MODEL.md
  /validations            Zod schemas for admin form validation
  /utils                  Shared utilities (cn, format)
/data/seed               JSON seed files (one per catalyst)
/scripts                 Operational scripts (seed, recompute)
/supabase/migrations     Numbered SQL migrations
```

## Data flow

### Read path (public pages)

1. Server component calls `/lib/db/*.ts` query function
2. Query function creates a Supabase client with the anon key
3. RLS policies filter to `is_active = true` rows
4. Mapper converts snake_case → camelCase at the DB boundary
5. Typed data flows to the server component for rendering
6. Score breakdown is read from the cached `score_breakdown` JSONB column

### Write path (admin)

1. Client component submits a form via Server Action
2. Server Action validates input with Zod schema
3. Server Action calls `/lib/db/*.ts` mutation function
4. Mutation function uses the service role client (bypasses RLS)
5. On relationship/source writes, `recomputeAndSaveScore()` fires automatically
6. Score is computed by `/lib/scoring/compute-relevance-score.ts` (pure, deterministic)
7. Updated score + breakdown written to `relationships` row
8. Score snapshot appended to `score_snapshots` (append-only audit log)

### AI research path

1. Curator selects a catalyst and clicks "Run research"
2. Server Action sends catalyst context to Claude Sonnet 4.6
3. Response parsed from `<json>...</json>` tags
4. Drafts rendered as unsaved cards in the UI
5. Curator clicks Approve → creates related company + relationship + sources via `/lib/db`
6. Score recompute fires automatically
7. Draft is marked as approved; `ai_assisted = true` on the relationship

## RLS strategy

| Table              | Anon (public reads)             | Service role (admin writes) |
| ------------------ | ------------------------------- | --------------------------- |
| themes             | SELECT always                   | All                         |
| catalyst_companies | SELECT where is_active = true   | All                         |
| catalyst_themes    | SELECT where catalyst is active | All                         |
| related_companies  | SELECT always                   | All                         |
| relationships      | SELECT where is_active = true   | All                         |
| sources            | SELECT always                   | All                         |
| score_snapshots    | SELECT always                   | All                         |

## Scoring lifecycle

1. Curator creates/edits a relationship or source (via admin or seed script)
2. `recomputeAndSaveScore(relationshipId)` is called
3. Fetches the relationship + all its sources from the DB
4. Calls `computeRelevanceScore()` — a pure function with zero side effects
5. Returns `{ score, breakdown }` — deterministic for the same inputs
6. Updates `relationships.relevance_score`, `score_version`, `score_breakdown`
7. Appends a row to `score_snapshots` with the full breakdown JSON
8. Frontend reads the cached score — never recomputes

The scoring engine (v2) prioritizes supply-chain relationships (supplier, customer) over thematic associations. Contract value and government procurement bonuses reward disclosed, high-confidence counterparty relationships.
