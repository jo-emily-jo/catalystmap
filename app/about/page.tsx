import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — CatalystMap",
  description:
    "How CatalystMap works: methodology, scoring, and what this product is not.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-medium text-[--foreground]">
        About CatalystMap
      </h1>

      <section className="mt-8">
        <h2 className="text-base font-medium text-[--foreground]">
          Methodology
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[--foreground-secondary]">
          Every relationship in CatalystMap is manually curated or AI-proposed
          and human-approved. Each link between a catalyst company and a
          publicly traded counterparty requires at least one verifiable source —
          SEC filings, earnings call transcripts, official press releases, or
          top-tier financial journalism. Relationships are typed (supplier,
          customer, infrastructure, partnership, investment, thematic,
          speculative), strength-classified (direct, indirect, speculative), and
          scored using a transparent, deterministic formula. The
          curator-in-the-loop principle means AI assists in identifying
          candidates but never writes data without explicit human approval.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-medium text-[--foreground]">
          What this is not
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-[--foreground-secondary]">
          <li>
            Not a stock screener — no P/E, market cap, or dividend yield
            filters.
          </li>
          <li>
            Not a fundamental analysis tool — no financial statements, ratios,
            or DCF models.
          </li>
          <li>Not a price chart or technical analysis surface.</li>
          <li>Not a portfolio tracker — we do not maintain user positions.</li>
          <li>Not financial advice — this is supply-chain research.</li>
          <li>
            Not real-time data — relationships are curated periodically, not
            streamed.
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-medium text-[--foreground]">
          Scoring overview
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[--foreground-secondary]">
          Each relationship receives a relevance score from 0 to 100, computed
          as:
        </p>
        <pre className="mt-3 rounded border border-[--border] bg-[--background-secondary] p-4 font-mono text-xs text-[--foreground]">
          {`score =
    0.40 * direct_score        (type x strength matrix)
  + 0.20 * revenue_exposure    (% of revenue tied to catalyst)
  + 0.15 * source_quality      (best source tier + agreement bonus)
  + 0.10 * recency             (days since last verification)
  + 0.05 * momentum            (neutral in v2)
  + contract_size_bonus        (0–10, for disclosed contract values)
  + gov_procurement_bonus      (0–3, for government contracts)
  - hype_risk_penalty          (0/5/15)

Clamped to [0, 100]. Scoring version: v2.`}
        </pre>
        <p className="mt-3 text-sm leading-relaxed text-[--foreground-secondary]">
          For example, a confirmed supplier with a direct relationship, 15%
          revenue exposure, an SEC filing source, recent verification, and a
          $500M government contract scores 91.5 — the highest tier. A
          thematic-speculative link with only blog sources and high hype risk
          scores 5.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-base font-medium text-[--foreground]">
          Documentation
        </h2>
        <ul className="mt-2 space-y-1 text-sm text-[--foreground-secondary]">
          <li>
            <a
              href="https://github.com/jo-emily-jo/catalystmap/blob/main/docs/ARCHITECTURE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Architecture
            </a>{" "}
            — runtime topology, data flow, and key abstractions.
          </li>
          <li>
            <a
              href="https://github.com/jo-emily-jo/catalystmap/blob/main/docs/DECISIONS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Decision records
            </a>{" "}
            — ADRs for material technology and design choices.
          </li>
        </ul>
      </section>
    </div>
  );
}
