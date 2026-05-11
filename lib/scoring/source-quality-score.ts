import type { SourceType } from "@/lib/types";

const QUALITY_MAP: Record<SourceType, number> = {
  sec_filing: 100,
  earnings_call: 95,
  official_announcement: 90,
  reuters: 85,
  bloomberg: 85,
  ft: 85,
  wsj: 85,
  analyst_report: 70,
  news_article: 55,
  blog: 30,
  community: 15,
};

export function sourceTypeToQuality(sourceType: SourceType): number {
  return QUALITY_MAP[sourceType];
}

export function computeSourceQualityScore(sourceQualities: number[]): number {
  if (sourceQualities.length === 0) return 0;

  const base = Math.max(...sourceQualities);
  const credibleCount = sourceQualities.filter((q) => q >= 70).length;
  const agreementBonus = Math.min(10, 2 * credibleCount);

  return Math.min(100, base + agreementBonus);
}
