import { test, expect } from "@playwright/test";

test("storefront renders header CTA, products, footer mailto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".primary")).toBeVisible();
  await expect(page.locator("a[href='/system']").first()).toBeVisible();
  await expect(page.locator("a[href^='mailto:']").first()).toBeVisible();
});

test("home nav → work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});
