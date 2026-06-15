import { z, defineCollection } from "astro:content";

export const writingSchema = z.object({
  title: z.string(),
  // Essays start as drafts; set "published" when ready. (workSchema defaults to "published" — case studies are added only once done.)
  status: z.enum(["published", "draft"]).default("draft"),
  anatomy: z.enum(["outcome", "concept"]),
  date: z.coerce.date(),
  topics: z.array(z.string()).default([]),
  order: z.number().int().positive(),
  featured: z.boolean().default(false),
  role: z.string().optional(),
  timeframe: z.string().optional(),
  scope: z.string().optional(),
  summary: z.string().optional(),
});

export const workSchema = z.object({
  title: z.string(),
  status: z.enum(["published", "draft"]).default("published"),
  order: z.number().int().positive(),
  featured: z.boolean().default(false),
  summary: z.string().optional(),
  problem: z.string().optional(),
  approach: z.string().optional(),
  result: z.string().optional(),
  client: z.string().optional(),
  date: z.coerce.date().optional(), // optional until finalized — guard in any date-dependent consumer
});

const writing = defineCollection({ type: "content", schema: writingSchema });
const work = defineCollection({ type: "content", schema: workSchema });
const about = defineCollection({
  type: "content",
  schema: z.object({ title: z.string(), kind: z.enum(["narrative", "cv"]) }),
});

export const collections = { writing, work, about };
