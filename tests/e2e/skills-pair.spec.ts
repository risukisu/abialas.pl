import { test, expect } from "@playwright/test";

// The skills pair: marketing-skills | its repo tile at 1.9 : 1.1 (owner, 2026-09-28; the
// statusline tiles tried in its slot the same day went back to the drawing board).
test.describe("skills pair on desktop", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("marketing-skills leads at 1.9 : 1.1", async ({ page }) => {
    await page.goto("/");
    const msk = await page.locator(".msk-row > .msk").boundingBox();
    const repo = await page.locator(".msk-row a[href='https://github.com/risukisu/marketing-skills']").boundingBox();
    expect(msk && repo).toBeTruthy();
    expect(msk!.width / (msk!.width + repo!.width)).toBeCloseTo(1.9 / 3, 2);
    expect(Math.abs(msk!.y - repo!.y)).toBeLessThanOrEqual(1);
  });

  test("the keyboard keeps its size", async ({ page }) => {
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
