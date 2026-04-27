import { test, expect } from "@playwright/test";

test("/work renders bento grid with 10 piece tiles", async ({ page }) => {
  await page.goto("/work");
  const tiles = page.locator(".tile");
  await expect(tiles).toHaveCount(13);
});

test("draft tiles are not links", async ({ page }) => {
  await page.goto("/work");
  const draftTiles = page.locator(".tile--draft");
  await expect(draftTiles.first()).toBeVisible();
  const draftLinks = page.locator(".tile--draft a");
  await expect(draftLinks).toHaveCount(0);
});

test("published piece tile links to piece page", async ({ page }) => {
  await page.goto("/work");
  await page.click(".tile--hero .tile__link");
  await expect(page).toHaveURL(/\/work\/marketing-operating-system/);
});
