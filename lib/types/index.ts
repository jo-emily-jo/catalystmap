export type RelationshipType =
  | "investment"
  | "customer"
  | "supplier"
  | "partnership"
  | "infrastructure"
  | "thematic"
  | "speculative";

export type RelationshipStrength = "direct" | "indirect" | "speculative";

export type SourceType =
  | "sec_filing"
  | "earnings_call"
  | "official_announcement"
  | "reuters"
  | "bloomberg"
  | "ft"
  | "wsj"
  | "analyst_report"
  | "news_article"
  | "blog"
  | "community";

export type HypeRisk = "low" | "medium" | "high";

export interface Theme {
  id: string;
  slug: string;
  name: string;
  description?: string;
  iconName?: string;
  displayOrder: number;
}

export interface CatalystCompany {
  id: string;
  slug: string;
  name: string;
  legalName?: string;
  country: string;
  isPublic: boolean;
  ticker?: string | null;
  exchange?: string | null;
  shortDescription: string;
  thesisMd: string;
  foundedYear?: number;
  website?: string;
  logoUrl?: string;
  themes: Theme[];
  isActive: boolean;
}

export interface RelatedCompany {
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

export interface Source {
  id: string;
  url: string;
  title?: string;
  sourceType: SourceType;
  sourceQuality: number;
  publishedAt?: string | null;
  accessedAt: string;
  excerpt?: string;
}

export interface Relationship {
  id: string;
  catalystId: string;
  relatedCompany: RelatedCompany;
  relationshipType: RelationshipType;
  relationshipStrength: RelationshipStrength;
  summary: string;
  revenueExposurePct?: number | null;
  firstObservedAt?: string | null;
  lastVerifiedAt: string;
  relevanceScore: number;
  scoreVersion: number;
  hypeRisk: HypeRisk;
  sources: Source[];
  isActive: boolean;
}

export interface ScoreBreakdown {
  directScore: number;
  revenueExposureScore: number;
  sourceQualityScore: number;
  recencyScore: number;
  momentumScore: number;
  hypeRiskPenalty: number;
  subtotal: number;
  final: number;
  version: number;
}
