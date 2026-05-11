import type { RelationshipType, RelationshipStrength } from "@/lib/types";

const MATRIX: Record<RelationshipType, Record<RelationshipStrength, number>> = {
  investment: { direct: 100, indirect: 70, speculative: 30 },
  customer: { direct: 90, indirect: 60, speculative: 25 },
  supplier: { direct: 90, indirect: 60, speculative: 25 },
  partnership: { direct: 80, indirect: 55, speculative: 25 },
  infrastructure: { direct: 75, indirect: 50, speculative: 20 },
  thematic: { direct: 50, indirect: 35, speculative: 15 },
  speculative: { direct: 30, indirect: 20, speculative: 10 },
};

export function computeDirectScore(
  type: RelationshipType,
  strength: RelationshipStrength
): number {
  return MATRIX[type][strength];
}
