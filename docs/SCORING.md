# Relevance Scoring Model

**Version:** 1
**Constant:** `SCORING_VERSION = 1`
**Range:** Every score is clamped to `[0, 100]`.

This file is the **single source of truth** for how relevance scores are computed. Any change to the formula or weights must bump `SCORING_VERSION` and be reflected in `/lib/scoring/`.

All scoring functions are **pure** and **deterministic**: same inputs → same output. They produce auditable breakdowns that are stored in `score_snapshots.breakdown` and shown in the UI.

---

## 1. The formula

```
positive =
    0.40 * direct_score
  + 0.20 * revenue_exposure_score
  + 0.20 * source_quality_score
  + 0.10 * recency_score
  + 0.10 * momentum_score

final_score = clamp(positive - hype_risk_penalty, 0, 100)
```

Weights sum to 1.0. The hype-risk **penalty** is subtracted after weighting, so it can push a score down but never inflate it.

---

## 2. Component definitions

### 2.1 `direct_score` — 0–100

Driven by `relationship_type` × `relationship_strength`.

| `relationship_type` | `direct` | `indirect` | `speculative` |
| ------------------- | -------: | ---------: | ------------: |
| `investment`        |      100 |         70 |            30 |
| `customer`          |       90 |         60 |            25 |
| `supplier`          |       90 |         60 |            25 |
| `partnership`       |       80 |         55 |            25 |
| `infrastructure`    |       75 |         50 |            20 |
| `thematic`          |       50 |         35 |            15 |
| `speculative`       |       30 |         20 |            10 |

The matrix is a constant in `/lib/scoring/directScore.ts`.

### 2.2 `revenue_exposure_score` — 0–100

Estimated share of the related company's revenue tied to the catalyst.

| `revenue_exposure_pct` | score |
| ---------------------- | ----: |
| `null` (unknown)       |    30 |
| `>= 30`                |   100 |
| `>= 15`                |    80 |
| `>= 5`                 |    60 |
| `>= 1`                 |    40 |
| `> 0`                  |    20 |
| `= 0`                  |     0 |

The default of 30 for "unknown" intentionally avoids over-penalizing relationships where exposure cannot be cleanly estimated (common with private catalysts).

### 2.3 `source_quality_score` — 0–100

Per-source quality is denormalized into `sources.source_quality` at insert time using this mapping:

| `source_type`           | quality |
| ----------------------- | ------: |
| `sec_filing`            |     100 |
| `earnings_call`         |      95 |
| `official_announcement` |      90 |
| `reuters`               |      85 |
| `bloomberg`             |      85 |
| `ft`                    |      85 |
| `wsj`                   |      85 |
| `analyst_report`        |      70 |
| `news_article`          |      55 |
| `blog`                  |      30 |
| `community`             |      15 |

For a relationship with N sources:

```
base = max(source_quality for s in sources)
agreement_bonus = min(10, 2 * count(s where source_quality >= 70))
source_quality_score = min(100, base + agreement_bonus)
```

Rationale: the strongest piece of evidence dominates, but multiple credible sources agreeing earns a modest boost.

### 2.4 `recency_score` — 0–100

Based on `relationships.last_verified_at`, computed at scoring time using `now()`.

| Age        | score |
| ---------- | ----: |
| ≤ 90 days  |   100 |
| ≤ 180 days |    80 |
| ≤ 365 days |    60 |
| ≤ 730 days |    30 |
| > 730 days |    10 |

### 2.5 `momentum_score` — 0–100

A placeholder for future use (relative price strength vs. market or sector).

**MVP behavior:** always `50` (neutral). This is intentional — we don't want the MVP to look like it's tracking price action.

Post-MVP candidates: 1Y relative strength vs. SPY, 6M sector RS, or analyst revision momentum.

### 2.6 `hype_risk_penalty`

| `hype_risk` | penalty |
| ----------- | ------: |
| `low`       |       0 |
| `medium`    |       5 |
| `high`      |      15 |

For MVP, the curator sets `hype_risk` manually. Suggested heuristics (informational only):

- 12-month price rise > 100% **and** strength is `speculative` → `high`
- 12-month price rise > 50% **and** strength is `indirect` → `medium`
- otherwise → `low`

---

## 3. Worked examples

### Example A — Investment relationship, strong evidence

Inputs:

- type: `investment`, strength: `direct` → direct_score = 100
- revenue_exposure_pct: ~2% → revenue_exposure_score = 40
- sources: `official_announcement` (90), `sec_filing` (100) → base 100, agreement_bonus min(10, 2\*2)=4, capped at 100
- last_verified_at: 30 days ago → recency_score = 100
- momentum_score = 50 (MVP default)
- hype_risk: `low` → penalty = 0

```
positive = 0.4*100 + 0.2*40 + 0.2*100 + 0.1*100 + 0.1*50
        = 40 + 8 + 20 + 10 + 5
        = 83
final   = clamp(83 - 0) = 83
```

### Example B — Infrastructure/thematic relationship, weaker evidence

Inputs:

- type: `infrastructure`, strength: `indirect` → direct_score = 50
- revenue_exposure_pct: null → revenue_exposure_score = 30
- sources: `analyst_report` (70) → base 70, agreement_bonus 2, total 72
- last_verified_at: 120 days ago → recency_score = 80
- momentum_score = 50
- hype_risk: `medium` → penalty = 5

```
positive = 0.4*50 + 0.2*30 + 0.2*72 + 0.1*80 + 0.1*50
        = 20 + 6 + 14.4 + 8 + 5
        = 53.4
final   = clamp(53.4 - 5) = 48.4 → 48 (rounded for display)
```

### Example C — Speculative thematic with hype risk

Inputs:

- type: `thematic`, strength: `speculative` → direct_score = 15
- revenue_exposure_pct: null → 30
- sources: `blog` (30), `community` (15) → base 30, agreement_bonus 0 → 30
- last_verified_at: 400 days ago → recency_score = 30
- momentum_score = 50
- hype_risk: `high` → penalty = 15

```
positive = 0.4*15 + 0.2*30 + 0.2*30 + 0.1*30 + 0.1*50
        = 6 + 6 + 6 + 3 + 5
        = 26
final   = clamp(26 - 15) = 11
```

A relationship like this would appear near the bottom of the sorted table and is appropriately flagged.

---

## 4. UI surfacing

Every score in the UI must be **explainable on demand**. On hover or click of the score badge, show:

```
Final score: 83
─────────────────────────
Direct          100 × 40% = 40.0
Revenue          40 × 20% =  8.0
Source quality  100 × 20% = 20.0
Recency         100 × 10% = 10.0
Momentum         50 × 10% =  5.0
─────────────────────────
Subtotal                    83.0
Hype-risk penalty           -0.0
─────────────────────────
Final                       83.0
Scoring version: v1
```

This is generated directly from the `breakdown` JSON stored in `score_snapshots`.

---

## 5. Implementation rules

- All component functions live in `/lib/scoring/` as **pure** functions.
- Each function has its own file and its own `*.test.ts` covering boundary cases.
- A top-level `computeRelevanceScore(relationship, sources, now)` orchestrates them and returns `{ score, breakdown }`.
- The orchestrator is the **only** function that knows the weights. Component functions do not know how they are combined.
- On `INSERT` / `UPDATE` to `relationships` or `sources`, the server recomputes the score, writes it to `relationships.relevance_score` and `score_version`, and appends a row to `score_snapshots`.
- The frontend never recomputes — it reads the cached value.

---

## 6. Versioning policy

- This document describes **version 1** of the scoring model.
- Any change to weights, component formulas, or matrix values requires:
  1. Updating this document.
  2. Incrementing `SCORING_VERSION` in `/lib/scoring/version.ts`.
  3. A migration script that recomputes all relationships under the new version (and writes new snapshots — old ones remain for history).
- The UI displays the scoring version next to the breakdown so users know which formula a score was computed under.

---

## 7. Test cases (must pass before shipping)

The unit test suite must include at minimum:

1. Direct matrix lookup for every (type, strength) pair.
2. Revenue exposure: each piecewise boundary (0, 0.5, 1, 4, 5, 14, 15, 29, 30, 100, null).
3. Source quality: single source of each type; multi-source agreement bonus capped at +10; all sources below 70 yields zero bonus.
4. Recency: day-89, day-90, day-91, day-179, day-180, day-181, day-364, day-365, day-366, day-731.
5. Hype-risk penalty for each enum value.
6. Full orchestrator with Example A, B, C inputs → expected final scores.
7. Clamp behavior: contrived inputs that would push below 0 are returned as 0.
8. Determinism: 100 random inputs hashed → same hash on two consecutive runs.
