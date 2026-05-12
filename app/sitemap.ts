import type { MetadataRoute } from "next";
import { getPublicClient } from "@/lib/db/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getPublicClient();
  const baseUrl = "https://getcatalystmap.com";

  const [{ data: themes }, { data: catalysts }] = await Promise.all([
    supabase.from("themes").select("slug"),
    supabase.from("catalyst_companies").select("slug").eq("is_active", true),
  ]);

  const entries: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/themes`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.5 },
  ];

  for (const theme of themes ?? []) {
    entries.push({
      url: `${baseUrl}/themes/${theme.slug}`,
      changeFrequency: "weekly",
      priority: 0.7,
    });
  }

  for (const catalyst of catalysts ?? []) {
    entries.push({
      url: `${baseUrl}/catalyst/${catalyst.slug}`,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  return entries;
}
