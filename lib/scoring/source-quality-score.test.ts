import { describe, it, expect } from "vitest";
import {
  sourceTypeToQuality,
  computeSourceQualityScore,
} from "./source-quality-score";
import type { SourceType } from "@/lib/types";

describe("sourceTypeToQuality", () => {
  const cases: [SourceType, number][] = [
    ["sec_filing", 100],
    ["earnings_call", 95],
    ["official_announcement", 90],
    ["reuters", 85],
    ["bloomberg", 85],
    ["ft", 85],
    ["wsj", 85],
    ["analyst_report", 70],
    ["news_article", 55],
    ["blog", 30],
    ["community", 15],
  ];

  it.each(cases)("%s → %d", (type, quality) => {
    expect(sourceTypeToQuality(type)).toBe(quality);
  });
});

describe("computeSourceQualityScore", () => {
  it("returns 0 for empty sources", () => {
    expect(computeSourceQualityScore([])).toBe(0);
  });

  it("single sec_filing: base 100 + bonus 2 = 100 (capped)", () => {
    expect(computeSourceQualityScore([100])).toBe(100);
  });

  it("single analyst_report: base 70 + bonus 2 = 72", () => {
    expect(computeSourceQualityScore([70])).toBe(72);
  });

  it("single news_article: base 55 + bonus 0 (below 70) = 55", () => {
    expect(computeSourceQualityScore([55])).toBe(55);
  });

  it("single blog: base 30 + bonus 0 = 30", () => {
    expect(computeSourceQualityScore([30])).toBe(30);
  });

  it("single community: base 15 + bonus 0 = 15", () => {
    expect(computeSourceQualityScore([15])).toBe(15);
  });

  it("multiple credible sources: agreement bonus capped at 10", () => {
    // 6 sources all >= 70: bonus = min(10, 2*6) = 10
    expect(computeSourceQualityScore([100, 95, 90, 85, 85, 70])).toBe(100);
  });

  it("two credible sources: bonus = 4", () => {
    // official_announcement (90) + analyst_report (70)
    expect(computeSourceQualityScore([90, 70])).toBe(94);
  });

  it("all sources below 70 yields zero bonus", () => {
    expect(computeSourceQualityScore([55, 30, 15])).toBe(55);
  });

  it("mix of credible and non-credible", () => {
    // base = 85, credible count = 1 (only 85 >= 70), bonus = 2
    expect(computeSourceQualityScore([85, 55, 30])).toBe(87);
  });
});
