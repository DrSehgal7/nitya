import { defineConfig, devices } from "@playwright/test";

const localBrowser = process.env.PLAYWRIGHT_SYSTEM_CHROME ? { channel: "chrome" as const } : {};

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000/",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3000",
    url: "http://127.0.0.1:3000/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"], ...localBrowser },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"], deviceScaleFactor: 1, ...localBrowser },
    },
    {
      name: "mobile-webkit",
      use: { ...devices["iPhone 13"] },
    },
  ],
});
