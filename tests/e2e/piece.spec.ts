import { test, expect } from "@playwright/test";

test("/work/marketing-operating-system renders outcome variant", async ({ page }) => {
  await page.goto("/work/marketing-operating-system");
  await expect(page.locator("h1")).toContainText("Marketing Operating System");
  await expect(page.locator(".piece-meta")).toBeVisible();
});

test("draft piece returns 404", async ({ page }) => {
  const response = await page.goto("/work/scrum-in-marketing");
  expect(response?.status()).toBe(404);
});

test("piece page has JSON-LD CreativeWork", async ({ page }) => {
  await page.goto("/work/marketing-operating-system");
  const ld = await page.locator("script[type='application/ld+json']").first().textContent();
  expect(ld).toContain("\"@type\":\"CreativeWork\"");
  expect(ld).toContain("Marketing Operating System");
});
