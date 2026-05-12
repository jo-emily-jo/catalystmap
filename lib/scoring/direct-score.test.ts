import { describe, it, expect } from "vitest";
import { computeDirectScore } from "./direct-score";
import type { RelationshipType, RelationshipStrength } from "@/lib/types";

const expected: [RelationshipType, RelationshipStrength, number][] = [
  ["supplier", "direct", 100],
  ["supplier", "indirect", 70],
  ["supplier", "speculative", 30],
  ["customer", "direct", 100],
  ["customer", "indirect", 70],
  ["customer", "speculative", 30],
  ["infrastructure", "direct", 90],
  ["infrastructure", "indirect", 65],
  ["infrastructure", "speculative", 25],
  ["partnership", "direct", 80],
  ["partnership", "indirect", 55],
  ["partnership", "speculative", 25],
  ["investment", "direct", 80],
  ["investment", "indirect", 55],
  ["investment", "speculative", 25],
  ["thematic", "direct", 30],
  ["thematic", "indirect", 20],
  ["thematic", "speculative", 10],
  ["speculative", "direct", 20],
  ["speculative", "indirect", 15],
  ["speculative", "speculative", 5],
];

describe("computeDirectScore (v2)", () => {
  it.each(expected)("%s x %s → %d", (type, strength, score) => {
    expect(computeDirectScore(type, strength)).toBe(score);
  });
});
