import type {
  RelationshipType,
  RelationshipStrength,
  HypeRisk,
  ScoreBreakdown,
} from "@/lib/types";
import { SCORING_VERSION } from "./version";
import { computeDirectScore } from "./direct-score";
import { computeRevenueScore } from "./revenue-score";
import { computeSourceQualityScore } from "./source-quality-score";
import { computeRecencyScore } from "./recency-score";
import { computeMomentumScore } from "./momentum-score";
import { computeHypeRiskPenalty } from "./hype-risk-penalty";

interface ScoringInput {
  relationshipType: RelationshipType;
  relationshipStrength: RelationshipStrength;
  revenueExposurePct: number | null | undefined;
  sourceQualities: number[];
  lastVerifiedAt: Date;
  hypeRisk: HypeRisk;
}

export function computeRelevanceScore(
  input: ScoringInput,
  now: Date
): { score: number; breakdown: ScoreBreakdown } {
  const directScore = computeDirectScore(
    input.relationshipType,
    input.relationshipStrength
  );
  const revenueExposureScore = computeRevenueScore(input.revenueExposurePct);
  const sourceQualityScore = computeSourceQualityScore(input.sourceQualities);
  const recencyScore = computeRecencyScore(input.lastVerifiedAt, now);
  const momentumScore = computeMomentumScore();
  const hypeRiskPenalty = computeHypeRiskPenalty(input.hypeRisk);

  const subtotal =
    0.4 * directScore +
    0.2 * revenueExposureScore +
    0.2 * sourceQualityScore +
    0.1 * recencyScore +
    0.1 * momentumScore;

  const final = Math.max(0, Math.min(100, subtotal - hypeRiskPenalty));

  return {
    score: Math.round(final * 100) / 100,
    breakdown: {
      directScore,
      revenueExposureScore,
      sourceQualityScore,
      recencyScore,
      momentumScore,
      hypeRiskPenalty,
      subtotal: Math.round(subtotal * 100) / 100,
      final: Math.round(final * 100) / 100,
      version: SCORING_VERSION,
    },
  };
}
