# Product Requirements Document

**Project name:** CatalystMap
**Version:** 0.1
**Status:** Draft for MVP

---

## 1. Vision

A supply-chain and contract intelligence tool that maps high-attention catalyst companies (e.g. SpaceX, Anthropic, SK Hynix, NVIDIA) to their publicly traded **suppliers, contractors, infrastructure providers, and value-chain beneficiaries** — with verifiable, source-cited relationships. Users come to answer: "Which public companies are in this catalyst's supply chain or counterparty graph?"

This is a research and education tool. It is **not** a recommendation engine, not financial advice, and not a trading product.

---

## 2. Problem

- Major themes (AI, frontier semiconductors, space, robotics, energy transition, defense, biotech) drive disproportionate market attention.
- Many of the actual catalysts are private (Anthropic, SpaceX, OpenAI), foreign (SK Hynix, ASML), or otherwise hard to invest in directly.
- Retail investors struggle to distinguish rigorous exposure from speculative theme play.
- Existing options are either superficial blog-style "related stocks" lists (no sourcing, no scoring) or paid institutional tools (Bloomberg, FactSet).
- Generic AI search tends to produce confident but unsourced or hallucinated claims about which stocks benefit from what.
- Existing financial tools (Yahoo Finance, Finviz, Stock Rover, Pitchbook) excel at valuation and screening. None answer the question "Who is in this catalyst's supply chain?" — especially when the catalyst is private (SpaceX, Anthropic) or foreign (SK Hynix, TSMC). Retail investors trying to gain indirect exposure must currently cobble this together from earnings calls, SEC filings, supplier disclosures, and analyst notes. CatalystMap consolidates that work into a single, evidenced graph.

---

## 3. Solution

A curated, evidence-scored relationship graph between catalyst companies and public stocks.

Every relationship in the system has:

- A typed link (investment, supplier, customer, partnership, infrastructure, thematic, speculative)
- A strength classification (direct, indirect, speculative)
- At least one source URL with a quality tier
- A composite **relevance score (0–100)**
- A hype-risk note

The first version is **manually curated**, with AI used as a research aide for the curator (not as the source of truth).

---

## 4. Target users

| Persona                                                                   | Primary need                                                                                                                |
| ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Retail investor doing serious research                                    | Find rigorously sourced exposure to a theme                                                                                 |
| Junior analyst / PM                                                       | Map an investment thesis quickly                                                                                            |
| Business / finance student                                                | Learn how themes translate to investable names                                                                              |
| Builder (Emily)                                                           | Portfolio piece demonstrating product, data, and design thinking                                                            |
| Retail investor seeking indirect exposure to private or foreign catalysts | "How do I own a slice of SpaceX without being SpaceX?" / "Which TSMC suppliers do I already own through my US-listed ETFs?" |

---

## 5. Core concepts (domain vocabulary)

### Catalyst company

Any company — public or private — that is currently gaining material market attention because it represents an important theme. The set is **not fixed**: catalysts can be added, retired, or merged over time. Examples might include AI labs, leading-edge memory makers, space companies, frontier robotics companies, etc.

### Theme

A market-level narrative bucket (AI, Semiconductors, Space, Defense, Data Center, Robotics, Energy, Biotech). A catalyst may belong to one or more themes. New themes can be added.

### Related company

A publicly traded company that has some form of exposure to a catalyst.

### Relationship

A typed, evidenced, scored link from a catalyst to a related public company.

### Source

A URL with a quality tier (SEC filing, earnings call, official press, top-tier media, analyst report, news, blog, community) supporting a relationship.

### Relevance score

A 0–100 composite computed deterministically from a relationship's properties and sources. Defined in `SCORING.md`.

### Relationship type hierarchy (confidence tiers)

| Tier                   | Types                           | Description                                                                       |
| ---------------------- | ------------------------------- | --------------------------------------------------------------------------------- |
| Confirmed counterparty | `supplier`, `customer`          | Disclosed in SEC filings, earnings calls, or supplier disclosures                 |
| Confirmed financial    | `investment`                    | Disclosed equity or debt relationship                                             |
| Disclosed partnership  | `partnership`, `infrastructure` | Joint press release, official announcement, or public infrastructure relationship |
| Inferred exposure      | `thematic`                      | Same industry or value chain, no specific counterparty link                       |
| Speculative            | `speculative`                   | Community / analyst conjecture without an official source                         |

---

## 6. Key user flows

### Flow A — Browse by theme

Home → theme card (e.g. "AI") → list of catalyst companies in that theme → catalyst detail page.

### Flow B — Catalyst detail page

The core view. Contains:

1. Header: catalyst name, themes, 1-paragraph "why this matters now" thesis
2. Sortable, filterable table of related public companies
3. Each row: ticker · exchange · relationship type · strength · score · evidence excerpt · source link · hype risk
4. Filters: strength (direct/indirect/speculative), sector, market cap bucket, recency
5. Optional network graph visualization
6. Disclaimer footer

### Flow C — Reverse lookup (search by ticker)

User searches a ticker → app shows all catalysts that ticker is connected to.

### Flow D — Curator / admin

Password-protected route for the maintainer.

- Create / edit catalyst companies
- Create / edit related companies
- Create / edit relationships with required source evidence
- Trigger an AI-assisted research helper that _proposes_ candidate related companies + draft evidence; the curator must review and approve before anything is written.

---

## 7. MVP scope

### In scope

- 3–5 manually curated catalyst companies as seed examples (the specific identities are **not** fixed by the product; they are curator choices)
- 10–15 related companies per catalyst
- 1+ source per relationship, required
- Full scoring engine per `SCORING.md`
- Theme browse + catalyst detail + reverse-lookup pages
- Sortable / filterable relationship table
- Simple network graph
- Curator admin (password-gated)
- AI-assisted research helper in the admin (proposes, never auto-writes)
- Persistent disclaimer footer

### Out of scope for MVP

- Live web crawling or automated catalyst discovery
- Real-time price/quote data
- User accounts, personalization, watchlists
- Portfolio tracking, alerts, notifications
- Mobile native app
- Trading integrations of any kind
- Anything that resembles a buy/sell recommendation

---

## 8. Non-goals (philosophical guardrails)

- Not a recommendation engine
- Not financial advice
- Does not predict price movements
- Documents existing, evidenced relationships — does not speculate
- Does not auto-discover catalysts in v1 (humans choose what is a catalyst)
- **Not a stock screener.** We do not filter by P/E, market cap, dividend yield, or other valuation metrics.
- **Not a fundamental analysis tool.** We do not display financial statements, ratios, or DCF models.
- **Not a price chart / technical analysis surface.** No candlesticks, no indicators.
- **Not a portfolio tracker.** We do not maintain user positions.

---

## 9. Success metrics (portfolio-grade)

- Live, public deployment with ≥ 3 catalysts and ≥ 30 relationships
- 100% of relationships have at least one source URL that returns 200 OK
- Scoring is deterministic: same inputs → same outputs (covered by unit tests)
- Lighthouse performance ≥ 90 on the catalyst detail page
- README + ARCHITECTURE + DECISIONS docs published in the repo
- 30–60 second demo video linked from README

---

## 10. Constraints & principles

- **Evidence-first.** No relationship without a source.
- **Transparent scoring.** The breakdown of any score must be inspectable in the UI.
- **Curator-in-the-loop.** AI proposes; humans approve.
- **Extensible by design.** Adding a new catalyst or theme should require zero schema or code changes.
- **No hard-coding of specific catalyst identities anywhere in the codebase.** All catalysts live in data.

---

## 11. Post-MVP roadmap (not committed)

- AI-assisted catalyst _discovery_ (still human-approved)
- Sector / thematic ETF mapping layer
- Relationship change history & timeline view
- Internationalization (i18n) — multi-language UI support
- Public read-only API
- Watchlists and (optional) email digests
- Embeddings-based "show me similar relationships"
- Confidence intervals on scores

---

## 12. Decision log

1. **Project name:** CatalystMap. _Locked._
2. **Hosting region:** Vercel default (auto edge) + Supabase US East for MVP. _Default applied;_ revisit only if regional latency becomes a measured concern.
3. **Curator identity / methodology page:** to be decided in Week 1 when the admin route is built. _Current lean:_ publish a brief "Curated by …" + methodology link to support credibility.
4. **"Last reviewed" badge on catalyst pages:** to be decided in Week 3 when the scoring engine lands. _Current lean:_ surface it, since `last_verified_at` already drives the recency component of the score.
5. **Domain:** `getcatalystmap.com`. _Locked_ (registered via Cloudflare; `catalystmap.com` was unavailable). The product brand remains **CatalystMap** — the `get` prefix is a domain convention only and must not appear in product copy, headers, logos, or page titles.
6. **Repository:** `github.com/jo-emily-jo/catalystmap`. _Locked._
7. **Visual identity:** Modern data tool direction (Linear / Vercel / Stripe Dashboard). _Locked._
   - Sans font: Geist (Next.js default), Inter as fallback.
   - Mono font: Geist Mono, JetBrains Mono as fallback.
   - Mode: light only for MVP. Dark-mode toggle deferred to Sprint 5.
   - Accent: indigo-600 (`#4F46E5`).
   - Surfaces: white primary (`#FFFFFF`), near-white secondary (`#FAFAFA`), subtle gray border (`#E5E5E5`).
   - Aesthetic: flat, generous whitespace, hairline borders, no gradients or heavy shadows.
