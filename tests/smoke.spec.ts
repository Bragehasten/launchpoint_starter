import { test, expect } from "@playwright/test";

/**
 * Smoke suite: does the critical surface render at all?
 * No auth, no database writes — safe against any environment.
 * Capability routes are asserted via the nav so the suite stays valid
 * for ANY industry module (routes that are disabled simply aren't linked).
 */

test.describe("public surface", () => {
  test("homepage renders with header, hero, and footer", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header").first()).toBeVisible();
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page.locator("footer").first()).toBeVisible();
  });

  test("every main-nav destination responds 200", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page
      .locator("header a[href^='/']")
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute("href")))]);

    for (const href of hrefs) {
      if (!href) continue;
      const response = await request.get(href);
      expect(response.status(), `${href} should render`).toBe(200);
    }
  });

  test("contact page renders its form", async ({ page }) => {
    await page.goto("/contact");
    // The footer also has a (newsletter) form, so scope to the first form —
    // the contact form in <main>, which precedes the footer in the DOM.
    await expect(page.locator("form").first()).toBeVisible();
    await expect(page.getByLabel(/name/i).first()).toBeVisible();
    await expect(page.getByLabel(/email/i).first()).toBeVisible();
  });

  test("engine form page renders its generated fields", async ({ page }) => {
    await page.goto("/forms/employment");
    await expect(page.getByLabel(/name/i).first()).toBeVisible();
    await expect(page.getByLabel(/position/i)).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeAttached();
  });

  test("disabled engine forms 404", async ({ request }) => {
    const response = await request.get("/forms/catering");
    expect(response.status()).toBe(404);
  });

  test("location landing page renders with LocalBusiness JSON-LD", async ({ page }) => {
    // Demo seed ships one location; /locations redirects to it.
    await page.goto("/locations");
    await expect(page).toHaveURL(/\/locations\/[\w-]+/);
    const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(jsonLd.join("")).toContain('"PostalAddress"');
  });

  test("disabled capabilities 404 (service areas off for barbershop demo)", async ({ request }) => {
    const response = await request.get("/service-areas");
    expect(response.status()).toBe(404);
  });

  test("blog index renders", async ({ page }) => {
    const response = await page.goto("/blog");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("404 route renders the styled not-found page", async ({ page }) => {
    const response = await page.goto("/this-route-does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByText("Page not found")).toBeVisible();
  });
});

test.describe("auth surface", () => {
  test("sign-in page renders", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.getByLabel(/email/i).first()).toBeVisible();
  });

  test("admin redirects unauthenticated visitors to sign-in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/sign-in\?next=/);
  });

  test("account redirects unauthenticated visitors to sign-in", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/\/sign-in\?next=/);
  });
});

test.describe("seo surface", () => {
  test("sitemap and robots respond", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
  });

  test("homepage has metadata and JSON-LD", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('script[type="application/ld+json"]').first()).toBeAttached();
  });
});
