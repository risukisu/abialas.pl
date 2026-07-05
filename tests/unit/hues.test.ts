import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { HUES, SURFACES, LINK_ON_INK, topicHue } from "../../src/data/hues";

function lum(hex: string): number {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function ratio(a: string, b: string): number {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const css = readFileSync("src/styles/global.css", "utf8");

describe("hue registry ↔ CSS tokens", () => {
  it("every hue is mirrored in global.css @theme", () => {
    for (const [key, h] of Object.entries(HUES)) {
      expect(css, `--hue-${key}`).toContain(`--hue-${key}: ${h.raw}`);
      expect(css, `--hue-${key}-text`).toContain(`--hue-${key}-text: ${h.text}`);
      expect(css, `[data-room="${key}"]`).toContain(`[data-room="${key}"]`);
    }
    expect(css).toContain(`--link-on-ink: ${LINK_ON_INK}`);
    expect(css).toContain("--gradient-spectrum:");
  });
});

describe("WCAG AA contrast (hard gate)", () => {
  it("text variants pass 4.5:1 on mist", () => {
    for (const [key, h] of Object.entries(HUES)) {
      const r = ratio(h.text, SURFACES.mist);
      expect(r, `${key}-text on mist = ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("paper text passes 4.5:1 on text-variant fills (card bars)", () => {
    for (const [key, h] of Object.entries(HUES)) {
      const r = ratio(SURFACES.paper, h.text);
      expect(r, `paper on ${key}-text bar = ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });
  it("ochre link passes 4.5:1 on ink", () => {
    expect(ratio(LINK_ON_INK, SURFACES.ink)).toBeGreaterThanOrEqual(4.5);
  });
  it("raw hues pass 3:1 on mist (non-text marks)", () => {
    for (const [key, h] of Object.entries(HUES)) {
      const r = ratio(h.raw, SURFACES.mist);
      expect(r, `${key} raw on mist = ${r.toFixed(2)}`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("topicHue", () => {
  it("maps product tags and falls back to writing", () => {
    expect(topicHue("system")).toBe("system");
    expect(topicHue("ai")).toBe("ai");
    expect(topicHue("anything-else")).toBe("writing");
    expect(topicHue(undefined)).toBe("writing");
  });
});
