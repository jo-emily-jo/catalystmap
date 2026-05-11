import { getPublicClient } from "./client";
import { mapRelationship } from "./mappers";
import type { Relationship } from "@/lib/types";

export async function listRelationshipsByCatalyst(
  catalystId: string
): Promise<Relationship[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("relationships")
    .select(
      `
      *,
      related_companies(*),
      sources(*)
    `
    )
    .eq("catalyst_id", catalystId)
    .eq("is_active", true)
    .order("relevance_score", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapRelationship);
}
