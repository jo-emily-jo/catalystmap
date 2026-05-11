export function computeRevenueScore(
  revenueExposurePct: number | null | undefined
): number {
  if (revenueExposurePct == null) return 30;
  if (revenueExposurePct >= 30) return 100;
  if (revenueExposurePct >= 15) return 80;
  if (revenueExposurePct >= 5) return 60;
  if (revenueExposurePct >= 1) return 40;
  if (revenueExposurePct > 0) return 20;
  return 0;
}
