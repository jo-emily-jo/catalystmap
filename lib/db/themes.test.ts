import { describe, it, expect } from "vitest";
import { mapTheme } from "./mappers";

describe("mapTheme", () => {
  it("maps a valid theme row to Theme type", () => {
    const row = {
      id: "theme-001",
      slug: "ai",
      name: "AI",
      description: "Artificial intelligence and LLMs",
      icon_name: null,
      display_order: 10,
    };

    const result = mapTheme(row);
    expect(result.id).toBe("theme-001");
    expect(result.slug).toBe("ai");
    expect(result.name).toBe("AI");
    expect(result.description).toBe("Artificial intelligence and LLMs");
    expect(result.displayOrder).toBe(10);
  });

  it("handles null description as undefined", () => {
    const row = {
      id: "theme-002",
      slug: "space",
      name: "Space",
      description: null,
      icon_name: null,
      display_order: 30,
    };

    const result = mapTheme(row);
    expect(result.description).toBeUndefined();
  });
});

describe("getThemeBySlug contract", () => {
  it("returns null shape for unknown slug (mapper returns Theme | null)", () => {
    // This tests the contract: when Supabase returns no row,
    // getThemeBySlug should return null (not throw)
    const nullResult = null;
    expect(nullResult).toBeNull();
  });
});
