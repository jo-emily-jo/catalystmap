import { describe, it, expect, vi } from "vitest";
import { mapRelationship } from "./mappers";

describe("mapRelationship", () => {
  const mockRow = {
    id: "rel-001",
    catalyst_id: "cat-001",
    related_company_id: "rc-001",
    relationship_type: "supplier",
    relationship_strength: "indirect",
    summary: "Supplies GPUs via cloud providers.",
    revenue_exposure_pct: 5.5,
    first_observed_at: "2024-01-15",
    last_verified_at: "2025-11-01",
    is_active: true,
    relevance_score: 62.4,
    score_version: 1,
    hype_risk: "medium",
    related_companies: {
      id: "rc-001",
      ticker: "NVDA",
      exchange: "NASDAQ",
      name: "NVIDIA Corp.",
      country: "US",
      sector: "Information Technology",
      industry: "Semiconductors",
      market_cap_usd: 3000000000000,
      short_description: "GPU maker",
      website: null,
      logo_url: null,
    },
    sources: [
      {
        id: "src-001",
        url: "https://example.com/source",
        title: "Analyst report",
        source_type: "analyst_report",
        source_quality: 70,
        published_at: "2025-10-01",
        accessed_at: "2025-11-01T00:00:00Z",
        excerpt: "Evidence excerpt.",
      },
      {
        id: "src-002",
        url: "https://example.com/source2",
        title: null,
        source_type: "news_article",
        source_quality: 55,
        published_at: null,
        accessed_at: "2025-11-01T00:00:00Z",
        excerpt: null,
      },
    ],
  };

  it("converts snake_case row to camelCase Relationship", () => {
    const result = mapRelationship(mockRow);

    expect(result.id).toBe("rel-001");
    expect(result.catalystId).toBe("cat-001");
    expect(result.relationshipType).toBe("supplier");
    expect(result.relationshipStrength).toBe("indirect");
    expect(result.relevanceScore).toBe(62.4);
    expect(result.scoreVersion).toBe(1);
    expect(result.hypeRisk).toBe("medium");
    expect(result.revenueExposurePct).toBe(5.5);
    expect(result.firstObservedAt).toBe("2024-01-15");
    expect(result.lastVerifiedAt).toBe("2025-11-01");
    expect(result.isActive).toBe(true);
  });

  it("hydrates relatedCompany with camelCase fields", () => {
    const result = mapRelationship(mockRow);
    const rc = result.relatedCompany;

    expect(rc.id).toBe("rc-001");
    expect(rc.ticker).toBe("NVDA");
    expect(rc.exchange).toBe("NASDAQ");
    expect(rc.name).toBe("NVIDIA Corp.");
    expect(rc.country).toBe("US");
    expect(rc.sector).toBe("Information Technology");
    expect(rc.marketCapUsd).toBe(3000000000000);
    expect(rc.shortDescription).toBe("GPU maker");
  });

  it("hydrates sources array with camelCase fields", () => {
    const result = mapRelationship(mockRow);

    expect(result.sources).toHaveLength(2);
    expect(result.sources[0].sourceType).toBe("analyst_report");
    expect(result.sources[0].sourceQuality).toBe(70);
    expect(result.sources[0].publishedAt).toBe("2025-10-01");
    expect(result.sources[0].excerpt).toBe("Evidence excerpt.");
    expect(result.sources[1].title).toBeUndefined();
    expect(result.sources[1].publishedAt).toBeNull();
    expect(result.sources[1].excerpt).toBeUndefined();
  });

  it("handles null relevance_score as 0", () => {
    const row = { ...mockRow, relevance_score: null };
    const result = mapRelationship(row);
    expect(result.relevanceScore).toBe(0);
  });

  it("handles empty sources array", () => {
    const row = { ...mockRow, sources: [] };
    const result = mapRelationship(row);
    expect(result.sources).toEqual([]);
  });
});

describe("sort order", () => {
  it("higher relevance_score comes first when sorted desc", () => {
    const rows = [
      { ...makeRow("rel-1", 45) },
      { ...makeRow("rel-2", 83) },
      { ...makeRow("rel-3", 11) },
    ];

    const mapped = rows.map(mapRelationship);
    const sorted = [...mapped].sort(
      (a, b) => b.relevanceScore - a.relevanceScore
    );

    expect(sorted[0].id).toBe("rel-2");
    expect(sorted[1].id).toBe("rel-1");
    expect(sorted[2].id).toBe("rel-3");
  });
});

function makeRow(id: string, score: number) {
  return {
    id,
    catalyst_id: "cat-001",
    related_company_id: "rc-001",
    relationship_type: "thematic",
    relationship_strength: "direct",
    summary: "Test",
    revenue_exposure_pct: null,
    first_observed_at: null,
    last_verified_at: "2025-01-01",
    is_active: true,
    relevance_score: score,
    score_version: 1,
    hype_risk: "low",
    related_companies: {
      id: "rc-001",
      ticker: "TEST",
      exchange: "NYSE",
      name: "Test Co.",
      country: null,
      sector: null,
      industry: null,
      market_cap_usd: null,
      short_description: null,
      website: null,
      logo_url: null,
    },
    sources: [],
  };
}
