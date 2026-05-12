"use client";

import type { ScoreBreakdown } from "@/lib/types";

const WEIGHTED_COMPONENTS: {
  label: string;
  key: keyof ScoreBreakdown;
  weight: string;
  weightNum: number;
}[] = [
  { label: "Direct", key: "directScore", weight: "40%", weightNum: 0.4 },
  {
    label: "Revenue",
    key: "revenueExposureScore",
    weight: "20%",
    weightNum: 0.2,
  },
  {
    label: "Source quality",
    key: "sourceQualityScore",
    weight: "15%",
    weightNum: 0.15,
  },
  { label: "Recency", key: "recencyScore", weight: "10%", weightNum: 0.1 },
  { label: "Momentum", key: "momentumScore", weight: "5%", weightNum: 0.05 },
];

export function ScoreBreakdownPanel({
  breakdown,
}: {
  breakdown: ScoreBreakdown;
}) {
  return (
    <div className="space-y-1 font-mono text-xs">
      <div className="mb-2 font-sans text-sm font-medium text-[--foreground]">
        Score: {breakdown.final}
      </div>
      <div className="border-t border-[--border] pt-1">
        {WEIGHTED_COMPONENTS.map(({ label, key, weight, weightNum }) => {
          const value = breakdown[key] as number;
          const weighted = (value * weightNum).toFixed(1);
          return (
            <div key={key} className="flex justify-between py-0.5">
              <span className="text-[--foreground-secondary]">{label}</span>
              <span className="text-[--foreground]">
                {value} x {weight} = {weighted}
              </span>
            </div>
          );
        })}
      </div>
      {(breakdown.contractSizeBonus > 0 ||
        breakdown.governmentProcurementBonus > 0) && (
        <div className="border-t border-[--border] pt-1">
          {breakdown.contractSizeBonus > 0 && (
            <div className="flex justify-between py-0.5">
              <span className="text-[--foreground-secondary]">
                Contract size
              </span>
              <span className="text-[--foreground]">
                +{breakdown.contractSizeBonus}
              </span>
            </div>
          )}
          {breakdown.governmentProcurementBonus > 0 && (
            <div className="flex justify-between py-0.5">
              <span className="text-[--foreground-secondary]">
                Gov procurement
              </span>
              <span className="text-[--foreground]">
                +{breakdown.governmentProcurementBonus}
              </span>
            </div>
          )}
        </div>
      )}
      <div className="border-t border-[--border] pt-1">
        <div className="flex justify-between py-0.5">
          <span className="text-[--foreground-secondary]">Subtotal</span>
          <span className="text-[--foreground]">{breakdown.subtotal}</span>
        </div>
        <div className="flex justify-between py-0.5">
          <span className="text-[--foreground-secondary]">
            Hype-risk penalty
          </span>
          <span className="text-[--foreground]">
            -{breakdown.hypeRiskPenalty}
          </span>
        </div>
      </div>
      <div className="border-t border-[--border] pt-1">
        <div className="flex justify-between py-0.5 font-medium">
          <span className="text-[--foreground]">Final</span>
          <span className="text-[--foreground]">{breakdown.final}</span>
        </div>
        <div className="pt-1 font-sans text-[10px] text-[--foreground-secondary]">
          Scoring version: v{breakdown.version}
        </div>
        <div className="font-sans text-[10px] text-[--foreground-secondary]">
          This score measures relationship strength and evidence quality, not
          investment quality.
        </div>
      </div>
    </div>
  );
}
