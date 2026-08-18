import { test, expect } from "@playwright/test";

test("nexus home: masthead, follow row, building section, more row, footer mailto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator(".follow-row a[href='https://grugbrained.substack.com']")).toBeVisible();
  await expect(page.locator(".graph").first()).toBeVisible();
  await expect(page.locator(".build-row a[href='https://skillcraft.cloud']")).toBeVisible();
  await expect(page.locator(".nexus-grid a[href='/work']")).toBeVisible();
  await expect(page.locator("a[href^='mailto:']").first()).toBeVisible();
});

test("home nav → work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});

test("no links to the dead concept pages remain", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href='/system']")).toHaveCount(0);
  await expect(page.locator("a[href='/ai']")).toHaveCount(0);
});
