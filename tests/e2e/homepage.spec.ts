import { test, expect } from "@playwright/test";

test("homepage renders hero, ribbon, featured, contact", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".ribbon")).toBeVisible();
  await expect(page.locator(".featured")).toBeVisible();
  await expect(page.locator("a[href^='mailto:']").first()).toBeVisible();
});

test("homepage nav links work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});
