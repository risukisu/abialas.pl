import { test, expect } from "@playwright/test";

// /dev/ is shared by direct link only: every page noindexed, none in the
// sitemap, none linked from the home page.

test("/dev lists the shared pages and is noindexed", async ({ page }) => {
  await page.goto("/dev/");
  await expect(page.locator("h1")).toHaveText("Work in progress");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  await expect(page.locator("main a[href='/dev/skills-tile/']")).toBeVisible();
});

test("/dev/skills-tile shows both options, noindexed", async ({ page }) => {
  await page.goto("/dev/skills-tile/");
  await expect(page.locator("h1")).toHaveText("The work, or the keyboard?");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  await expect(page.locator("svg.art[data-art='work']")).toBeVisible();
  await expect(page.locator("svg.art[data-art='keys']")).toBeVisible();
});

test("no /dev page is in the sitemap or linked from home", async ({ page, request }) => {
  const index = await (await request.get("/sitemap-index.xml")).text();
  const maps = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  for (const path of maps) {
    const xml = await (await request.get(path)).text();
    expect(xml).not.toContain("/dev/");
  }
  await page.goto("/");
  await expect(page.locator("a[href^='/dev']")).toHaveCount(0);
});
