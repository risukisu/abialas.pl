import { test, expect, type Page } from "@playwright/test";

// The skills stack (owner, 2026-09-28): marketing-skills over claude-code-statusline, each the
// full row and short. Side by side they came out 564x296 each, too tall and cramped.
const boxes = async (page: Page) => {
  await page.goto("/");
  const row = await page.locator(".msk-row").boundingBox();
  const msk = await page.locator(".msk-row > .msk").boundingBox();
  const sl = await page.locator(".msk-row > .sl").boundingBox();
  expect(row && msk && sl).toBeTruthy();
  return { row: row!, msk: msk!, sl: sl! };
};

// the art is loading="lazy": bring it into view, then wait for it
const artLoaded = async (page: Page) => {
  const art = page.locator(".sl__art");
  await art.scrollIntoViewIfNeeded();
  return art.evaluate(async (img: HTMLImageElement) => {
    if (!img.complete) await new Promise((r) => img.addEventListener("load", r, { once: true }));
    return { src: new URL(img.currentSrc).pathname, ok: img.naturalWidth > 0 };
  });
};

test.describe("skills stack on desktop", () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test("the tiles stack, marketing-skills first, each the full row width", async ({ page }) => {
    const { row, msk, sl } = await boxes(page);
    expect(sl.y).toBeGreaterThanOrEqual(msk.y + msk.height);
    expect(Math.abs(msk.x - sl.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(msk.width - sl.width)).toBeLessThanOrEqual(1);
    expect(msk.width).toBeGreaterThanOrEqual(row.width - 8); // the row keeps 6px for the hover shadow
  });

  test("both stay short, at one shared height", async ({ page }) => {
    const { msk, sl } = await boxes(page);
    expect(msk.height).toBeLessThanOrEqual(230);
    expect(Math.abs(msk.height - sl.height)).toBeLessThanOrEqual(1);
  });

  test("the keyboard keeps at least the 225px it had in the side-by-side pair", async ({ page }) => {
    await page.goto("/");
    const kb = await page.locator(".msk__cst").boundingBox();
    expect(kb!.width).toBeGreaterThanOrEqual(225);
  });

  test("no readout line is cut off", async ({ page }) => {
    await page.goto("/");
    const clipped = await page.locator(".msk__cycle--say .msk__line").evaluateAll((els) =>
      els.filter((e) => e.scrollWidth > e.clientWidth + 1).length,
    );
    expect(clipped).toBe(0);
  });

  test("the statusline art is the 96-column strip, beside the text at no more than its own size", async ({ page }) => {
    await page.goto("/");
    expect(await artLoaded(page)).toEqual({ src: "/tiles/statusline-wide.svg", ok: true });
    const body = await page.locator(".sl__body").boundingBox();
    const art = await page.locator(".sl__art").boundingBox();
    expect(art!.x).toBeGreaterThan(body!.x + body!.width);
    expect(art!.width).toBeLessThanOrEqual(654);
  });
});

test.describe("skills stack on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("the statusline art falls back to the 72-column strip", async ({ page }) => {
    await page.goto("/");
    expect(await artLoaded(page)).toEqual({ src: "/tiles/statusline.svg", ok: true });
  });

  test("no readout line is cut off", async ({ page }) => {
    await page.goto("/");
    const clipped = await page.locator(".msk__cycle--say .msk__line").evaluateAll((els) =>
      els.filter((e) => e.scrollWidth > e.clientWidth + 1).length,
    );
    expect(clipped).toBe(0);
  });
});
