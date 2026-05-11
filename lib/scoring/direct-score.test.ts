import { describe, it, expect } from "vitest";
import { computeDirectScore } from "./direct-score";
import type { RelationshipType, RelationshipStrength } from "@/lib/types";

const expected: [RelationshipType, RelationshipStrength, number][] = [
  ["investment", "direct", 100],
  ["investment", "indirect", 70],
  ["investment", "speculative", 30],
  ["customer", "direct", 90],
  ["customer", "indirect", 60],
  ["customer", "speculative", 25],
  ["supplier", "direct", 90],
  ["supplier", "indirect", 60],
  ["supplier", "speculative", 25],
  ["partnership", "direct", 80],
  ["partnership", "indirect", 55],
  ["partnership", "speculative", 25],
  ["infrastructure", "direct", 75],
  ["infrastructure", "indirect", 50],
  ["infrastructure", "speculative", 20],
  ["thematic", "direct", 50],
  ["thematic", "indirect", 35],
  ["thematic", "speculative", 15],
  ["speculative", "direct", 30],
  ["speculative", "indirect", 20],
  ["speculative", "speculative", 10],
];

describe("computeDirectScore", () => {
  it.each(expected)("%s × %s → %d", (type, strength, score) => {
    expect(computeDirectScore(type, strength)).toBe(score);
  });
});
