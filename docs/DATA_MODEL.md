# Data Model

**Version:** 0.1
**Target DB:** Postgres (Supabase)
**Conventions:** snake_case columns, `id` UUID primary keys (`gen_random_uuid()`), `created_at` / `updated_at` timestamptz on every table.

This schema is intentionally agnostic about which catalysts exist. All catalyst identities live in data, never in code.

---

## Entity overview

```
themes (1) ────< catalyst_themes >──── (N) catalyst_companies
                                              │
                                              │ 1
                                              │
                                              ▼ N
                                       relationships  ────< sources
                                              │
                                              │ N
                                              │
                                              ▼ 1
                                       related_companies

relationships ──< score_snapshots   (audit log of every score computation)
```

---

## Tables

### `themes`

A theme is a market-level narrative bucket. New themes can be added at any time.

| Column                     | Type                 | Notes                                 |
| -------------------------- | -------------------- | ------------------------------------- |
| `id`                       | uuid PK              |                                       |
| `slug`                     | text UNIQUE NOT NULL | URL-safe, e.g. `ai`, `semiconductors` |
| `name`                     | text NOT NULL        | Display name                          |
| `description`              | text                 | 1–2 sentence summary                  |
| `icon_name`                | text                 | Lucide icon identifier, nullable      |
| `display_order`            | int DEFAULT 0        | For homepage ordering                 |
| `created_at`, `updated_at` | timestamptz          |                                       |

Indexes: `(slug)`.

---

### `catalyst_companies`

The companies driving market attention. Public or private. Not a fixed list.

| Column                     | Type                 | Notes                                                 |
| -------------------------- | -------------------- | ----------------------------------------------------- |
| `id`                       | uuid PK              |                                                       |
| `slug`                     | text UNIQUE NOT NULL | URL-safe, e.g. `anthropic` (data, not enum)           |
| `name`                     | text NOT NULL        | Display name                                          |
| `legal_name`               | text                 | Optional formal name                                  |
| `country`                  | text                 | ISO 3166-1 alpha-2, e.g. `US`, `KR`                   |
| `is_public`                | boolean NOT NULL     |                                                       |
| `ticker`                   | text                 | Required if `is_public = true`                        |
| `exchange`                 | text                 | Required if `is_public = true` (e.g. `NASDAQ`, `KRX`) |
| `short_description`        | text NOT NULL        | 1–2 sentences                                         |
| `thesis_md`                | text NOT NULL        | Markdown — "why this catalyst matters now"            |
| `founded_year`             | int                  | Optional                                              |
| `website`                  | text                 |                                                       |
| `logo_url`                 | text                 |                                                       |
| `is_active`                | boolean DEFAULT true | Soft-retire without delete                            |
| `created_at`, `updated_at` | timestamptz          |                                                       |

Indexes: `(slug)`, `(is_active)`.

Check constraint: if `is_public` then `ticker` and `exchange` not null.

---

### `catalyst_themes`

M-to-N junction. A catalyst can belong to multiple themes; a theme has many catalysts.

| Column        | Type                         | Notes                                              |
| ------------- | ---------------------------- | -------------------------------------------------- |
| `catalyst_id` | uuid FK → catalyst_companies |                                                    |
| `theme_id`    | uuid FK → themes             |                                                    |
| `is_primary`  | boolean DEFAULT false        | Exactly one primary per catalyst (enforced in app) |
| `created_at`  | timestamptz                  |                                                    |

Primary key: `(catalyst_id, theme_id)`.
Indexes: `(theme_id)`.

---

### `related_companies`

Publicly traded companies. Stored once, reused across many catalysts.

| Column                     | Type          | Notes                                       |
| -------------------------- | ------------- | ------------------------------------------- |
| `id`                       | uuid PK       |                                             |
| `ticker`                   | text NOT NULL |                                             |
| `exchange`                 | text NOT NULL |                                             |
| `name`                     | text NOT NULL |                                             |
| `country`                  | text          | ISO code                                    |
| `sector`                   | text          | GICS sector                                 |
| `industry`                 | text          | GICS industry                               |
| `market_cap_usd`           | bigint        | Nullable; refreshed periodically (post-MVP) |
| `short_description`        | text          |                                             |
| `website`                  | text          |                                             |
| `logo_url`                 | text          |                                             |
| `created_at`, `updated_at` | timestamptz   |                                             |

Unique constraint: `(ticker, exchange)`.
Indexes: `(ticker)`, `(sector)`.

---

### `relationships`

The heart of the data model. One row per (catalyst, related_company) pair.

| Column                      | Type                           | Notes                                                                                                  |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `id`                        | uuid PK                        |                                                                                                        |
| `catalyst_id`               | uuid FK → catalyst_companies   |                                                                                                        |
| `related_company_id`        | uuid FK → related_companies    |                                                                                                        |
| `relationship_type`         | text NOT NULL                  | enum: `investment`, `customer`, `supplier`, `partnership`, `infrastructure`, `thematic`, `speculative` |
| `relationship_strength`     | text NOT NULL                  | enum: `direct`, `indirect`, `speculative`                                                              |
| `summary`                   | text NOT NULL                  | 1–2 sentences for the table row                                                                        |
| `revenue_exposure_pct`      | numeric(5,2)                   | Estimated % of related co.'s revenue tied to catalyst; nullable                                        |
| `first_observed_at`         | date                           |                                                                                                        |
| `last_verified_at`          | date NOT NULL                  | Drives recency_score                                                                                   |
| `is_active`                 | boolean DEFAULT true           |                                                                                                        |
| `relevance_score`           | numeric(5,2)                   | Computed; cached here for sort performance                                                             |
| `score_version`             | int                            | Which scoring formula was used                                                                         |
| `hype_risk`                 | text NOT NULL DEFAULT 'low'    | enum: `low`, `medium`, `high`                                                                          |
| `curator_notes`             | text                           | Internal — not shown publicly by default                                                               |
| `contract_value_usd`        | numeric(18,2)                  | Nullable. Known disclosed contract value in USD (e.g. SpaceX-NASA HLS = 2_900_000_000).                |
| `is_government_procurement` | boolean NOT NULL DEFAULT false | Flag when the relationship is a government / agency procurement contract (DoD, NASA, ESA, etc.).       |
| `created_at`, `updated_at`  | timestamptz                    |                                                                                                        |

Unique constraint: `(catalyst_id, related_company_id)`.
Indexes: `(catalyst_id, relevance_score DESC)`, `(related_company_id)`, `(is_active)`.

---

### `sources`

Evidence URLs supporting a relationship. A relationship may have many sources.

| Column            | Type                                      | Notes                                                             |
| ----------------- | ----------------------------------------- | ----------------------------------------------------------------- |
| `id`              | uuid PK                                   |                                                                   |
| `relationship_id` | uuid FK → relationships ON DELETE CASCADE |                                                                   |
| `url`             | text NOT NULL                             |                                                                   |
| `title`           | text                                      |                                                                   |
| `source_type`     | text NOT NULL                             | enum below                                                        |
| `source_quality`  | int NOT NULL                              | 0–100, derived from `source_type` (denormalized for fast scoring) |
| `published_at`    | date                                      | When the underlying content was published                         |
| `accessed_at`     | timestamptz NOT NULL                      | When the curator verified the URL                                 |
| `excerpt`         | text                                      | Short quoted evidence                                             |
| `created_at`      | timestamptz                               |                                                                   |

`source_type` enum: `sec_filing`, `earnings_call`, `official_announcement`, `reuters`, `bloomberg`, `ft`, `wsj`, `analyst_report`, `news_article`, `blog`, `community`.

Indexes: `(relationship_id)`, `(published_at DESC)`.

---

### `score_snapshots`

Append-only audit log. Every time a score is (re)computed, write a row.

| Column            | Type                                      | Notes                          |
| ----------------- | ----------------------------------------- | ------------------------------ |
| `id`              | uuid PK                                   |                                |
| `relationship_id` | uuid FK → relationships ON DELETE CASCADE |                                |
| `score`           | numeric(5,2) NOT NULL                     |                                |
| `score_version`   | int NOT NULL                              |                                |
| `breakdown`       | jsonb NOT NULL                            | All component values + weights |
| `computed_at`     | timestamptz NOT NULL DEFAULT now()        |                                |

Indexes: `(relationship_id, computed_at DESC)`.

---

## Row Level Security (Supabase)

- Public (anon) role: **SELECT** on all tables where `is_active = true` (or always for `themes`, `sources`, `score_snapshots`).
- Service role only: INSERT / UPDATE / DELETE (used by admin route from server-side handlers).
- No user-level auth in MVP. All writes go through the password-gated admin route on the server.

---

## TypeScript types (mirror, kept in sync in `/lib/types`)

```ts
export type RelationshipType =
  | "investment"
  | "customer"
  | "supplier"
  | "partnership"
  | "infrastructure"
  | "thematic"
  | "speculative";

export type RelationshipStrength = "direct" | "indirect" | "speculative";

export type SourceType =
  | "sec_filing"
  | "earnings_call"
  | "official_announcement"
  | "reuters"
  | "bloomberg"
  | "ft"
  | "wsj"
  | "analyst_report"
  | "news_article"
  | "blog"
  | "community";

export type HypeRisk = "low" | "medium" | "high";

export interface CatalystCompany {
  id: string;
  slug: string;
  name: string;
  country: string;
  isPublic: boolean;
  ticker?: string | null;
  exchange?: string | null;
  shortDescription: string;
  thesisMd: string;
  themes: Theme[]; // hydrated via join
  isActive: boolean;
}

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface RelatedCompany {
  id: string;
  ticker: string;
  exchange: string;
  name: string;
  country?: string;
  sector?: string;
  industry?: string;
  marketCapUsd?: number | null;
  shortDescription?: string;
}

export interface Relationship {
  id: string;
  catalystId: string;
  relatedCompany: RelatedCompany;
  relationshipType: RelationshipType;
  relationshipStrength: RelationshipStrength;
  summary: string;
  revenueExposurePct?: number | null;
  firstObservedAt?: string | null;
  lastVerifiedAt: string;
  relevanceScore: number;
  scoreVersion: number;
  hypeRisk: HypeRisk;
  contractValueUsd?: number | null;
  isGovernmentProcurement: boolean;
  sources: Source[];
  isActive: boolean;
}

export interface Source {
  id: string;
  url: string;
  title?: string;
  sourceType: SourceType;
  sourceQuality: number;
  publishedAt?: string | null;
  accessedAt: string;
  excerpt?: string;
}
```

---

## Migration ordering (initial setup)

1. `themes`
2. `catalyst_companies`
3. `catalyst_themes`
4. `related_companies`
5. `relationships`
6. `sources`
7. `score_snapshots`
8. `0013_supply_chain_fields` — `contract_value_usd`, `is_government_procurement`

Each migration is a separate SQL file in `/supabase/migrations/`.

---

## Seed data approach

- Seed lives in `/data/seed/*.json` files, one per catalyst.
- A `scripts/seed.ts` script reads these and writes to Supabase via the service role key.
- Seed files are checked into the repo so they are reviewable as data, not as code.
- The set of catalyst slugs in seed is a **curator choice**, not a product invariant.

---

## Extensibility checklist

Before merging a feature, confirm:

- Adding a new catalyst requires only seed data — no code changes.
- Adding a new theme requires only inserting a `themes` row.
- The UI never references a specific catalyst slug or ticker by name in code.
- Adding a new `source_type` requires only a migration of the enum + a single line in the source-quality mapping.
