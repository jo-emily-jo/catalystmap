import { describe, it, expect } from "vitest";
import { computeGovernmentProcurementBonus } from "./government-procurement-bonus";

describe("computeGovernmentProcurementBonus", () => {
  it("true → 3", () => {
    expect(computeGovernmentProcurementBonus(true)).toBe(3);
  });

  it("false → 0", () => {
    expect(computeGovernmentProcurementBonus(false)).toBe(0);
  });
});
