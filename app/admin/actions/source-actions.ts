"use server";

import { sourceSchema } from "@/lib/validations/source";
import { insertSource, updateSource, deleteSource } from "@/lib/db/sources";
import { getServerClient } from "@/lib/db/client";
import { revalidatePath } from "next/cache";
import type { SourceType } from "@/lib/types";

export interface SourceActionState {
  success: boolean;
  error?: string;
  urlWarning?: string;
  fieldErrors?: Record<string, string[]>;
}

async function checkUrlHealth(url: string): Promise<string | null> {
  if (url === "url-not-verified") return "URL marked as unverified";
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) {
      return `URL returned ${res.status}`;
    }
    return null;
  } catch {
    return "URL unreachable or timed out";
  }
}

export async function addSourceAction(
  _prev: SourceActionState,
  formData: FormData
): Promise<SourceActionState> {
  const raw = {
    url: formData.get("url") as string,
    title: (formData.get("title") as string) || undefined,
    sourceType: formData.get("sourceType") as string,
    accessedAt: formData.get("accessedAt") as string,
    publishedAt: (formData.get("publishedAt") as string) || null,
    excerpt: (formData.get("excerpt") as string) || undefined,
  };

  const result = sourceSchema.safeParse(raw);
  if (!result.success) {
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors as Record<
        string,
        string[]
      >,
    };
  }

  const urlWarning = await checkUrlHealth(result.data.url);

  const relationshipId = formData.get("relationshipId") as string;

  try {
    await insertSource({
      relationshipId,
      url: result.data.url,
      title: result.data.title,
      sourceType: result.data.sourceType as SourceType,
      accessedAt: result.data.accessedAt,
      publishedAt: result.data.publishedAt,
      excerpt: result.data.excerpt,
    });

    revalidatePath(`/admin/relationships/${relationshipId}`);
    return {
      success: true,
      urlWarning: urlWarning ?? undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add source";
    return { success: false, error: message };
  }
}

export async function deleteSourceAction(
  sourceId: string,
  relationshipId: string
): Promise<{ success: boolean; error?: string }> {
  // Check if this is the last source
  const supabase = getServerClient();
  const { count, error: countError } = await supabase
    .from("sources")
    .select("id", { count: "exact", head: true })
    .eq("relationship_id", relationshipId);

  if (countError) return { success: false, error: countError.message };

  if ((count ?? 0) <= 1) {
    return {
      success: false,
      error: "Cannot delete the last source on an active relationship",
    };
  }

  try {
    await deleteSource(sourceId);
    revalidatePath(`/admin/relationships/${relationshipId}`);
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to delete source";
    return { success: false, error: message };
  }
}
