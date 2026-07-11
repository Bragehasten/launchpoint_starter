import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke tests: fast, unauthenticated checks that the critical surface
 * renders after a build. Run against a production server:
 *
 *   npm run build && npm run test:e2e
 *
 * First-time setup on a dev machine:
 *   npm install && npx playwright install chromium
 *
 * tests/ is excluded from the app tsconfig — Playwright type-checks specs
 * with its own runner.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
});
