export function computeRecencyScore(lastVerifiedAt: Date, now: Date): number {
  const msPerDay = 86_400_000;
  const ageDays = Math.floor(
    (now.getTime() - lastVerifiedAt.getTime()) / msPerDay
  );

  if (ageDays <= 90) return 100;
  if (ageDays <= 180) return 80;
  if (ageDays <= 365) return 60;
  if (ageDays <= 730) return 30;
  return 10;
}
