/**
 * Series registry — essays belong to a series via `topics[0]`.
 * Successor to products.ts's alley roster for the nexus direction:
 * /system and /ai stop being pages; these names live on as the chip
 * rail + card meta on /writing. Hues stay keyed by tag via topicHue().
 */
export type Series = {
  name: string; // display name on chips + card meta
  tag: string; // matches essay `topics[]`
};

export const series: Series[] = [
  // `system` parked (owner call 2026-08-17): the old system essays stay
  // seriesless until their fate is decided — re-add a row to revive.
  { name: "AI at work", tag: "ai" },
];

export function seriesName(tag?: string): string | undefined {
  return series.find((s) => s.tag === tag)?.name;
}
