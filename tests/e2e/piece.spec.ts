import { test, expect } from "@playwright/test";

test("piece page renders its anatomy variant", async ({ page }) => {
  await page.goto("/writing");
  const cardCount = await page.locator(".essay-card a").count();
  test.skip(cardCount === 0, "no published essays yet — re-arms on first publish");

  const firstCardHref = await page.locator(".essay-card a").first().getAttribute("href");
  await page.goto(firstCardHref!);
  await expect(page.locator("h1")).toBeVisible();
  // outcome pieces render .piece-meta; concept pieces render the standfirst
  await expect(page.locator(".piece-meta, .piece__standfirst").first()).toBeVisible();
});

test("draft piece returns 404", async ({ page }) => {
  const response = await page.goto("/writing/scrum-in-marketing");
  expect(response?.status()).toBe(404);
});

test("piece page has Article + BreadcrumbList JSON-LD", async ({ page }) => {
  await page.goto("/writing");
  const cardCount = await page.locator(".essay-card a").count();
  test.skip(cardCount === 0, "no published essays yet — re-arms on first publish");

  const firstCardHref = await page.locator(".essay-card a").first().getAttribute("href");
  await page.goto(firstCardHref!);
  const blocks = await page
    .locator("script[type='application/ld+json']")
    .allTextContents();
  const joined = blocks.join("\n");
  expect(joined).toContain("\"@type\":\"Article\"");
  expect(joined).toContain("\"@type\":\"BreadcrumbList\"");
});
