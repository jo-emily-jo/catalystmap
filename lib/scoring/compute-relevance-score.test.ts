import { describe, it, expect } from "vitest";
import { computeRelevanceScore } from "./compute-relevance-score";

const now = new Date("2026-01-01T00:00:00Z");

function daysAgo(days: number): Date {
  return new Date(now.getTime() - days * 86_400_000);
}

describe("computeRelevanceScore (v2)", () => {
  it("Example A — investment, direct, strong evidence → 67.5", () => {
    const result = computeRelevanceScore(
      {
        relationshipType: "investment",
        relationshipStrength: "direct",
        revenueExposurePct: 2,
        sourceQualities: [90, 100],
        lastVerifiedAt: daysAgo(30),
        hypeRisk: "low",
      },
      now
    );
    expect(result.score).toBe(67.5);
    expect(result.breakdown.directScore).toBe(80);
    expect(result.breakdown.revenueExposureScore).toBe(40);
    expect(result.breakdown.sourceQualityScore).toBe(100);
    expect(result.breakdown.recencyScore).toBe(100);
    expect(result.breakdown.momentumScore).toBe(50);
    expect(result.breakdown.contractSizeBonus).toBe(0);
    expect(result.breakdown.governmentProcurementBonus).toBe(0);
    expect(result.breakdown.hypeRiskPenalty).toBe(0);
  });

  it("Example B — infrastructure, indirect, weaker evidence → 48.3", () => {
    const result = computeRelevanceScore(
      {
        relationshipType: "infrastructure",
        relationshipStrength: "indirect",
        revenueExposurePct: null,
        sourceQualities: [70],
        lastVerifiedAt: daysAgo(120),
        hypeRisk: "medium",
      },
      now
    );
    expect(result.score).toBe(48.3);
    expect(result.breakdown.directScore).toBe(65);
    expect(result.breakdown.revenueExposureScore).toBe(30);
    expect(result.breakdown.sourceQualityScore).toBe(72);
  });

  it("Example C — speculative thematic with hype risk → 5", () => {
    const result = computeRelevanceScore(
      {
        relationshipType: "thematic",
        relationshipStrength: "speculative",
        revenueExposurePct: null,
        sourceQualities: [30, 15],
        lastVerifiedAt: daysAgo(400),
        hypeRisk: "high",
      },
      now
    );
    expect(result.score).toBe(5);
    expect(result.breakdown.directScore).toBe(10);
    expect(result.breakdown.hypeRiskPenalty).toBe(15);
  });

  it("Example D — supplier with contract value + gov procurement → 91.5", () => {
    const result = computeRelevanceScore(
      {
        relationshipType: "supplier",
        relationshipStrength: "direct",
        revenueExposurePct: 15,
        sourceQualities: [100, 95],
        lastVerifiedAt: daysAgo(60),
        hypeRisk: "low",
        contractValueUsd: 500_000_000,
        isGovernmentProcurement: true,
      },
      now
    );
    expect(result.score).toBe(91.5);
    expect(result.breakdown.directScore).toBe(100);
    expect(result.breakdown.revenueExposureScore).toBe(80);
    expect(result.breakdown.contractSizeBonus).toBe(5);
    expect(result.breakdown.governmentProcurementBonus).toBe(3);
  });

  it("clamps to 0 when penalty exceeds subtotal", () => {
    const result = computeRelevanceScore(
      {
        relationshipType: "speculative",
        relationshipStrength: "speculative",
        revenueExposurePct: 0,
        sourceQualities: [15],
        lastVerifiedAt: daysAgo(800),
        hypeRisk: "high",
      },
      now
    );
    expect(result.score).toBe(0);
    expect(result.breakdown.final).toBe(0);
  });

  it("is deterministic: 100 varied inputs produce identical hashes on two runs", () => {
    const types = [
      "investment",
      "customer",
      "supplier",
      "partnership",
      "infrastructure",
      "thematic",
      "speculative",
    ] as const;
    const strengths = ["direct", "indirect", "speculative"] as const;
    const risks = ["low", "medium", "high"] as const;

    function buildInputs() {
      return Array.from({ length: 100 }, (_, i) => ({
        relationshipType: types[i % types.length],
        relationshipStrength: strengths[i % strengths.length],
        revenueExposurePct: i % 10 === 0 ? null : i * 0.5,
        sourceQualities: [15 + (i % 86), 70],
        lastVerifiedAt: daysAgo(i * 8),
        hypeRisk: risks[i % risks.length],
        contractValueUsd: i % 5 === 0 ? i * 1_000_000 : null,
        isGovernmentProcurement: i % 7 === 0,
      }));
    }

    const run1 = buildInputs().map(
      (inp) => computeRelevanceScore(inp, now).score
    );
    const run2 = buildInputs().map(
      (inp) => computeRelevanceScore(inp, now).score
    );

    expect(JSON.stringify(run1)).toBe(JSON.stringify(run2));
  });

  it("version is always SCORING_VERSION (2)", () => {
    const result = computeRelevanceScore(
      {
        relationshipType: "customer",
        relationshipStrength: "direct",
        revenueExposurePct: null,
        sourceQualities: [55],
        lastVerifiedAt: daysAgo(10),
        hypeRisk: "low",
      },
      now
    );
    expect(result.breakdown.version).toBe(2);
  });
});
