import { describe, it, expect } from "vitest";
import { computeRevenueScore } from "./revenue-score";

describe("computeRevenueScore", () => {
  it("returns 30 for null", () => {
    expect(computeRevenueScore(null)).toBe(30);
  });

  it("returns 30 for undefined", () => {
    expect(computeRevenueScore(undefined)).toBe(30);
  });

  it("returns 0 for 0", () => {
    expect(computeRevenueScore(0)).toBe(0);
  });

  it("returns 20 for 0.5 (> 0 but < 1)", () => {
    expect(computeRevenueScore(0.5)).toBe(20);
  });

  it("returns 40 for 1 (boundary)", () => {
    expect(computeRevenueScore(1)).toBe(40);
  });

  it("returns 40 for 4 (>= 1 but < 5)", () => {
    expect(computeRevenueScore(4)).toBe(40);
  });

  it("returns 60 for 5 (boundary)", () => {
    expect(computeRevenueScore(5)).toBe(60);
  });

  it("returns 60 for 14 (>= 5 but < 15)", () => {
    expect(computeRevenueScore(14)).toBe(60);
  });

  it("returns 80 for 15 (boundary)", () => {
    expect(computeRevenueScore(15)).toBe(80);
  });

  it("returns 80 for 29 (>= 15 but < 30)", () => {
    expect(computeRevenueScore(29)).toBe(80);
  });

  it("returns 100 for 30 (boundary)", () => {
    expect(computeRevenueScore(30)).toBe(100);
  });

  it("returns 100 for 100", () => {
    expect(computeRevenueScore(100)).toBe(100);
  });
});
