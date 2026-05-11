import { z } from "zod";

export const catalystSchema = z
  .object({
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9-]+$/,
        "Slug must be URL-safe (lowercase, hyphens, numbers)"
      ),
    name: z.string().min(1, "Name is required"),
    legalName: z.string().optional(),
    country: z.string().min(2).max(2, "Use ISO 3166-1 alpha-2 code"),
    isPublic: z.boolean(),
    ticker: z.string().optional(),
    exchange: z.string().optional(),
    shortDescription: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be under 500 characters"),
    thesisMd: z.string().min(1, "Thesis is required"),
    foundedYear: z.number().int().min(1800).max(2030).optional(),
    website: z.string().url().optional().or(z.literal("")),
  })
  .refine((data) => !data.isPublic || (data.ticker && data.exchange), {
    message: "Public companies require ticker and exchange",
    path: ["ticker"],
  });

export type CatalystFormData = z.infer<typeof catalystSchema>;
