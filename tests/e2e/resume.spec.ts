import { test, expect } from "@playwright/test";
import { resume } from "../../src/data/resume";

test("résumé tile lands on /resume", async ({ page }) => {
  await page.goto("/");
  await page.locator(`.nexus-grid a[href='${resume.href}']`).click();
  await expect(page).toHaveURL(/\/resume\/?$/);
  await expect(page.locator("h1")).toBeVisible();
});

test("/resume shows the under-construction note while resume.draft", async ({ page }) => {
  test.skip(!resume.draft, "the real résumé is live — this note is retired");
  await page.goto("/resume");
  await expect(page.locator("h1")).toHaveText("Under construction");
  await expect(page.getByText("Come back later.")).toBeVisible();
  await expect(page.locator("main a[href='/']")).toBeVisible();
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
});

test("the pulled résumé PDF 404s and forwards to /resume while resume.draft", async ({ page }) => {
  test.skip(!resume.draft, "the real résumé PDF is back");
  const response = await page.goto(resume.pdf);
  expect(response?.status()).toBe(404);
  await expect(page).toHaveURL(/\/resume\/?$/);
  await expect(page.locator("h1")).toHaveText("Under construction");
});
