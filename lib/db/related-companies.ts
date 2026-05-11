import { getPublicClient } from "./client";
import { mapRelatedCompany } from "./mappers";
import type { RelatedCompany } from "@/lib/types";

export async function getRelatedCompanyByTicker(
  ticker: string,
  exchange: string
): Promise<RelatedCompany | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("related_companies")
    .select("*")
    .eq("ticker", ticker)
    .eq("exchange", exchange)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return mapRelatedCompany(data);
}
