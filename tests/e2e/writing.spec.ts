import { test, expect } from "@playwright/test";

test("writing archive lists the published essay", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.locator("a[href='/writing/how-i-run-marketing']").first()
  ).toBeVisible();
});

test("writing archive has no bento grid", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.locator(".bento-grid, .bento, .bento-tile")).toHaveCount(0);
});
