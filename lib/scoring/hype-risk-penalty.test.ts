import { describe, it, expect } from "vitest";
import { computeHypeRiskPenalty } from "./hype-risk-penalty";

describe("computeHypeRiskPenalty", () => {
  it("low → 0", () => {
    expect(computeHypeRiskPenalty("low")).toBe(0);
  });

  it("medium → 5", () => {
    expect(computeHypeRiskPenalty("medium")).toBe(5);
  });

  it("high → 15", () => {
    expect(computeHypeRiskPenalty("high")).toBe(15);
  });
});
