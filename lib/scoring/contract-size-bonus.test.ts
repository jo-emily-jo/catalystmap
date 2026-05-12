import { describe, it, expect } from "vitest";
import { computeContractSizeBonus } from "./contract-size-bonus";

describe("computeContractSizeBonus", () => {
  it("null → 0", () => {
    expect(computeContractSizeBonus(null)).toBe(0);
  });

  it("undefined → 0", () => {
    expect(computeContractSizeBonus(undefined)).toBe(0);
  });

  it("0 → 0", () => {
    expect(computeContractSizeBonus(0)).toBe(0);
  });

  it("1 → 0", () => {
    expect(computeContractSizeBonus(1)).toBe(0);
  });

  it("9_999_999 → 0 (just below 10M)", () => {
    expect(computeContractSizeBonus(9_999_999)).toBe(0);
  });

  it("10_000_000 → 2 (boundary)", () => {
    expect(computeContractSizeBonus(10_000_000)).toBe(2);
  });

  it("99_999_999 → 2 (just below 100M)", () => {
    expect(computeContractSizeBonus(99_999_999)).toBe(2);
  });

  it("100_000_000 → 5 (boundary)", () => {
    expect(computeContractSizeBonus(100_000_000)).toBe(5);
  });

  it("999_999_999 → 5 (just below 1B)", () => {
    expect(computeContractSizeBonus(999_999_999)).toBe(5);
  });

  it("1_000_000_000 → 10 (boundary)", () => {
    expect(computeContractSizeBonus(1_000_000_000)).toBe(10);
  });

  it("5_000_000_000 → 10", () => {
    expect(computeContractSizeBonus(5_000_000_000)).toBe(10);
  });
});
