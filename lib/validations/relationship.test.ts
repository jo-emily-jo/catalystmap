import { describe, it, expect } from "vitest";
import { relationshipSchema } from "./relationship";

const validSource = {
  url: "https://example.com/source",
  sourceType: "news_article" as const,
  accessedAt: "2025-12-01T00:00:00Z",
};

const validRelationship = {
  catalystId: "550e8400-e29b-41d4-a716-446655440000",
  relatedCompanyId: "550e8400-e29b-41d4-a716-446655440001",
  relationshipType: "supplier" as const,
  relationshipStrength: "direct" as const,
  summary: "Supplies critical components.",
  lastVerifiedAt: "2025-12-01",
  hypeRisk: "low" as const,
  sources: [validSource],
};

describe("relationshipSchema", () => {
  it("accepts a valid relationship with 1 source", () => {
    const result = relationshipSchema.safeParse(validRelationship);
    expect(result.success).toBe(true);
  });

  it("accepts a relationship with multiple sources", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      sources: [
        validSource,
        { ...validSource, url: "https://example.com/second" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects a relationship with 0 sources", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      sources: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const sourceErrors = result.error.flatten().fieldErrors.sources;
      expect(sourceErrors).toBeDefined();
      expect(sourceErrors?.[0]).toContain("At least one source");
    }
  });

  it("rejects invalid relationship type", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      relationshipType: "acquisition",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid relationship strength", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      relationshipStrength: "strong",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid hype risk", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      hypeRisk: "extreme",
    });
    expect(result.success).toBe(false);
  });

  it("rejects missing summary", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      summary: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional revenueExposurePct as null", () => {
    const result = relationshipSchema.safeParse({
      ...validRelationship,
      revenueExposurePct: null,
    });
    expect(result.success).toBe(true);
  });
});
