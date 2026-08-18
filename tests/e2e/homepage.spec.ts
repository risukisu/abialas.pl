import { test, expect } from "@playwright/test";

test("nexus home: masthead, follow row, building section, more row, footer mailto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("a[href='https://grugbrained.substack.com']").first()).toBeVisible();
  await expect(page.locator(".graph").first()).toBeVisible();
  await expect(page.locator("a[href='https://skillcraft.cloud']").first()).toBeVisible();
  await expect(page.locator("a[href='/work']").first()).toBeVisible();
  await expect(page.locator("a[href^='mailto:']").first()).toBeVisible();
});

test("home nav → work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});
