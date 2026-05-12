import type {
  CatalystCompany,
  Relationship,
  Theme,
  RelatedCompany,
  Source,
  RelationshipType,
  RelationshipStrength,
  HypeRisk,
  SourceType,
} from "@/lib/types";

import exampleSeed from "@/data/seed/example-catalyst.json";

// ── JSON shape (matches seed file structure) ──────────────────────

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

// ── Hydration ─────────────────────────────────────────────────────

function hydrateTheme(raw: SeedTheme): Theme {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description,
    displayOrder: raw.displayOrder,
  };
}

function hydrateRelatedCompany(raw: SeedRelatedCompany): RelatedCompany {
  return {
    id: raw.id,
    ticker: raw.ticker,
    exchange: raw.exchange,
    name: raw.name,
    country: raw.country,
    sector: raw.sector,
    industry: raw.industry,
    marketCapUsd: raw.marketCapUsd ?? null,
    shortDescription: raw.shortDescription,
    website: raw.website,
    logoUrl: raw.logoUrl,
  };
}

function hydrateSource(raw: SeedSource): Source {
  return {
    id: raw.id,
    url: raw.url,
    title: raw.title,
    sourceType: raw.sourceType as SourceType,
    sourceQuality: raw.sourceQuality,
    publishedAt: raw.publishedAt ?? null,
    accessedAt: raw.accessedAt,
    excerpt: raw.excerpt,
  };
}

function hydrateRelationship(
  raw: SeedRelationship,
  catalystId: string
): Relationship {
  return {
    id: raw.id,
    catalystId,
    relatedCompany: hydrateRelatedCompany(raw.relatedCompany),
    relationshipType: raw.relationshipType as RelationshipType,
    relationshipStrength: raw.relationshipStrength as RelationshipStrength,
    summary: raw.summary,
    revenueExposurePct: raw.revenueExposurePct ?? null,
    firstObservedAt: null,
    lastVerifiedAt: raw.lastVerifiedAt,
    relevanceScore: raw.relevanceScore,
    scoreVersion: 2,
    hypeRisk: raw.hypeRisk as HypeRisk,
    contractValueUsd: null,
    isGovernmentProcurement: false,
    sources: raw.sources.map(hydrateSource),
    isActive: true,
    aiAssisted: false,
  };
}

function hydrateSeed(seed: SeedFile): {
  catalyst: CatalystCompany;
  relationships: Relationship[];
} {
  const themes = seed.themes.map(hydrateTheme);
  const catalyst: CatalystCompany = {
    id: seed.catalyst.id,
    slug: seed.catalyst.slug,
    name: seed.catalyst.name,
    legalName: seed.catalyst.legalName,
    country: seed.catalyst.country,
    isPublic: seed.catalyst.isPublic,
    ticker: seed.catalyst.ticker ?? null,
    exchange: seed.catalyst.exchange ?? null,
    shortDescription: seed.catalyst.shortDescription,
    thesisMd: seed.catalyst.thesisMd,
    foundedYear: seed.catalyst.foundedYear,
    website: seed.catalyst.website,
    logoUrl: seed.catalyst.logoUrl,
    themes,
    isActive: seed.catalyst.isActive,
  };

  const relationships = seed.relationships.map((r) =>
    hydrateRelationship(r, catalyst.id)
  );

  return { catalyst, relationships };
}

// ── In-memory store ───────────────────────────────────────────────

const seeds: SeedFile[] = [exampleSeed as SeedFile];

const catalystMap = new Map<string, CatalystCompany>();
const relationshipMap = new Map<string, Relationship[]>();

for (const seed of seeds) {
  const { catalyst, relationships } = hydrateSeed(seed);
  catalystMap.set(catalyst.slug, catalyst);
  relationshipMap.set(catalyst.id, relationships);
}

// ── Public query functions ────────────────────────────────────────

export function getCatalystBySlug(slug: string): CatalystCompany | undefined {
  return catalystMap.get(slug);
}

export function getRelationshipsByCatalyst(catalystId: string): Relationship[] {
  return relationshipMap.get(catalystId) ?? [];
}

export function getAllCatalysts(): CatalystCompany[] {
  return Array.from(catalystMap.values());
}
