// Stub for astro:content virtual module — used by Vitest only.
// Provides just enough of the API for schema unit tests to run outside
// the Astro build pipeline.
export { z } from "astro/zod";

export function defineCollection(config: unknown) {
  return config;
}
