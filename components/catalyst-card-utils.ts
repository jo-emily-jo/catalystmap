export function getBadgeLabel(isPublic: boolean): string {
  return isPublic ? "Public" : "Private";
}

export function shouldShowTicker(
  isPublic: boolean,
  ticker: string | null | undefined
): boolean {
  return isPublic && !!ticker && ticker.length > 0;
}
