import { z } from "zod";

export const sourceTypeValues = [
  "sec_filing",
  "earnings_call",
  "official_announcement",
  "reuters",
  "bloomberg",
  "ft",
  "wsj",
  "analyst_report",
  "news_article",
  "blog",
  "community",
] as const;

export const sourceSchema = z.object({
  url: z.string().url("Must be a valid URL"),
  title: z.string().optional(),
  sourceType: z.enum(sourceTypeValues, {
    message: "Invalid source type",
  }),
  accessedAt: z.string().min(1, "Accessed date is required"),
  publishedAt: z.string().optional().nullable(),
  excerpt: z.string().optional(),
});

export type SourceFormData = z.infer<typeof sourceSchema>;
