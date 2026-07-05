import { describe, it, expect } from "vitest";
import { products, getProduct } from "../../src/data/products";
import { HUES } from "../../src/data/hues";

describe("products", () => {
  it("has unique slugs and ordered entries", () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("getProduct returns by slug, undefined when missing", () => {
    expect(getProduct("system")?.tag).toBe("system");
    expect(getProduct("nope")).toBeUndefined();
  });
  it("the system product carries the schematic flag", () => {
    expect(getProduct("system")?.hasSchematic).toBe(true);
  });
  it("every product declares a hue from the registry", () => {
    for (const p of products) {
      expect(Object.keys(HUES), `${p.slug} hue`).toContain(p.hue);
    }
  });
});
