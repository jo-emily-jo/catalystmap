import { getPublicClient } from "./client";
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

  const catalysts = await Promise.all(
    (data ?? []).map(async (row) => {
      const themes = await hydrateCatalystThemes(row.id);
      return mapCatalyst(row, themes);
    })
  );

  return catalysts;
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

  const catalysts = await Promise.all(
    (data ?? []).map(async (row) => {
      const themes = await hydrateCatalystThemes(row.id);
      return mapCatalyst(row, themes);
    })
  );

  return catalysts;
}
