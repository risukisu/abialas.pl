import { describe, it, expect } from "vitest";
import { sortByOrder, publishedOnly, featuredPieces, byTopic, sortByDate, latest } from "../../src/lib/pieces";

type Piece = { data: { order: number; status: "published" | "draft"; featured?: boolean } };

const pieces: Piece[] = [
  { data: { order: 3, status: "draft" } },
  { data: { order: 1, status: "published", featured: true } },
  { data: { order: 2, status: "draft", featured: true } },
  { data: { order: 5, status: "published", featured: true } },
  { data: { order: 4, status: "published" } },
];

describe("pieces helpers", () => {
  it("sortByOrder sorts ascending by order", () => {
    const sorted = sortByOrder(pieces);
    expect(sorted.map((p) => p.data.order)).toEqual([1, 2, 3, 4, 5]);
  });

  it("publishedOnly filters to status=published", () => {
    const only = publishedOnly(pieces);
    expect(only.map((p) => p.data.order).sort()).toEqual([1, 4, 5]);
  });

  it("featuredPieces returns only published + featured, sorted", () => {
    const feat = featuredPieces(pieces);
    expect(feat.map((p) => p.data.order)).toEqual([1, 5]);
  });

  it("featuredPieces caps at limit", () => {
    const many: Piece[] = Array.from({ length: 5 }, (_, i) => ({
      data: { order: i + 1, status: "published", featured: true },
    }));
    expect(featuredPieces(many, 3).length).toBe(3);
  });
});

type DatedPiece = { data: { order: number; status: "published" | "draft"; featured?: boolean; date: Date; topics?: string[] } };

const dated: DatedPiece[] = [
  { data: { order: 1, status: "published", date: new Date("2024-01-01"), topics: ["system"] } },
  { data: { order: 2, status: "published", date: new Date("2025-01-01"), topics: ["ai"] } },
  { data: { order: 3, status: "draft",     date: new Date("2025-06-01"), topics: ["system"] } },
];

describe("pieces — topic + date", () => {
  it("byTopic filters published pieces carrying the tag", () => {
    expect(byTopic(dated, "system").map((p) => p.data.order)).toEqual([1]); // draft excluded
  });
  it("sortByDate orders newest first", () => {
    expect(sortByDate(dated).map((p) => p.data.order)).toEqual([3, 2, 1]);
  });
  it("latest returns N most-recent published", () => {
    expect(latest(dated, 1).map((p) => p.data.order)).toEqual([2]);
  });
});
