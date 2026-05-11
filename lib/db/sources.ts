import { getServerClient } from "./client";
import { recomputeAndSaveScore } from "./relationships";
import type { SourceType } from "@/lib/types";
import { sourceTypeToQuality } from "@/lib/scoring/source-quality-score";

interface InsertSourceInput {
  relationshipId: string;
  url: string;
  title?: string;
  sourceType: SourceType;
  publishedAt?: string | null;
  accessedAt: string;
  excerpt?: string;
}

interface UpdateSourceInput {
  id: string;
  url?: string;
  title?: string;
  sourceType?: SourceType;
  publishedAt?: string | null;
  accessedAt?: string;
  excerpt?: string;
}

export async function insertSource(input: InsertSourceInput): Promise<string> {
  const supabase = getServerClient();

  const { data, error } = await supabase
    .from("sources")
    .insert({
      relationship_id: input.relationshipId,
      url: input.url,
      title: input.title ?? null,
      source_type: input.sourceType,
      source_quality: sourceTypeToQuality(input.sourceType),
      published_at: input.publishedAt ?? null,
      accessed_at: input.accessedAt,
      excerpt: input.excerpt ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;

  await recomputeAndSaveScore(input.relationshipId);
  return data.id;
}

export async function updateSource(input: UpdateSourceInput): Promise<void> {
  const supabase = getServerClient();

  // Fetch current source to get relationship_id and resolve partial updates
  const { data: existing, error: fetchError } = await supabase
    .from("sources")
    .select("relationship_id, source_type")
    .eq("id", input.id)
    .single();

  if (fetchError) throw fetchError;

  const updates: Record<string, unknown> = {};
  if (input.url !== undefined) updates.url = input.url;
  if (input.title !== undefined) updates.title = input.title;
  if (input.publishedAt !== undefined) updates.published_at = input.publishedAt;
  if (input.accessedAt !== undefined) updates.accessed_at = input.accessedAt;
  if (input.excerpt !== undefined) updates.excerpt = input.excerpt;
  if (input.sourceType !== undefined) {
    updates.source_type = input.sourceType;
    updates.source_quality = sourceTypeToQuality(input.sourceType);
  }

  const { error } = await supabase
    .from("sources")
    .update(updates)
    .eq("id", input.id);

  if (error) throw error;

  await recomputeAndSaveScore(existing.relationship_id);
}

export async function deleteSource(sourceId: string): Promise<void> {
  const supabase = getServerClient();

  // Fetch relationship_id before deleting
  const { data: existing, error: fetchError } = await supabase
    .from("sources")
    .select("relationship_id")
    .eq("id", sourceId)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase.from("sources").delete().eq("id", sourceId);

  if (error) throw error;

  await recomputeAndSaveScore(existing.relationship_id);
}
