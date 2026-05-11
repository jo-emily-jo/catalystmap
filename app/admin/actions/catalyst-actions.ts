"use server";

import { catalystSchema } from "@/lib/validations/catalyst";
import {
  createCatalyst,
  updateCatalyst,
  setCatalystThemes,
} from "@/lib/db/catalysts";
import { revalidatePath } from "next/cache";

export interface CatalystActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  catalystId?: string;
}

export async function createCatalystAction(
  _prev: CatalystActionState,
  formData: FormData
): Promise<CatalystActionState> {
  const raw = {
    slug: formData.get("slug") as string,
    name: formData.get("name") as string,
    legalName: (formData.get("legalName") as string) || undefined,
    country: formData.get("country") as string,
    isPublic: formData.get("isPublic") === "true",
    ticker: (formData.get("ticker") as string) || undefined,
    exchange: (formData.get("exchange") as string) || undefined,
    shortDescription: formData.get("shortDescription") as string,
    thesisMd: formData.get("thesisMd") as string,
    foundedYear: formData.get("foundedYear")
      ? Number(formData.get("foundedYear"))
      : undefined,
    website: (formData.get("website") as string) || undefined,
  };

  const result = catalystSchema.safeParse(raw);
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
    const id = await createCatalyst(result.data);

    const themeIds = formData.getAll("themeIds") as string[];
    if (themeIds.length > 0) {
      await setCatalystThemes(id, themeIds);
    }

    revalidatePath("/admin/catalysts");
    revalidatePath("/");
    return { success: true, catalystId: id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create catalyst";
    return { success: false, error: message };
  }
}

export async function updateCatalystAction(
  _prev: CatalystActionState,
  formData: FormData
): Promise<CatalystActionState> {
  const id = formData.get("id") as string;
  const raw = {
    slug: formData.get("slug") as string,
    name: formData.get("name") as string,
    legalName: (formData.get("legalName") as string) || undefined,
    country: formData.get("country") as string,
    isPublic: formData.get("isPublic") === "true",
    ticker: (formData.get("ticker") as string) || undefined,
    exchange: (formData.get("exchange") as string) || undefined,
    shortDescription: formData.get("shortDescription") as string,
    thesisMd: formData.get("thesisMd") as string,
    foundedYear: formData.get("foundedYear")
      ? Number(formData.get("foundedYear"))
      : undefined,
    website: (formData.get("website") as string) || undefined,
  };

  const result = catalystSchema.safeParse(raw);
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
    await updateCatalyst(id, result.data);

    const themeIds = formData.getAll("themeIds") as string[];
    await setCatalystThemes(id, themeIds);

    revalidatePath("/admin/catalysts");
    revalidatePath(`/catalyst/${result.data.slug}`);
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update catalyst";
    return { success: false, error: message };
  }
}
