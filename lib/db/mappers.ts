import type {
  Theme,
  CatalystCompany,
  RelatedCompany,
  Relationship,
  Source,
  ScoreBreakdown,
  RelationshipType,
  RelationshipStrength,
  HypeRisk,
  SourceType,
} from "@/lib/types";

// ── Row types (snake_case from Postgres) ──────────────────────────

interface ThemeRow {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon_name: string | null;
  display_order: number;
}

interface CatalystRow {
  id: string;
  slug: string;
  name: string;
  legal_name: string | null;
  country: string | null;
  is_public: boolean;
  ticker: string | null;
  exchange: string | null;
  short_description: string;
  thesis_md: string;
  founded_year: number | null;
  website: string | null;
  logo_url: string | null;
  is_active: boolean;
}

interface RelatedCompanyRow {
  id: string;
  ticker: string;
  exchange: string;
  name: string;
  country: string | null;
  sector: string | null;
  industry: string | null;
  market_cap_usd: number | null;
  short_description: string | null;
  website: string | null;
  logo_url: string | null;
}

interface RelationshipRow {
  id: string;
  catalyst_id: string;
  related_company_id: string;
  relationship_type: string;
  relationship_strength: string;
  summary: string;
  revenue_exposure_pct: number | null;
  first_observed_at: string | null;
  last_verified_at: string;
  is_active: boolean;
  relevance_score: number | null;
  score_version: number | null;
  hype_risk: string;
  score_breakdown: Record<string, number> | null;
  ai_assisted: boolean;
  related_companies: RelatedCompanyRow;
  sources: SourceRow[];
}

interface SourceRow {
  id: string;
  url: string;
  title: string | null;
  source_type: string;
  source_quality: number;
  published_at: string | null;
  accessed_at: string;
  excerpt: string | null;
}

// ── Mappers ───────────────────────────────────────────────────────

export function mapTheme(row: ThemeRow): Theme {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description ?? undefined,
    displayOrder: row.display_order,
  };
}

export function mapCatalyst(
  row: CatalystRow,
  themes: Theme[]
): CatalystCompany {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    legalName: row.legal_name ?? undefined,
    country: row.country ?? "US",
    isPublic: row.is_public,
    ticker: row.ticker,
    exchange: row.exchange,
    shortDescription: row.short_description,
    thesisMd: row.thesis_md,
    foundedYear: row.founded_year ?? undefined,
    website: row.website ?? undefined,
    logoUrl: row.logo_url ?? undefined,
    themes,
    isActive: row.is_active,
  };
}

export function mapRelatedCompany(row: RelatedCompanyRow): RelatedCompany {
  return {
    id: row.id,
    ticker: row.ticker,
    exchange: row.exchange,
    name: row.name,
    country: row.country ?? undefined,
    sector: row.sector ?? undefined,
    industry: row.industry ?? undefined,
    marketCapUsd: row.market_cap_usd,
    shortDescription: row.short_description ?? undefined,
    website: row.website ?? undefined,
    logoUrl: row.logo_url ?? undefined,
  };
}

export function mapSource(row: SourceRow): Source {
  return {
    id: row.id,
    url: row.url,
    title: row.title ?? undefined,
    sourceType: row.source_type as SourceType,
    sourceQuality: row.source_quality,
    publishedAt: row.published_at,
    accessedAt: row.accessed_at,
    excerpt: row.excerpt ?? undefined,
  };
}

export function mapRelationship(row: RelationshipRow): Relationship {
  const breakdown = row.score_breakdown as ScoreBreakdown | null;
  return {
    id: row.id,
    catalystId: row.catalyst_id,
    relatedCompany: mapRelatedCompany(row.related_companies),
    relationshipType: row.relationship_type as RelationshipType,
    relationshipStrength: row.relationship_strength as RelationshipStrength,
    summary: row.summary,
    revenueExposurePct: row.revenue_exposure_pct,
    firstObservedAt: row.first_observed_at,
    lastVerifiedAt: row.last_verified_at,
    relevanceScore: row.relevance_score ?? 0,
    scoreVersion: row.score_version ?? 1,
    scoreBreakdown: breakdown ?? null,
    hypeRisk: row.hype_risk as HypeRisk,
    sources: (row.sources ?? []).map(mapSource),
    isActive: row.is_active,
    aiAssisted: row.ai_assisted ?? false,
  };
}
