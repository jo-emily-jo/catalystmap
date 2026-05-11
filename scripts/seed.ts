import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// ── Setup ─────────────────────────────────────────────────────────

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

// ── Types for seed JSON ───────────────────────────────────────────

interface SeedSource {
  id: string;
  url: string;
  title?: string;
  sourceType: string;
  sourceQuality: number;
  publishedAt?: string | null;
  accessedAt: string;
  excerpt?: string;
}

interface SeedRelatedCompany {
  id: string;
  ticker: string;
  exchange: string;
  name: string;
  country?: string;
  sector?: string;
  industry?: string;
  marketCapUsd?: number | null;
  shortDescription?: string;
  website?: string;
  logoUrl?: string;
}

interface SeedRelationship {
  id: string;
  relatedCompany: SeedRelatedCompany;
  relationshipType: string;
  relationshipStrength: string;
  summary: string;
  revenueExposurePct?: number | null;
  lastVerifiedAt: string;
  relevanceScore: number;
  hypeRisk: string;
  sources: SeedSource[];
}

interface SeedTheme {
  id: string;
  slug: string;
  name: string;
  description?: string;
  displayOrder: number;
}

interface SeedCatalyst {
  id: string;
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
  logoUrl?: string;
  isActive: boolean;
}

interface SeedFile {
  catalyst: SeedCatalyst;
  themes: SeedTheme[];
  relationships: SeedRelationship[];
}

// ── Counters ──────────────────────────────────────────────────────

const counts: Record<string, { inserted: number; updated: number }> = {};

function track(table: string, wasInsert: boolean) {
  if (!counts[table]) counts[table] = { inserted: 0, updated: 0 };
  if (wasInsert) counts[table].inserted++;
  else counts[table].updated++;
}

// ── Upsert helpers ────────────────────────────────────────────────

async function upsertTheme(theme: SeedTheme): Promise<string> {
  const { data, error } = await supabase
    .from("themes")
    .upsert(
      {
        slug: theme.slug,
        name: theme.name,
        description: theme.description ?? null,
        display_order: theme.displayOrder,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (error)
    throw new Error(`Theme upsert failed (${theme.slug}): ${error.message}`);
  track("themes", true);
  return data.id;
}

async function upsertCatalyst(catalyst: SeedCatalyst): Promise<string> {
  const { data, error } = await supabase
    .from("catalyst_companies")
    .upsert(
      {
        slug: catalyst.slug,
        name: catalyst.name,
        legal_name: catalyst.legalName ?? null,
        country: catalyst.country,
        is_public: catalyst.isPublic,
        ticker: catalyst.ticker ?? null,
        exchange: catalyst.exchange ?? null,
        short_description: catalyst.shortDescription,
        thesis_md: catalyst.thesisMd,
        founded_year: catalyst.foundedYear ?? null,
        website: catalyst.website ?? null,
        logo_url: catalyst.logoUrl ?? null,
        is_active: catalyst.isActive,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (error)
    throw new Error(
      `Catalyst upsert failed (${catalyst.slug}): ${error.message}`
    );
  track("catalyst_companies", true);
  return data.id;
}

async function upsertCatalystTheme(
  catalystId: string,
  themeId: string,
  isPrimary: boolean
): Promise<void> {
  const { error } = await supabase.from("catalyst_themes").upsert(
    {
      catalyst_id: catalystId,
      theme_id: themeId,
      is_primary: isPrimary,
    },
    { onConflict: "catalyst_id,theme_id" }
  );

  if (error) throw new Error(`catalyst_themes upsert failed: ${error.message}`);
  track("catalyst_themes", true);
}

async function upsertRelatedCompany(rc: SeedRelatedCompany): Promise<string> {
  const { data, error } = await supabase
    .from("related_companies")
    .upsert(
      {
        ticker: rc.ticker,
        exchange: rc.exchange,
        name: rc.name,
        country: rc.country ?? null,
        sector: rc.sector ?? null,
        industry: rc.industry ?? null,
        market_cap_usd: rc.marketCapUsd ?? null,
        short_description: rc.shortDescription ?? null,
        website: rc.website ?? null,
        logo_url: rc.logoUrl ?? null,
      },
      { onConflict: "ticker,exchange" }
    )
    .select("id")
    .single();

  if (error)
    throw new Error(
      `Related company upsert failed (${rc.ticker}:${rc.exchange}): ${error.message}`
    );
  track("related_companies", true);
  return data.id;
}

async function upsertRelationship(
  catalystId: string,
  relatedCompanyId: string,
  rel: SeedRelationship
): Promise<string> {
  const { data, error } = await supabase
    .from("relationships")
    .upsert(
      {
        catalyst_id: catalystId,
        related_company_id: relatedCompanyId,
        relationship_type: rel.relationshipType,
        relationship_strength: rel.relationshipStrength,
        summary: rel.summary,
        revenue_exposure_pct: rel.revenueExposurePct ?? null,
        last_verified_at: rel.lastVerifiedAt,
        relevance_score: rel.relevanceScore,
        score_version: 1,
        hype_risk: rel.hypeRisk,
        is_active: true,
      },
      { onConflict: "catalyst_id,related_company_id" }
    )
    .select("id")
    .single();

  if (error) throw new Error(`Relationship upsert failed: ${error.message}`);
  track("relationships", true);
  return data.id;
}

async function upsertSource(
  relationshipId: string,
  source: SeedSource
): Promise<void> {
  const { error } = await supabase.from("sources").upsert(
    {
      relationship_id: relationshipId,
      url: source.url,
      title: source.title ?? null,
      source_type: source.sourceType,
      source_quality: source.sourceQuality,
      published_at: source.publishedAt ?? null,
      accessed_at: source.accessedAt,
      excerpt: source.excerpt ?? null,
    },
    { onConflict: "id", ignoreDuplicates: true }
  );

  if (error) throw new Error(`Source upsert failed: ${error.message}`);
  track("sources", true);
}

// ── Main ──────────────────────────────────────────────────────────

async function seedFile(filePath: string): Promise<void> {
  const raw = fs.readFileSync(filePath, "utf-8");
  const seed: SeedFile = JSON.parse(raw);

  console.log(`  Seeding: ${seed.catalyst.name} (${seed.catalyst.slug})`);

  // 1. Themes
  const themeIdMap = new Map<string, string>();
  for (const theme of seed.themes) {
    const id = await upsertTheme(theme);
    themeIdMap.set(theme.slug, id);
  }

  // 2. Catalyst
  const catalystId = await upsertCatalyst(seed.catalyst);

  // 3. Catalyst ↔ Theme junctions
  for (let i = 0; i < seed.themes.length; i++) {
    const theme = seed.themes[i];
    const themeId = themeIdMap.get(theme.slug)!;
    await upsertCatalystTheme(catalystId, themeId, i === 0);
  }

  // 4. Relationships
  for (const rel of seed.relationships) {
    const relatedCompanyId = await upsertRelatedCompany(rel.relatedCompany);
    const relationshipId = await upsertRelationship(
      catalystId,
      relatedCompanyId,
      rel
    );

    // 5. Sources
    for (const source of rel.sources) {
      await upsertSource(relationshipId, source);
    }
  }
}

async function seedThemes(seedDir: string): Promise<void> {
  const themesPath = path.join(seedDir, "themes.json");
  if (!fs.existsSync(themesPath)) return;

  console.log("  Seeding themes from themes.json");
  const raw = fs.readFileSync(themesPath, "utf-8");
  const themes: SeedTheme[] = JSON.parse(raw);

  for (const theme of themes) {
    await upsertTheme(theme);
  }
}

async function main() {
  console.log("Starting seed...\n");

  const seedDir = path.resolve(__dirname, "../data/seed");

  // 1. Seed all themes first (from themes.json)
  await seedThemes(seedDir);

  // 2. Seed catalyst files (skip non-catalyst JSON files)
  const files = fs
    .readdirSync(seedDir)
    .filter(
      (f) => f.endsWith(".json") && f !== "themes.json" && f !== "README.md"
    )
    .map((f) => path.join(seedDir, f));

  for (const file of files) {
    await seedFile(file);
  }

  console.log("\nSeed complete. Summary:");
  for (const [table, { inserted, updated }] of Object.entries(counts)) {
    console.log(`  ${table}: ${inserted} inserted, ${updated} updated`);
  }
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
