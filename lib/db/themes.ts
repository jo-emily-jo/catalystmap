import { getPublicClient } from "./client";
import { mapTheme } from "./mappers";
import type { Theme } from "@/lib/types";

export async function listThemes(): Promise<Theme[]> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapTheme);
}

export async function getThemeBySlug(slug: string): Promise<Theme | null> {
  const supabase = getPublicClient();
  const { data, error } = await supabase
    .from("themes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  if (!data) return null;
  return mapTheme(data);
}
