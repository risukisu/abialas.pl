import { test, expect } from "@playwright/test";
import { resume } from "../../src/data/resume";

test("nexus home: masthead, follow row + stack, building section, skills pair, more row, footer mailto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  // Follow: Newsletter | Blog | LinkedIn over X
  await expect(page.locator(".follow-row a[href='https://grugbrained.substack.com']")).toBeVisible();
  await expect(page.locator(".follow-row a[href='https://risu.pl']")).toBeVisible();
  await expect(page.locator(".follow-stack a[href='https://www.linkedin.com/in/andrzej-bialas/']")).toBeVisible();
  await expect(page.locator(".follow-stack a[href='https://x.com/risu_kisu']")).toBeVisible();
  // Building: graph (the GitHub tile) | SkillCraft, then the skills pair
  await expect(page.locator(".build-row a.graph[href='https://github.com/risukisu']")).toBeVisible();
  await expect(page.locator(".build-row a[href='https://skillcraft.cloud']")).toBeVisible();
  await expect(page.locator(".msk-row a[href='https://skillcraft.cloud/marketing-skills']")).toBeVisible();
  const statusline = page.locator(".msk-row a[href='https://github.com/risukisu/claude-code-statusline']");
  await expect(statusline).toBeVisible();
  // the tile's art is the animated SVG and it actually loads
  const art = statusline.locator("img[src='/tiles/statusline.svg']");
  await expect(art).toBeVisible();
  expect(await art.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  // More: Résumé | coming soon (footer PDF link hidden while `resume.draft`)
  await expect(page.locator(`.nexus-grid a[href='${resume.href}']`)).toBeVisible();
  if (resume.draft) {
    await expect(page.locator("a[href='/resume.pdf']")).toHaveCount(0);
  }
  await expect(page.locator(".nexus-grid [data-soon]")).toContainText("More coming soon.");
  await expect(page.locator("a[href^='mailto:']").first()).toBeVisible();
});

test("home nav → work", async ({ page }) => {
  await page.goto("/");
  await page.click("nav a[href='/work']");
  await expect(page).toHaveURL(/\/work$/);
});

test("no links to the dead concept pages remain", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("a[href='/system']")).toHaveCount(0);
  await expect(page.locator("a[href='/ai']")).toHaveCount(0);
});
