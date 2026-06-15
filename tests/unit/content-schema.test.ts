import { describe, it, expect } from "vitest";
import { writingSchema, workSchema } from "../../src/content/config";

describe("writing schema", () => {
  it("accepts a published essay with date + topics", () => {
    const v = {
      title: "Marketing Operating System", status: "published", anatomy: "outcome",
      date: "2024-03-01", topics: ["system"], order: 1, featured: true,
      role: "Marketing Director", timeframe: "2022–2025", scope: "Doubled MQL volume",
      summary: "Run marketing as engineering.",
    };
    expect(() => writingSchema.parse(v)).not.toThrow();
    expect(writingSchema.parse(v).date).toBeInstanceOf(Date);
  });
  it("defaults topics to [] and accepts a minimal draft", () => {
    const v = { title: "ICP", status: "draft", anatomy: "concept", date: "2025-01-01", order: 9 };
    expect(writingSchema.parse(v).topics).toEqual([]);
  });
  it("rejects invalid status", () => {
    expect(() => writingSchema.parse({ title: "x", status: "wip", anatomy: "concept", date: "2025-01-01", order: 1 })).toThrow();
  });
});

describe("work (case study) schema", () => {
  it("accepts a case study", () => {
    const v = { title: "MOS", status: "published", order: 1, featured: true,
      summary: "x", problem: "p", approach: "a", result: "r" };
    expect(() => workSchema.parse(v)).not.toThrow();
  });
});
