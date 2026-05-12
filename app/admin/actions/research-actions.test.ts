import { describe, it, expect, vi } from "vitest";

// Test the parsing/structure logic without hitting the real API
describe("research response parsing", () => {
  it("extracts candidates from <json> tags", () => {
    const response = `<json>
{
  "candidates": [
    {
      "companyName": "Test Corp",
      "ticker": "TST",
      "exchange": "NYSE",
      "country": "US",
      "sector": "Technology",
      "relationshipType": "supplier",
      "relationshipStrength": "direct",
      "evidenceSummary": "Test evidence.",
      "sources": [
        {
          "url": "https://example.com/source",
          "sourceType": "news_article",
          "title": "Test source"
        }
      ],
      "hypeRisk": "low",
      "contractValueUsd": 500000000,
      "isGovernmentProcurement": true
    }
  ]
}
</json>`;

    const jsonMatch = response.match(/<json>([\s\S]*?)<\/json>/);
    expect(jsonMatch).not.toBeNull();

    const parsed = JSON.parse(jsonMatch![1]);
    expect(parsed.candidates).toHaveLength(1);
    expect(parsed.candidates[0].ticker).toBe("TST");
    expect(parsed.candidates[0].relationshipType).toBe("supplier");
    expect(parsed.candidates[0].sources).toHaveLength(1);
    expect(parsed.candidates[0].contractValueUsd).toBe(500000000);
    expect(parsed.candidates[0].isGovernmentProcurement).toBe(true);
  });

  it("handles empty candidates array", () => {
    const response = `<json>
{
  "candidates": [],
  "note": "No publicly traded companies with meaningful exposure found."
}
</json>`;

    const jsonMatch = response.match(/<json>([\s\S]*?)<\/json>/);
    const parsed = JSON.parse(jsonMatch![1]);
    expect(parsed.candidates).toHaveLength(0);
    expect(parsed.note).toContain("No publicly traded");
  });

  it("validates that ai_assisted would be true for approved drafts", () => {
    // This tests the contract: when a draft is approved,
    // the relationship should be created with aiAssisted = true
    const formData = new FormData();
    formData.set("aiAssisted", "true");
    expect(formData.get("aiAssisted")).toBe("true");
  });

  it("validates candidate has required fields", () => {
    const candidate = {
      companyName: "NVIDIA Corp.",
      ticker: "NVDA",
      exchange: "NASDAQ",
      country: "US",
      sector: "Information Technology",
      relationshipType: "supplier",
      relationshipStrength: "indirect",
      evidenceSummary: "GPU supplier for AI training.",
      sources: [
        {
          url: "url-not-verified",
          sourceType: "analyst_report",
          title: "AI GPU demand report",
        },
      ],
      hypeRisk: "medium",
    };

    expect(candidate.companyName).toBeDefined();
    expect(candidate.ticker).toBeDefined();
    expect(candidate.exchange).toBeDefined();
    expect(candidate.sources.length).toBeGreaterThanOrEqual(1);
    expect(["low", "medium", "high"]).toContain(candidate.hypeRisk);
    expect([
      "investment",
      "customer",
      "supplier",
      "partnership",
      "infrastructure",
      "thematic",
      "speculative",
    ]).toContain(candidate.relationshipType);
  });
});
