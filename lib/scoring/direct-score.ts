import type { RelationshipType, RelationshipStrength } from "@/lib/types";

const MATRIX: Record<RelationshipType, Record<RelationshipStrength, number>> = {
  supplier: { direct: 100, indirect: 70, speculative: 30 },
  customer: { direct: 100, indirect: 70, speculative: 30 },
  infrastructure: { direct: 90, indirect: 65, speculative: 25 },
  partnership: { direct: 80, indirect: 55, speculative: 25 },
  investment: { direct: 80, indirect: 55, speculative: 25 },
  thematic: { direct: 30, indirect: 20, speculative: 10 },
  speculative: { direct: 20, indirect: 15, speculative: 5 },
};

export function computeDirectScore(
  type: RelationshipType,
  strength: RelationshipStrength
): number {
  return MATRIX[type][strength];
}
