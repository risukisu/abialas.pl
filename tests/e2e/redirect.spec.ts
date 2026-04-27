import { test, expect } from "@playwright/test";

test("/blog page declares meta-refresh redirect to risu.pl", async ({ page }) => {
  // The /blog page has an inline <script> that calls window.location.replace() immediately,
  // which fires before domcontentloaded and causes Playwright to follow the redirect.
  // We verify the redirect machinery by reading the static HTML directly via fetch API,
  // avoiding any JS execution.
  const response = await page.request.get("/blog");
  expect(response.status()).toBe(200);

  const html = await response.text();
  expect(html).toContain("http-equiv=\"refresh\"");
  expect(html).toContain("https://risu.pl");
  expect(html).toContain("rel=\"canonical\"");
});
