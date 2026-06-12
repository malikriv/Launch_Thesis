// BuilderKit Playwright config scaffold — wires the dev-login setup project,
// trace policy, and evidence-deterministic viewport. Merge into an existing
// playwright.config.ts rather than overwriting one.
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '{{FLOWS_DIR}}',
  // Stateful suites that mutate the seeded fixture: keep workers at 1
  // (the web version of the one-simulator queue). Read-only suites may raise it.
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:{{DEV_PORT}}',
    trace: 'on-first-retry',          // traces = debug artifact; evidence PNGs = proof
    viewport: { width: 1280, height: 720 },  // fixed for evidence determinism
  },
  projects: [
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '{{FLOWS_DIR}}/.auth/state.json',
      },
      dependencies: ['setup'],
    },
  ],
  webServer: {
    command: '{{DEV_COMMAND}}',
    url: process.env.E2E_BASE_URL ?? 'http://localhost:{{DEV_PORT}}',
    reuseExistingServer: true,
  },
});
