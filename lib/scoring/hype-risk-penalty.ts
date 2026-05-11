import type { HypeRisk } from "@/lib/types";

const PENALTY_MAP: Record<HypeRisk, number> = {
  low: 0,
  medium: 5,
  high: 15,
};

export function computeHypeRiskPenalty(hypeRisk: HypeRisk): number {
  return PENALTY_MAP[hypeRisk];
}
