import { test, expect } from "@playwright/test";

test("work room renders what-I-built, résumé download, and testimonials", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("h1")).toBeVisible();

  // WIP-aware: while the room is parked (`wip` in src/pages/work/index.astro),
  // assert the note + contact CTA; the full checks re-arm when it flips back.
  if ((await page.locator("h1").textContent())?.trim() === "Work in progress") {
    await expect(page.locator("main a[href^='mailto:']").first()).toBeVisible();
    await expect(page.getByText("Paweł Przytuła")).toHaveCount(0);
    return;
  }

  // The three built entries render (flagship is the first).
  await expect(page.getByRole("heading", { name: "How I run marketing" })).toBeVisible();
  await expect(page.getByText("Marketing owns the website")).toBeVisible();

  // Résumé is downloadable (also present in the footer — scope to first).
  await expect(page.locator("a[href='/resume.pdf']").first()).toBeVisible();

  // The flagship links out to its full write-up (only for published essays).
  const essayLinks = await page.locator("a[href^='/writing/']").count();
  if (essayLinks > 0) {
    await expect(page.locator("a[href^='/writing/']").first()).toBeVisible();
  }

  // At least one attributed testimonial.
  await expect(page.getByText("Paweł Przytuła")).toBeVisible();
});
