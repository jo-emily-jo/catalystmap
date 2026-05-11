import { getPublicClient, getServerClient } from "./client";
import { mapRelationship } from "./mappers";
import type { Relationship } from "@/lib/types";
import { computeRelevanceScore } from "@/lib/scoring/compute-relevance-score";
import { SCORING_VERSION } from "@/lib/scoring/version";

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

/**
 * Recompute the relevance score for a single relationship.
 * Updates `relationships` row and appends a `score_snapshots` row.
 * Uses the service role client (server-only).
 */
export async function recomputeAndSaveScore(
  relationshipId: string
): Promise<void> {
  const supabase = getServerClient();

  // Fetch the relationship + its sources
  const { data: rel, error: relError } = await supabase
    .from("relationships")
    .select("*, sources(*)")
    .eq("id", relationshipId)
    .single();

  if (relError) throw relError;

  const sourceQualities = (rel.sources ?? []).map(
    (s: { source_quality: number }) => s.source_quality
  );

  const { score, breakdown } = computeRelevanceScore(
    {
      relationshipType: rel.relationship_type,
      relationshipStrength: rel.relationship_strength,
      revenueExposurePct: rel.revenue_exposure_pct,
      sourceQualities,
      lastVerifiedAt: new Date(rel.last_verified_at),
      hypeRisk: rel.hype_risk,
    },
    new Date()
  );

  // Update the relationship row
  const { error: updateError } = await supabase
    .from("relationships")
    .update({
      relevance_score: score,
      score_version: SCORING_VERSION,
      score_breakdown: breakdown,
    })
    .eq("id", relationshipId);

  if (updateError) throw updateError;

  // Append a score snapshot
  const { error: snapshotError } = await supabase
    .from("score_snapshots")
    .insert({
      relationship_id: relationshipId,
      score,
      score_version: SCORING_VERSION,
      breakdown,
    });

  if (snapshotError) throw snapshotError;
}
