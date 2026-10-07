import { describe, it, expect } from "vitest";
import { splitSubject, byDay, readChangelog } from "../../src/lib/changelog";

describe("changelog", () => {
  it("splits an area prefix off the subject", () => {
    expect(splitSubject("css: real italics")).toEqual({ area: "css", text: "real italics" });
    expect(splitSubject("skills tile: new tagline")).toEqual({ area: "skills tile", text: "new tagline" });
    expect(splitSubject("feat(color): hue registry")).toEqual({ area: "feat(color)", text: "hue registry" });
  });

  it("keeps a subject without a prefix whole", () => {
    expect(splitSubject("Initial commit")).toEqual({ text: "Initial commit" });
  });

  it("groups by day, newest day first, order kept inside a day", () => {
    const c = (short: string, date: string) => ({ sha: short, short, date, text: short });
    const days = byDay([c("a", "2026-10-07"), c("b", "2026-10-07"), c("c", "2026-10-01")]);
    expect(days.map(([d]) => d)).toEqual(["2026-10-07", "2026-10-01"]);
    expect(days[0][1].map((x) => x.short)).toEqual(["a", "b"]);
  });

  it("reads this repo's history", () => {
    const log = readChangelog();
    expect(log.changes.length).toBeGreaterThan(0);
    expect(log.head?.short).toMatch(/^[0-9a-f]{7}$/);
    expect(log.changes[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
