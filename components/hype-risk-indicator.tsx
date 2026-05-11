import type { HypeRisk } from "@/lib/types";

const RISK_STYLES: Record<HypeRisk, { label: string; className: string }> = {
  low: { label: "Low", className: "text-green-700" },
  medium: { label: "Medium", className: "text-amber-700" },
  high: { label: "High", className: "text-red-700" },
};

export function HypeRiskIndicator({ level }: { level: HypeRisk }) {
  const { label, className } = RISK_STYLES[level];
  return <span className={`text-xs font-normal ${className}`}>{label}</span>;
}
