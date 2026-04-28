import { z, defineCollection } from "astro:content";

const gradientTuple = z.tuple([z.string(), z.string()]);

export const writingSchema = z.object({
  title: z.string(),
  status: z.enum(["published", "draft"]),
  anatomy: z.enum(["outcome", "concept"]),
  order: z.number().int().positive(),
  featured: z.boolean().default(false),
  role: z.string().optional(),
  timeframe: z.string().optional(),
  scope: z.string().optional(),
  summary: z.string().optional(),
  hero: z
    .object({
      type: z.enum(["screenshot", "concept", "gradient"]),
      image: z.string().optional(),
      gradient: gradientTuple.default(["#1E4DD8", "#22D3EE"]),
    })
    .optional(),
  tileSize: z.enum(["hero", "wide", "square", "std", "tall"]),
  tileVariant: z.enum(["screenshot", "concept", "stat", "excerpt", "draft"]),
});

const writing = defineCollection({
  type: "content",
  schema: writingSchema,
});

const about = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    kind: z.enum(["narrative", "cv"]),
  }),
});

export const collections = { writing, about };
