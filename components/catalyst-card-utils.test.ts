import { describe, it, expect } from "vitest";
import { getBadgeLabel, shouldShowTicker } from "./catalyst-card-utils";

describe("getBadgeLabel", () => {
  it("returns 'Public' when isPublic is true", () => {
    expect(getBadgeLabel(true)).toBe("Public");
  });

  it("returns 'Private' when isPublic is false", () => {
    expect(getBadgeLabel(false)).toBe("Private");
  });
});

describe("shouldShowTicker", () => {
  it("returns true when public with a ticker", () => {
    expect(shouldShowTicker(true, "NVDA")).toBe(true);
  });

  it("returns false when private even with ticker", () => {
    expect(shouldShowTicker(false, "NVDA")).toBe(false);
  });

  it("returns false when public with null ticker", () => {
    expect(shouldShowTicker(true, null)).toBe(false);
  });

  it("returns false when public with empty ticker", () => {
    expect(shouldShowTicker(true, "")).toBe(false);
  });

  it("returns false when public with undefined ticker", () => {
    expect(shouldShowTicker(true, undefined)).toBe(false);
  });
});
