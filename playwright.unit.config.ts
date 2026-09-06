import { defineConfig } from '@playwright/test';

/**
 * Focused unit-test config for e2e/auth-rate-limit.spec.ts.
 *
 * Pure module tests only — no browser, no webServer, and NO globalSetup
 * (the default config's globalSetup writes to the production Supabase DB,
 * which must never run from a test).
 *
 * Run with: npx playwright test --config=playwright.unit.config.ts
 */
export default defineConfig({
  testDir: './e2e',
  testMatch: '**/auth-rate-limit.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
});