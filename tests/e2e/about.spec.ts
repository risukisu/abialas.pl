import { test, expect } from "@playwright/test";

test("/about renders narrative", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toContainText("About");
  await expect(page.locator(".about__narrative")).toBeVisible();
  // placeholder replaced with the real portrait 2026-07-22
  await expect(page.locator(".about__photo")).toBeVisible();
});

test("/about has Person JSON-LD", async ({ page }) => {
  await page.goto("/about");
  const ld = await page.locator("script[type='application/ld+json']").first().textContent();
  expect(ld).toContain("\"@type\":\"Person\"");
});

// TODO: When Task 13 (CV inline) lands, restore these tests:
//   - .cv visible, .cv__download href === "/resume.pdf"
//   - .cv-job__bullets a[href^='/writing/'] visible
