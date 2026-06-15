import { test, expect } from "@playwright/test";

// The storefront homepage is rebuilt in Wave B; this test is rewritten there.
test.skip("homepage renders hero, ribbon, featured, footer mailto", async ({ page }) => {
  await page.goto("/");
});

test("homepage nav links work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});
