import { z } from "zod";

export const relatedCompanySchema = z.object({
  ticker: z.string().min(1, "Ticker is required").max(10),
  exchange: z.string().min(1, "Exchange is required"),
  name: z.string().min(1, "Name is required"),
  country: z.string().min(2).max(2).optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  shortDescription: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
});

export type RelatedCompanyFormData = z.infer<typeof relatedCompanySchema>;
