import { describe, it, expect } from "vitest";
import { formatPercent } from "./format";

describe("formatPercent", () => {
  it("formats a number as a percentage string", () => {
    expect(formatPercent(12.345)).toBe("12.3%");
  });

  it("uses the specified decimal places", () => {
    expect(formatPercent(12.345, 2)).toBe("12.35%");
  });

  it("handles zero", () => {
    expect(formatPercent(0)).toBe("0.0%");
  });

  it("handles whole numbers", () => {
    expect(formatPercent(100, 0)).toBe("100%");
  });
});
