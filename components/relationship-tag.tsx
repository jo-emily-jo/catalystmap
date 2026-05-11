import type { RelationshipType } from "@/lib/types";

const TYPE_LABELS: Record<RelationshipType, string> = {
  investment: "Investment",
  customer: "Customer",
  supplier: "Supplier",
  partnership: "Partnership",
  infrastructure: "Infrastructure",
  thematic: "Thematic",
  speculative: "Speculative",
};

export function RelationshipTag({ type }: { type: RelationshipType }) {
  return (
    <span className="inline-block rounded border border-[--border] px-2 py-0.5 text-xs font-normal text-[--foreground-secondary]">
      {TYPE_LABELS[type]}
    </span>
  );
}
