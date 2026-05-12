import { getPublicClient, getServerClient } from "./client";
import { mapRelationship } from "./mappers";
import type {
  Relationship,
  RelationshipType,
  RelationshipStrength,
  HypeRisk,
} from "@/lib/types";
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
 */
export async function recomputeAndSaveScore(
  relationshipId: string
): Promise<void> {
  const supabase = getServerClient();

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
      contractValueUsd: rel.contract_value_usd,
      isGovernmentProcurement: rel.is_government_procurement,
    },
    new Date()
  );

  const { error: updateError } = await supabase
    .from("relationships")
    .update({
      relevance_score: score,
      score_version: SCORING_VERSION,
      score_breakdown: breakdown,
    })
    .eq("id", relationshipId);

  if (updateError) throw updateError;

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

// ── Write functions ───────────────────────────────────────────────

export interface CreateRelationshipInput {
  catalystId: string;
  relatedCompanyId: string;
  relationshipType: RelationshipType;
  relationshipStrength: RelationshipStrength;
  summary: string;
  revenueExposurePct?: number | null;
  lastVerifiedAt: string;
  hypeRisk: HypeRisk;
  contractValueUsd?: number | null;
  isGovernmentProcurement?: boolean;
  aiAssisted?: boolean;
}

export async function createRelationship(
  input: CreateRelationshipInput
): Promise<string> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("relationships")
    .insert({
      catalyst_id: input.catalystId,
      related_company_id: input.relatedCompanyId,
      relationship_type: input.relationshipType,
      relationship_strength: input.relationshipStrength,
      summary: input.summary,
      revenue_exposure_pct: input.revenueExposurePct ?? null,
      last_verified_at: input.lastVerifiedAt,
      hype_risk: input.hypeRisk,
      contract_value_usd: input.contractValueUsd ?? null,
      is_government_procurement: input.isGovernmentProcurement ?? false,
      ai_assisted: input.aiAssisted ?? false,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateRelationship(
  id: string,
  input: Partial<
    Omit<CreateRelationshipInput, "catalystId" | "relatedCompanyId">
  >
): Promise<void> {
  const supabase = getServerClient();
  const updates: Record<string, unknown> = {};
  if (input.relationshipType !== undefined)
    updates.relationship_type = input.relationshipType;
  if (input.relationshipStrength !== undefined)
    updates.relationship_strength = input.relationshipStrength;
  if (input.summary !== undefined) updates.summary = input.summary;
  if (input.revenueExposurePct !== undefined)
    updates.revenue_exposure_pct = input.revenueExposurePct;
  if (input.lastVerifiedAt !== undefined)
    updates.last_verified_at = input.lastVerifiedAt;
  if (input.hypeRisk !== undefined) updates.hype_risk = input.hypeRisk;

  const { error } = await supabase
    .from("relationships")
    .update(updates)
    .eq("id", id);

  if (error) throw error;

  await recomputeAndSaveScore(id);
}

export async function deleteRelationship(id: string): Promise<void> {
  const supabase = getServerClient();
  const { error } = await supabase
    .from("relationships")
    .update({ is_active: false })
    .eq("id", id);

  if (error) throw error;
}

export async function getRelationshipById(
  id: string
): Promise<Relationship | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("relationships")
    .select("*, related_companies(*), sources(*)")
    .eq("id", id)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return mapRelationship(data);
}
