import { getPublicClient, getServerClient } from "./client";
import { mapCatalyst, mapTheme } from "./mappers";
import type { CatalystCompany, Theme } from "@/lib/types";

interface CatalystThemeJoinRow {
  themes: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    icon_name: string | null;
    display_order: number;
  };
}

async function hydrateCatalystThemes(catalystId: string): Promise<Theme[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("catalyst_themes")
    .select("themes(*)")
    .eq("catalyst_id", catalystId);

  if (error) throw error;
  const rows = (data ?? []) as unknown as CatalystThemeJoinRow[];
  return rows.map((row) => mapTheme(row.themes));
}

export async function listCatalysts(): Promise<CatalystCompany[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("catalyst_companies")
    .select("*")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => {
      const themes = await hydrateCatalystThemes(row.id);
      return mapCatalyst(row, themes);
    })
  );
}

export async function getCatalystBySlug(
  slug: string
): Promise<CatalystCompany | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("catalyst_companies")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;

  const themes = await hydrateCatalystThemes(data.id);
  return mapCatalyst(data, themes);
}

export async function listCatalystsByTheme(
  themeSlug: string
): Promise<CatalystCompany[]> {
  const supabase = getPublicClient();

  const { data: themeData, error: themeError } = await supabase
    .from("themes")
    .select("id")
    .eq("slug", themeSlug)
    .single();

  if (themeError && themeError.code !== "PGRST116") throw themeError;
  if (!themeData) return [];

  const { data: junctionData, error: junctionError } = await supabase
    .from("catalyst_themes")
    .select("catalyst_id")
    .eq("theme_id", themeData.id);

  if (junctionError) throw junctionError;
  if (!junctionData || junctionData.length === 0) return [];

  const catalystIds = junctionData.map((r) => r.catalyst_id);

  const { data, error } = await supabase
    .from("catalyst_companies")
    .select("*")
    .in("id", catalystIds)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;

  return Promise.all(
    (data ?? []).map(async (row) => {
      const themes = await hydrateCatalystThemes(row.id);
      return mapCatalyst(row, themes);
    })
  );
}

export async function countCatalystsByTheme(): Promise<Record<string, number>> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("catalyst_themes")
    .select("theme_id, themes(slug)");

  if (error) throw error;

  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const slug = (row.themes as unknown as { slug: string })?.slug;
    if (slug) {
      counts[slug] = (counts[slug] ?? 0) + 1;
    }
  }
  return counts;
}

// ── Write functions (service role) ────────────────────────────────

export interface CreateCatalystInput {
  slug: string;
  name: string;
  legalName?: string;
  country: string;
  isPublic: boolean;
  ticker?: string;
  exchange?: string;
  shortDescription: string;
  thesisMd: string;
  foundedYear?: number;
  website?: string;
}

export async function createCatalyst(
  input: CreateCatalystInput
): Promise<string> {
  const supabase = getServerClient();
  const { data, error } = await supabase
    .from("catalyst_companies")
    .insert({
      slug: input.slug,
      name: input.name,
      legal_name: input.legalName ?? null,
      country: input.country,
      is_public: input.isPublic,
      ticker: input.ticker ?? null,
      exchange: input.exchange ?? null,
      short_description: input.shortDescription,
      thesis_md: input.thesisMd,
      founded_year: input.foundedYear ?? null,
      website: input.website ?? null,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id;
}

export async function updateCatalyst(
  id: string,
  input: Partial<CreateCatalystInput>
): Promise<void> {
  const supabase = getServerClient();
  const updates: Record<string, unknown> = {};
  if (input.slug !== undefined) updates.slug = input.slug;
  if (input.name !== undefined) updates.name = input.name;
  if (input.legalName !== undefined) updates.legal_name = input.legalName;
  if (input.country !== undefined) updates.country = input.country;
  if (input.isPublic !== undefined) updates.is_public = input.isPublic;
  if (input.ticker !== undefined) updates.ticker = input.ticker;
  if (input.exchange !== undefined) updates.exchange = input.exchange;
  if (input.shortDescription !== undefined)
    updates.short_description = input.shortDescription;
  if (input.thesisMd !== undefined) updates.thesis_md = input.thesisMd;
  if (input.foundedYear !== undefined) updates.founded_year = input.foundedYear;
  if (input.website !== undefined) updates.website = input.website;

  const { error } = await supabase
    .from("catalyst_companies")
    .update(updates)
    .eq("id", id);

  if (error) throw error;
}

export async function setCatalystThemes(
  catalystId: string,
  themeIds: string[],
  primaryThemeId?: string
): Promise<void> {
  const supabase = getServerClient();

  const { error: deleteError } = await supabase
    .from("catalyst_themes")
    .delete()
    .eq("catalyst_id", catalystId);

  if (deleteError) throw deleteError;
  if (themeIds.length === 0) return;

  const rows = themeIds.map((themeId) => ({
    catalyst_id: catalystId,
    theme_id: themeId,
    is_primary: themeId === (primaryThemeId ?? themeIds[0]),
  }));

  const { error: insertError } = await supabase
    .from("catalyst_themes")
    .insert(rows);

  if (insertError) throw insertError;
}
