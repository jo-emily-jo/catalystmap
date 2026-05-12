export function computeGovernmentProcurementBonus(
  isGovernmentProcurement: boolean
): number {
  return isGovernmentProcurement ? 3 : 0;
}
