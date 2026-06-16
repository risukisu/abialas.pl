import { test, expect } from "@playwright/test";

test("/writing/how-i-run-marketing renders outcome variant", async ({ page }) => {
  await page.goto("/writing/how-i-run-marketing");
  await expect(page.locator("h1")).toContainText("How I run marketing");
  await expect(page.locator(".piece-meta")).toBeVisible();
});

test("draft piece returns 404", async ({ page }) => {
  const response = await page.goto("/writing/scrum-in-marketing");
  expect(response?.status()).toBe(404);
});

test("piece page has JSON-LD CreativeWork", async ({ page }) => {
  await page.goto("/writing/how-i-run-marketing");
  const ld = await page.locator("script[type='application/ld+json']").first().textContent();
  expect(ld).toContain("\"@type\":\"CreativeWork\"");
  expect(ld).toContain("How I run marketing");
});
