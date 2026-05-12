export function computeContractSizeBonus(
  contractValueUsd: number | null | undefined
): number {
  if (contractValueUsd == null) return 0;
  if (contractValueUsd >= 1_000_000_000) return 10;
  if (contractValueUsd >= 100_000_000) return 5;
  if (contractValueUsd >= 10_000_000) return 2;
  return 0;
}
