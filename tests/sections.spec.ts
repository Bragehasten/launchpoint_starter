import { expect, test } from "@playwright/test";

/**
 * Section catalog smoke suite (Milestone D). Walks the meta-driven
 * /dev/sections catalog and asserts every registered example mounts through the
 * validated render path, plus heading-order sanity. Each example on the page is
 * a fixture from lib/sections/meta.ts, so a new section is covered the moment
 * its meta entry lands.
 */
test.describe("section catalog", () => {
  test("every registered section and example renders", async ({ page }) => {
    await page.goto("/dev/sections");

    // No block failed validation (the dev-only red box).
    await expect(page.getByText("Invalid section blocks")).toHaveCount(0);

    // One catalog entry per registered section.
    const sections = page.locator("[data-section]");
    expect(await sections.count()).toBeGreaterThanOrEqual(13);

    // Every example fixture is present and visible.
    const examples = page.locator("[data-section-example]");
    const count = await examples.count();
    expect(count).toBeGreaterThanOrEqual(13);
    for (let i = 0; i < count; i++) {
      await expect(examples.nth(i)).toBeVisible();
    }
  });

  test("heading order never skips a level", async ({ page }) => {
    await page.goto("/dev/sections");
    const levels = await page
      .locator("h1, h2, h3, h4, h5, h6")
      .evaluateAll((els) => els.map((el) => Number(el.tagName[1])));

    expect(levels).toContain(1); // a hero example emits the page's h1

    let prev = 0;
    for (const level of levels) {
      if (prev !== 0) expect(level - prev).toBeLessThanOrEqual(1); // no forward skip
      prev = level;
    }
  });

  test("a real page has exactly one h1", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
  });
});
