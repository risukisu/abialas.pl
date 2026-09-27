import { test, expect } from "@playwright/test";

test("footer Grug sticker leads to the emoji page", async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.abort());
  await page.goto("/");
  // With analytics on, answer the first-visit banner like a visitor would.
  const banner = page.locator("[data-cc-banner]");
  if (await banner.isVisible()) await banner.getByRole("button", { name: "Decline" }).click();
  const grug = page.locator("footer a.footer__grug[href='/grug/']");
  await expect(grug).toBeVisible();
  await expect(page.locator("footer")).not.toContainText("No cookies");
  await grug.click();
  await expect(page).toHaveURL(/\/grug\/$/);
});

test("/grug/ is the emoji kit, emojis only", async ({ page }) => {
  await page.goto("/grug/");
  // The kit renders into an open shadow root; locators pierce it.
  await expect(page.locator("#v3-title")).toContainText("Small brain.");
  await expect(page.locator("#sheets .sheet")).toHaveCount(6);
  await expect(page.locator("#lid .sticker")).toHaveCount(6);
  await expect(page.locator("#v3-slack")).toBeVisible();
  // The brand kit is cut: no logos, colors, type, rules, or brand download.
  for (const id of ["#v3-brand", "#v3-colors", "#v3-type", "#v3-rules", "[data-pack='brand']"]) {
    await expect(page.locator(id)).toHaveCount(0);
  }
  await expect(page.locator("[data-pack='emoji']").first()).toBeVisible();
});
