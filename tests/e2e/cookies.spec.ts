import { test, expect } from "@playwright/test";

// The banner only renders once a GA4 ID is set (src/data/analytics.ts, or
// PUBLIC_GA_ID at build). Google is never contacted from tests.
test.beforeEach(async ({ page }) => {
  await page.route(/googletagmanager\.com|google-analytics\.com/, (r) => r.abort());
});

test("cookie consent: first-visit banner, choice sticks, panel shows status", async ({ page }) => {
  await page.goto("/");
  test.skip((await page.locator("[data-cc]").count()) === 0, "no GA4 ID set — analytics and banner are off");

  const banner = page.locator("[data-cc-banner]");
  await expect(banner).toBeVisible();
  await banner.getByRole("button", { name: "Accept" }).click();
  await expect(banner).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem("cookie-consent"))).toBe("accepted");

  // Consent Mode got the update.
  const granted = await page.evaluate(() =>
    (window as any).dataLayer.some((e: any) => e[0] === "consent" && e[1] === "update" && e[2]?.analytics_storage === "granted"),
  );
  expect(granted).toBe(true);

  // Next page: no banner, the cookie button opens the panel with the status.
  await page.goto("/writing");
  await expect(banner).toBeHidden();
  await page.locator("[data-cc-icon]").click();
  await expect(page.locator("[data-cc-panel]")).toBeVisible();
  await expect(page.locator("[data-cc-status]")).toHaveText("accepted");
  await page.locator("[data-cc-panel]").getByRole("button", { name: "Decline" }).click();
  await expect(page.locator("[data-cc-status]")).toHaveText("declined");
  expect(await page.evaluate(() => localStorage.getItem("cookie-consent"))).toBe("declined");
});
