import { test, expect } from "@playwright/test";

// The skills pair (owner, 2026-09-28): marketing-skills | claude-code-statusline, two equal
// tiles; the marketing-skills keyboard keeps its size while its text wraps around it.
test.describe("skills pair on desktop", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("the two tiles are the same size", async ({ page }) => {
    await page.goto("/");
    const msk = await page.locator(".msk-row > .msk").boundingBox();
    const sl = await page.locator(".msk-row > .sl").boundingBox();
    expect(msk && sl).toBeTruthy();
    expect(Math.abs(msk!.width - sl!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(msk!.height - sl!.height)).toBeLessThanOrEqual(1);
  });

  test("the keyboard keeps its size (225px at 1440, as before the pair was evened out)", async ({ page }) => {
    await page.goto("/");
    const kb = await page.locator(".msk__cst").boundingBox();
    expect(kb!.width).toBeGreaterThanOrEqual(220);
  });

  test("no readout line is cut off with an ellipsis", async ({ page }) => {
    await page.goto("/");
    const clipped = await page.locator(".msk__cycle--say .msk__line").evaluateAll((els) =>
      els.filter((e) => e.scrollWidth > e.clientWidth + 1).length,
    );
    expect(clipped).toBe(0);
  });
});
