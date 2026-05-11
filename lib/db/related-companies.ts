import { getPublicClient, getServerClient } from "./client";
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

export async function listRelatedCompanies(): Promise<RelatedCompany[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("related_companies")
    .select("*")
    .order("ticker", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapRelatedCompany);
}

export interface CreateRelatedCompanyInput {
  ticker: string;
  exchange: string;
  name: string;
  country?: string;
  sector?: string;
  industry?: string;
  shortDescription?: string;
  website?: string;
}

export async function createRelatedCompany(
  input: CreateRelatedCompanyInput
): Promise<string> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("related_companies")
    .insert({
      ticker: input.ticker,
      exchange: input.exchange,
      name: input.name,
      country: input.country ?? null,
      sector: input.sector ?? null,
      industry: input.industry ?? null,
      short_description: input.shortDescription ?? null,
      website: input.website ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateRelatedCompany(
  id: string,
  input: Partial<CreateRelatedCompanyInput>
): Promise<void> {
  const supabase = getServerClient();
  const updates: Record<string, unknown> = {};
  if (input.ticker !== undefined) updates.ticker = input.ticker;
  if (input.exchange !== undefined) updates.exchange = input.exchange;
  if (input.name !== undefined) updates.name = input.name;
  if (input.country !== undefined) updates.country = input.country;
  if (input.sector !== undefined) updates.sector = input.sector;
  if (input.industry !== undefined) updates.industry = input.industry;
  if (input.shortDescription !== undefined)
    updates.short_description = input.shortDescription;
  if (input.website !== undefined) updates.website = input.website;

  const { error } = await supabase
    .from("related_companies")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}
