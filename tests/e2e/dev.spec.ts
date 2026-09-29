import { test, expect } from "@playwright/test";

// /dev/ is shared by direct link only: every page noindexed, none in the
// sitemap, none linked from the home page.

test("/dev lists the shared pages and is noindexed", async ({ page }) => {
  await page.goto("/dev/");
  await expect(page.locator("h1")).toHaveText("Work in progress");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  await expect(page.locator("main a[href='/dev/skills-tile/']")).toBeVisible();
  await expect(page.locator("main a[href='/dev/foil-cards/']")).toBeVisible();
});

test("/dev/foil-cards shows the pixel quest foil, noindexed", async ({ page }) => {
  await page.goto("/dev/foil-cards/");
  await expect(page.locator("h1")).toHaveText("Foil cards");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  await expect(page.locator("#pixel-quest [data-foil-card]")).toBeVisible();
  const art = await page.request.get("/dev/foil-cards/pixel-quest-squirrel.svg");
  expect(art.status()).toBe(200);
});

test("/dev/skills-tile shows both options, noindexed", async ({ page }) => {
  await page.goto("/dev/skills-tile/");
  await expect(page.locator("h1")).toHaveText("The work, or the keyboard?");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  await expect(page.locator("svg.art[data-art='work']")).toBeVisible();
  await expect(page.locator("svg.art[data-art='keys']")).toBeVisible();
  await expect(page.locator("a[data-msk-chart] svg.msk__cst")).toBeVisible(); // the star chart, archived
});

test("/dev/skills-tile offers the three LinkedIn GIFs", async ({ page }) => {
  await page.goto("/dev/skills-tile/#assets");
  const gifs = page.locator("#assets .dv-asset img");
  await expect(gifs).toHaveCount(3);
  for (const slug of ["keys", "work", "type"]) {
    for (const ext of ["gif", "png"]) {
      const res = await page.request.get(`/dev/skills-tile/linkedin-${slug}.${ext}`);
      expect(res.status()).toBe(200);
    }
  }
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
