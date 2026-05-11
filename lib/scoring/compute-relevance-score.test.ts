import { describe, it, expect } from "vitest";
import { computeRelevanceScore } from "./compute-relevance-score";

const now = new Date("2026-01-01T00:00:00Z");

function daysAgo(days: number): Date {
  return new Date(now.getTime() - days * 86_400_000);
}

describe("computeRelevanceScore", () => {
  it("Example A — investment, direct, strong evidence → 83", () => {
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
    expect(result.score).toBe(83);
    expect(result.breakdown.directScore).toBe(100);
    expect(result.breakdown.revenueExposureScore).toBe(40);
    expect(result.breakdown.sourceQualityScore).toBe(100);
    expect(result.breakdown.recencyScore).toBe(100);
    expect(result.breakdown.momentumScore).toBe(50);
    expect(result.breakdown.hypeRiskPenalty).toBe(0);
  });

  it("Example B — infrastructure, indirect, weaker evidence → 48.4", () => {
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
    expect(result.score).toBe(48.4);
    expect(result.breakdown.directScore).toBe(50);
    expect(result.breakdown.revenueExposureScore).toBe(30);
    expect(result.breakdown.sourceQualityScore).toBe(72);
    expect(result.breakdown.recencyScore).toBe(80);
    expect(result.breakdown.momentumScore).toBe(50);
    expect(result.breakdown.hypeRiskPenalty).toBe(5);
  });

  it("Example C — speculative thematic with hype risk → 11", () => {
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
    expect(result.score).toBe(11);
    expect(result.breakdown.directScore).toBe(15);
    expect(result.breakdown.hypeRiskPenalty).toBe(15);
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

  it("is deterministic across repeated calls", () => {
    const input = {
      relationshipType: "supplier" as const,
      relationshipStrength: "direct" as const,
      revenueExposurePct: 10,
      sourceQualities: [85, 70],
      lastVerifiedAt: daysAgo(50),
      hypeRisk: "low" as const,
    };

    const results = Array.from({ length: 100 }, () =>
      computeRelevanceScore(input, now)
    );

    const firstScore = results[0].score;
    expect(results.every((r) => r.score === firstScore)).toBe(true);
  });

  it("version is always SCORING_VERSION (1)", () => {
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
    expect(result.breakdown.version).toBe(1);
  });
});
