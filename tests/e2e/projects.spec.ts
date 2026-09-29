import { test, expect } from "@playwright/test";
import { groups } from "../../src/data/projects";

// /dev/projects — MOCKUP (2026-09-29), parked in /dev: every builder project as a tile, by category, with a filter.
const total = groups.reduce((n, g) => n + g.projects.length, 0);

test("projects mockup: noindexed, one tile per project, no script errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/dev/projects/");
  await expect(page.locator("h1")).toHaveText("Projects");
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content", "noindex");
  await expect(page.locator("[data-sec]")).toHaveCount(groups.length);
  await expect(page.locator(".pj-cell")).toHaveCount(total);
  for (const cell of await page.locator(".pj-cell").all()) {
    expect(await cell.locator("a[href^='https://']").count()).toBeGreaterThan(0);
  }
  // the r0guelike tile opens the playtest build
  await expect(page.locator("a[data-rg]")).toHaveAttribute("href", "https://risukisu.github.io/project-r0guelike/");
  expect(errors).toEqual([]);
});

test("projects mockup: the filter shows one category, and All brings the rest back", async ({ page }) => {
  await page.goto("/dev/projects/");
  await page.getByRole("button", { name: "Games", exact: true }).click();
  await expect(page.getByRole("button", { name: "Games", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-sec]:visible")).toHaveCount(1);
  await expect(page.locator("#games")).toBeVisible();
  await expect(page).toHaveURL(/#games$/);
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator("[data-sec]:visible")).toHaveCount(groups.length);
});

test("projects mockup: a filtered link opens filtered", async ({ page }) => {
  await page.goto("/dev/projects/#sites");
  await expect(page.locator("[data-sec]:visible")).toHaveCount(1);
  await expect(page.locator("#sites")).toBeVisible();
});
