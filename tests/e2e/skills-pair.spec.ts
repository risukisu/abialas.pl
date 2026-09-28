import { test, expect } from "@playwright/test";

// The skills pair: marketing-skills | claude-code-statusline at 1.9 : 1.1 (owner, 2026-09-28).
// The statusline art is a 52-column render sized for the side slot, so it shows near its own
// size instead of squeezed (the half-width and stacked versions before it came out too tall).
const SL = ".msk-row a[href='https://github.com/risukisu/claude-code-statusline']";

test.describe("skills pair on desktop", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("marketing-skills leads at 1.9 : 1.1, both one height", async ({ page }) => {
    await page.goto("/");
    const msk = await page.locator(".msk-row > .msk").boundingBox();
    const sl = await page.locator(SL).boundingBox();
    expect(msk && sl).toBeTruthy();
    expect(msk!.width / (msk!.width + sl!.width)).toBeCloseTo(1.9 / 3, 2);
    expect(Math.abs(msk!.y - sl!.y)).toBeLessThanOrEqual(1);
    expect(Math.abs(msk!.height - sl!.height)).toBeLessThanOrEqual(1);
    expect(msk!.height).toBeLessThanOrEqual(230);
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

  test("the statusline art is the narrow strip, near its own size, under a one-line head", async ({ page }) => {
    await page.goto("/");
    const art = page.locator(`${SL} img.sl__art`);
    await art.scrollIntoViewIfNeeded();
    const loaded = await art.evaluate(async (img: HTMLImageElement) => {
      if (!img.complete) await new Promise((r) => img.addEventListener("load", r, { once: true }));
      return { src: new URL(img.currentSrc).pathname, ok: img.naturalWidth > 0, scale: img.getBoundingClientRect().width / img.naturalWidth };
    });
    expect(loaded.src).toBe("/tiles/statusline-narrow.svg");
    expect(loaded.ok).toBe(true);
    expect(loaded.scale).toBeGreaterThanOrEqual(0.9);
    const head = await page.locator(`${SL} .sl__head`).boundingBox();
    expect(head!.height).toBeLessThanOrEqual(34); // the wordmark doesn't wrap
  });
});
