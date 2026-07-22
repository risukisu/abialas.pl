import { test, expect } from "@playwright/test";

test("storefront renders hero, plates, elsewhere row, footer mailto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  // hero CTAs removed 2026-07-21 — the display plates are the primary paths
  await expect(page.locator(".display .card").first()).toBeVisible();
  await expect(page.locator("a[href='/system']").first()).toBeVisible();
  await expect(page.locator(".elsewhere .mini").first()).toBeVisible();
  await expect(page.locator("a[href^='mailto:']").first()).toBeVisible();
});

test("home nav → work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});
