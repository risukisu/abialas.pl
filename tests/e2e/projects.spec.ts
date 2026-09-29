import { test, expect } from "@playwright/test";
import { groups } from "../../src/data/projects";

// /projects — MOCKUP (2026-09-29): the project plates and the tile gallery.
test("projects mockup: noindexed, every project with a link, every tile rendered", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/projects/");
  await expect(page.locator("h1")).toHaveText("Projects");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  const count = groups.reduce((n, g) => n + g.projects.length, 0);
  await expect(page.locator("article.pj")).toHaveCount(count);
  for (const plate of await page.locator("article.pj").all()) {
    expect(await plate.locator("dd a[href^='https://']").count()).toBeGreaterThan(0);
  }
  await expect(page.locator("figure.gl")).toHaveCount(13);
  for (const fig of await page.locator("figure.gl .gl__tile").all()) {
    const box = await fig.boundingBox();
    expect(box!.height).toBeGreaterThan(80);
  }
  expect(errors).toEqual([]);
});
