import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

const publishedCount = fs
  .readdirSync("src/content/writing")
  .filter((f) => f.endsWith(".md"))
  .filter((f) =>
    /^status:\s*published\s*$/m.test(
      fs.readFileSync(path.join("src/content/writing", f), "utf-8"),
    ),
  ).length;

test("writing archive: empty state or flat list with chip rail", async ({ page }) => {
  await page.goto("/writing");
  await expect(page.locator("h1")).toBeVisible();
  if (publishedCount === 0) {
    await expect(page.getByText("Nothing published yet — pieces in progress.")).toBeVisible();
    await expect(page.locator(".chips")).toHaveCount(0);
    await expect(page.locator(".essay-card")).toHaveCount(0);
  } else {
    await expect(page.locator(".chips .chip[data-filter='all']")).toBeVisible();
    await expect(page.locator(".essay-card")).toHaveCount(publishedCount);
  }
});

test("series filter hides non-matching cards, keeps the featured plate", async ({ page }) => {
  await page.goto("/writing");
  const chips = page.locator(".chips .chip:not([data-filter='all'])");
  // Auto-skips until the first essay publishes (whole catalog is draft today).
  test.skip((await chips.count()) === 0, "no published series yet — activates when the first essay publishes");

  const firstChip = chips.first();
  const tag = await firstChip.getAttribute("data-filter");
  await firstChip.click();

  const visible = page.locator(".essay-card:visible");
  const filteredCount = await visible.count();
  for (let i = 0; i < filteredCount; i++) {
    await expect(visible.nth(i)).toHaveAttribute("data-series", tag!);
  }
  await expect(page.locator(".featured__plate")).toBeVisible();

  await page.locator(".chips .chip[data-filter='all']").click();
  expect(await page.locator(".essay-card:visible").count()).toBeGreaterThanOrEqual(filteredCount);
});
