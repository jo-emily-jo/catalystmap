import { z } from "zod";
import { sourceSchema } from "./source";

export const relationshipTypeValues = [
  "investment",
  "customer",
  "supplier",
  "partnership",
  "infrastructure",
  "thematic",
  "speculative",
] as const;

export const relationshipStrengthValues = [
  "direct",
  "indirect",
  "speculative",
] as const;

export const hypeRiskValues = ["low", "medium", "high"] as const;

export const relationshipSchema = z.object({
  catalystId: z.string().uuid(),
  relatedCompanyId: z.string().uuid(),
  relationshipType: z.enum(relationshipTypeValues, {
    message: "Invalid relationship type",
  }),
  relationshipStrength: z.enum(relationshipStrengthValues, {
    message: "Invalid relationship strength",
  }),
  summary: z.string().min(1, "Summary is required"),
  revenueExposurePct: z.number().min(0).max(100).optional().nullable(),
  lastVerifiedAt: z.string().min(1, "Last verified date is required"),
  hypeRisk: z.enum(hypeRiskValues, {
    message: "Invalid hype risk level",
  }),
  sources: z.array(sourceSchema).min(1, "At least one source is required"),
});

export const relationshipUpdateSchema = relationshipSchema.omit({
  catalystId: true,
  relatedCompanyId: true,
  sources: true,
});

export type RelationshipFormData = z.infer<typeof relationshipSchema>;
