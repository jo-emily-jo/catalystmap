"use server";

import {
  relationshipSchema,
  relationshipUpdateSchema,
} from "@/lib/validations/relationship";
import { sourceSchema } from "@/lib/validations/source";
import {
  createRelationship,
  updateRelationship,
  deleteRelationship,
  recomputeAndSaveScore,
} from "@/lib/db/relationships";
import { insertSource } from "@/lib/db/sources";
import { sourceTypeToQuality } from "@/lib/scoring/source-quality-score";
import { revalidatePath } from "next/cache";
import type { SourceType } from "@/lib/types";

export interface RelationshipActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  relationshipId?: string;
}

export async function createRelationshipAction(
  _prev: RelationshipActionState,
  formData: FormData
): Promise<RelationshipActionState> {
  const sourcesJson = formData.get("sources") as string;
  let parsedSources: unknown[];
  try {
    parsedSources = JSON.parse(sourcesJson);
  } catch {
    return { success: false, error: "Invalid sources data" };
  }

  const raw = {
    catalystId: formData.get("catalystId") as string,
    relatedCompanyId: formData.get("relatedCompanyId") as string,
    relationshipType: formData.get("relationshipType") as string,
    relationshipStrength: formData.get("relationshipStrength") as string,
    summary: formData.get("summary") as string,
    revenueExposurePct: formData.get("revenueExposurePct")
      ? Number(formData.get("revenueExposurePct"))
      : null,
    lastVerifiedAt: formData.get("lastVerifiedAt") as string,
    hypeRisk: formData.get("hypeRisk") as string,
    sources: parsedSources,
  };

  const result = relationshipSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    const aiAssisted = formData.get("aiAssisted") === "true";
    const contractValueUsd = formData.get("contractValueUsd")
      ? Number(formData.get("contractValueUsd"))
      : null;
    const isGovernmentProcurement =
      formData.get("isGovernmentProcurement") === "true";

    const relId = await createRelationship({
      ...result.data,
      contractValueUsd,
      isGovernmentProcurement,
      aiAssisted,
    });

    for (const src of result.data.sources) {
      await insertSource({
        relationshipId: relId,
        url: src.url,
        title: src.title,
        sourceType: src.sourceType as SourceType,
        accessedAt: src.accessedAt,
        publishedAt: src.publishedAt,
        excerpt: src.excerpt,
      });
    }

    // recomputeAndSaveScore already fires inside insertSource,
    // but call once more to ensure final state is consistent
    await recomputeAndSaveScore(relId);

    revalidatePath("/admin/catalysts");
    return { success: true, relationshipId: relId };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create relationship";
    return { success: false, error: message };
  }
}

export async function updateRelationshipAction(
  _prev: RelationshipActionState,
  formData: FormData
): Promise<RelationshipActionState> {
  const id = formData.get("id") as string;
  const raw = {
    relationshipType: formData.get("relationshipType") as string,
    relationshipStrength: formData.get("relationshipStrength") as string,
    summary: formData.get("summary") as string,
    revenueExposurePct: formData.get("revenueExposurePct")
      ? Number(formData.get("revenueExposurePct"))
      : null,
    lastVerifiedAt: formData.get("lastVerifiedAt") as string,
    hypeRisk: formData.get("hypeRisk") as string,
  };

  const result = relationshipUpdateSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  try {
    await updateRelationship(id, result.data);
    revalidatePath(`/admin/relationships/${id}`);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update relationship";
    return { success: false, error: message };
  }
}

export async function deleteRelationshipAction(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteRelationship(id);
    revalidatePath("/admin/catalysts");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete relationship";
    return { success: false, error: message };
  }
}
