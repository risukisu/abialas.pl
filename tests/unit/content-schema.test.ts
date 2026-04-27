import { describe, it, expect } from "vitest";
import { z } from "astro/zod";

// Import the schema we're about to write. Will fail until Step 4.3.
import { workSchema } from "../../src/content/config";

describe("work content schema", () => {
  it("accepts a fully-specified published piece", () => {
    const valid = {
      title: "Marketing Operating System",
      status: "published",
      anatomy: "outcome",
      order: 1,
      featured: true,
      role: "Marketing Director",
      timeframe: "2022–2025",
      scope: "Rebuilt team 4 → 12, doubled MQL volume",
      summary: "A system for running marketing as engineering.",
      hero: {
        type: "screenshot",
        image: "/images/work/marketing-os-hero.png",
        gradient: ["#1E4DD8", "#22D3EE"],
      },
      tileSize: "hero",
      tileVariant: "screenshot",
    };
    expect(() => workSchema.parse(valid)).not.toThrow();
  });

  it("accepts a minimal draft piece", () => {
    const valid = {
      title: "SCRUM in Marketing",
      status: "draft",
      anatomy: "concept",
      order: 9,
      tileSize: "std",
      tileVariant: "draft",
    };
    expect(() => workSchema.parse(valid)).not.toThrow();
  });

  it("rejects invalid status", () => {
    const invalid = {
      title: "Bad",
      status: "wip",
      anatomy: "concept",
      order: 1,
      tileSize: "std",
      tileVariant: "draft",
    };
    expect(() => workSchema.parse(invalid)).toThrow();
  });

  it("rejects invalid tileSize", () => {
    const invalid = {
      title: "Bad",
      status: "draft",
      anatomy: "concept",
      order: 1,
      tileSize: "gigantic",
      tileVariant: "draft",
    };
    expect(() => workSchema.parse(invalid)).toThrow();
  });
});
