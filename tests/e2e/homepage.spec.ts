import { test, expect } from "@playwright/test";

test("nexus home: masthead, follow row + stack, building section, skills pair, more row, footer mailto", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  // Follow: Newsletter | Blog | LinkedIn over X
  await expect(page.locator(".follow-row a[href='https://grugbrained.substack.com']")).toBeVisible();
  await expect(page.locator(".follow-row a[href='https://risu.pl']")).toBeVisible();
  await expect(page.locator(".follow-stack a[href='https://www.linkedin.com/in/andrzej-bialas/']")).toBeVisible();
  await expect(page.locator(".follow-stack a[href='https://x.com/risu_kisu']")).toBeVisible();
  // Building: graph | SkillCraft, then the skills pair
  await expect(page.locator(".graph").first()).toBeVisible();
  await expect(page.locator(".build-row a[href='https://skillcraft.cloud']")).toBeVisible();
  await expect(page.locator(".msk-row a[href='https://skills.abialas.pl']")).toBeVisible();
  await expect(page.locator(".msk-row a[href='https://github.com/risukisu/marketing-skills']")).toBeVisible();
  // More: Résumé | GitHub
  await expect(page.locator(".nexus-grid a[href='/work']")).toBeVisible();
  await expect(page.locator(".nexus-grid a[href='https://github.com/risukisu']")).toBeVisible();
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
