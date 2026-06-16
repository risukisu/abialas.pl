import { test, expect } from "@playwright/test";

test("work room renders what-I-built, résumé download, and testimonials", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("h1")).toBeVisible();

  // The three built entries render (flagship is the first).
  await expect(page.getByRole("heading", { name: "How I run marketing" })).toBeVisible();
  await expect(page.getByText("Marketing owns the website")).toBeVisible();

  // Résumé is downloadable (also present in the footer — scope to first).
  await expect(page.locator("a[href='/resume.pdf']").first()).toBeVisible();

  // The flagship links out to its full write-up.
  await expect(page.locator("a[href='/writing/how-i-run-marketing']")).toBeVisible();

  // At least one attributed testimonial.
  await expect(page.getByText("Paweł Przytuła")).toBeVisible();
});
