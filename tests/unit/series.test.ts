import { describe, it, expect } from "vitest";
import { series, seriesName } from "../../src/data/series";
import { topicHue } from "../../src/data/hues";

describe("series registry", () => {
  it("has unique tags", () => {
    const tags = series.map((s) => s.tag);
    expect(new Set(tags).size).toBe(tags.length);
  });
  it("resolves registered tags to display names", () => {
    expect(seriesName("ai")).toBe("AI at work");
  });
  it("returns undefined for parked/unknown/missing tags", () => {
    expect(seriesName("system")).toBeUndefined(); // parked, owner call 2026-08-17
    expect(seriesName("nope")).toBeUndefined();
    expect(seriesName(undefined)).toBeUndefined();
  });
  it("every series tag maps to a registry hue", () => {
    for (const s of series) expect(topicHue(s.tag)).toBeTruthy();
  });
});
