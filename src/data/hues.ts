/**
 * Hue registry — single source of truth for the color system
 * (spec: docs/superpowers/specs/2026-07-05-drafting-table-color-system.md).
 * `raw` = decorative marks, washes, underline bars.
 * `text` = anything read: tinted labels, link hovers, fills under paper text.
 * global.css mirrors these as tokens; tests/unit/hues.test.ts enforces the
 * mirror and WCAG AA. Add a room = add one entry here + tokens + [data-room]
 * block in global.css (the test fails until all three exist).
 */
export type HueKey = "system" | "ai" | "work" | "writing" | "about";

export const HUES: Record<HueKey, { raw: string; text: string }> = {
  system:  { raw: "#DE3C26", text: "#C22D18" },
  ai:      { raw: "#2257D6", text: "#2257D6" },
  work:    { raw: "#A5700C", text: "#8A5D0B" },
  writing: { raw: "#2E7D4F", text: "#297147" },
  about:   { raw: "#7A4A9E", text: "#7A4A9E" },
};

export const SURFACES = { mist: "#E9EDF2", ink: "#15324E", paper: "#EAF0F6" };
export const LINK_ON_INK = "#E8A13C";

/** Essay topic → hue. Product tags map to their room; everything else reads as writing. */
export function topicHue(topic?: string): HueKey {
  if (topic === "system" || topic === "ai") return topic;
  return "writing";
}
