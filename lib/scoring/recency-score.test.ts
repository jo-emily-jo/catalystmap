import { describe, it, expect } from "vitest";
import { computeRecencyScore } from "./recency-score";

function daysAgo(days: number, from: Date): Date {
  return new Date(from.getTime() - days * 86_400_000);
}

describe("computeRecencyScore", () => {
  const now = new Date("2026-01-01T00:00:00Z");

  it("89 days → 100", () => {
    expect(computeRecencyScore(daysAgo(89, now), now)).toBe(100);
  });

  it("90 days → 100 (boundary, <= 90)", () => {
    expect(computeRecencyScore(daysAgo(90, now), now)).toBe(100);
  });

  it("91 days → 80", () => {
    expect(computeRecencyScore(daysAgo(91, now), now)).toBe(80);
  });

  it("179 days → 80", () => {
    expect(computeRecencyScore(daysAgo(179, now), now)).toBe(80);
  });

  it("180 days → 80 (boundary, <= 180)", () => {
    expect(computeRecencyScore(daysAgo(180, now), now)).toBe(80);
  });

  it("181 days → 60", () => {
    expect(computeRecencyScore(daysAgo(181, now), now)).toBe(60);
  });

  it("364 days → 60", () => {
    expect(computeRecencyScore(daysAgo(364, now), now)).toBe(60);
  });

  it("365 days → 60 (boundary, <= 365)", () => {
    expect(computeRecencyScore(daysAgo(365, now), now)).toBe(60);
  });

  it("366 days → 30", () => {
    expect(computeRecencyScore(daysAgo(366, now), now)).toBe(30);
  });

  it("730 days → 30 (boundary, <= 730)", () => {
    expect(computeRecencyScore(daysAgo(730, now), now)).toBe(30);
  });

  it("731 days → 10", () => {
    expect(computeRecencyScore(daysAgo(731, now), now)).toBe(10);
  });
});
