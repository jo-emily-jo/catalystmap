"use server";

import { relatedCompanySchema } from "@/lib/validations/related-company";
import {
  createRelatedCompany,
  updateRelatedCompany,
} from "@/lib/db/related-companies";
import { revalidatePath } from "next/cache";

export interface RelatedCompanyActionState {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  companyId?: string;
}

export async function createRelatedCompanyAction(
  _prev: RelatedCompanyActionState,
  formData: FormData
): Promise<RelatedCompanyActionState> {
  const raw = {
    ticker: formData.get("ticker") as string,
    exchange: formData.get("exchange") as string,
    name: formData.get("name") as string,
    country: (formData.get("country") as string) || undefined,
    sector: (formData.get("sector") as string) || undefined,
    industry: (formData.get("industry") as string) || undefined,
    shortDescription: (formData.get("shortDescription") as string) || undefined,
    website: (formData.get("website") as string) || undefined,
  };

  const result = relatedCompanySchema.safeParse(raw);
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
    const id = await createRelatedCompany(result.data);
    revalidatePath("/admin/related-companies");
    return { success: true, companyId: id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to create company";
    return { success: false, error: message };
  }
}

export async function updateRelatedCompanyAction(
  _prev: RelatedCompanyActionState,
  formData: FormData
): Promise<RelatedCompanyActionState> {
  const id = formData.get("id") as string;
  const raw = {
    ticker: formData.get("ticker") as string,
    exchange: formData.get("exchange") as string,
    name: formData.get("name") as string,
    country: (formData.get("country") as string) || undefined,
    sector: (formData.get("sector") as string) || undefined,
    industry: (formData.get("industry") as string) || undefined,
    shortDescription: (formData.get("shortDescription") as string) || undefined,
    website: (formData.get("website") as string) || undefined,
  };

  const result = relatedCompanySchema.safeParse(raw);
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
    await updateRelatedCompany(id, result.data);
    revalidatePath("/admin/related-companies");
    return { success: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to update company";
    return { success: false, error: message };
  }
}
