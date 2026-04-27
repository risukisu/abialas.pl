import { test, expect } from "@playwright/test";

test("unknown route renders custom 404", async ({ page }) => {
  const response = await page.goto("/this-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Lost");
});
