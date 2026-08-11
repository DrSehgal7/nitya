import { expect, test } from "@playwright/test";
import { project } from "../../src/data/content";
import { projectDaysSince } from "../../src/lib/project-time";

test("shows the artifact story, contact form, and inline race trail", async ({
  page,
}, testInfo) => {
  await page.goto("./");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("See how far");
  await expect(page.getByText(/I'm Hritik सरोच/)).toBeVisible();
  await expect(page.getByText(/Sanskrit—daily, constant, eternal/)).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "The numbers, kept honest" })).toBeVisible();
  await expect(page.getByRole("heading", { name: /collaboration—or coffee/i })).toBeVisible();
  await expect(page.getByRole("button", { name: "Send my note" })).toBeVisible();
  await expect(page.getByText(/as of 10 Aug 2026.*updated manually/i)).toBeVisible();

  if (process.env.CAPTURE_SCREENSHOT) {
    await page.screenshot({
      path: `/tmp/nitya-home-top-${testInfo.project.name}.png`,
    });
    await page.screenshot({
      path: `/tmp/nitya-home-${testInfo.project.name}.png`,
      fullPage: true,
    });
  }

  await expect(page.getByRole("heading", { name: "My race calendar" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Every race becomes a checkpoint" }),
  ).toBeVisible();
  await expect(page.getByText("Tata Steel World 25K", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Sponsor a kilometre/i })).toBeVisible();
  const viewport = await page.evaluate(() => ({
    innerWidth: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.innerWidth + 1);
});

test("mobile navigation opens and reaches the race calendar", async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith("mobile"), "Mobile-only navigation check");
  await page.goto("./");

  const menu = page.locator('button[aria-controls="primary-navigation"]');
  await expect(menu).toHaveAccessibleName("Open navigation");
  await menu.click();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: "Race calendar", exact: true }).click();
  await expect(page).toHaveURL(/\/#races$/);
  await expect(
    page.getByRole("heading", { name: "Every race becomes a checkpoint" }),
  ).toBeVisible();
});

test("theme toggle starts in dark mode and can be changed", async ({ page }, testInfo) => {
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const toggle = page.getByRole("button", { name: /switch to light mode/i });
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

  if (process.env.CAPTURE_SCREENSHOT) {
    await page.screenshot({
      path: `/tmp/nitya-dark-${testInfo.project.name}.png`,
      fullPage: true,
    });
  }
});

test("public habits are read-only and owner controls are reserved for the dashboard", async ({
  page,
}) => {
  await page.goto("./");
  const habits = page.locator("#habits");
  await expect(habits.getByRole("textbox")).toHaveCount(0);
  await habits.getByRole("link", { name: /owner editing/i }).click();
  await expect(page).toHaveURL(/\/owner$/);
  await expect(page.getByRole("heading", { name: /private controls/i })).toBeVisible();
  await expect(page.getByText(/controls stay disabled until/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /add/i })).toHaveCount(2);
  await expect(page.getByRole("button", { name: /edit eat what/i })).toBeDisabled();
  await expect(page.getByRole("button", { name: /delete deadlift/i })).toBeDisabled();
  await expect(page.getByRole("link", { name: /edit running total/i })).toHaveCount(0);
});

test("restored motion, race voting, and habit challenge work", async ({ page }) => {
  await page.goto("./");
  const motionCounter = page.locator(".sectionMotionCounter");
  const expectedDays = projectDaysSince(project.startedOn);
  await expect(motionCounter).toHaveCount(1);
  await expect(motionCounter.locator("strong")).toHaveText(expectedDays.toLocaleString("en-IN"));
  await expect(motionCounter).toHaveCSS("position", "fixed");
  await expect(motionCounter).toHaveCSS("border-top-width", "0px");

  const counterBeforeScroll = await motionCounter.boundingBox();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(100);
  const counterAfterScroll = await motionCounter.boundingBox();
  expect(Math.abs((counterBeforeScroll?.y ?? 0) - (counterAfterScroll?.y ?? 0))).toBeLessThan(2);

  await expect(page.getByText(/stylised placeholder/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan food better" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "No race suggestions yet." })).toBeVisible();

  const suggestRace = async (name: string, location: string) => {
    await page.getByLabel("Race or challenge name").fill(name);
    await page.getByLabel("Race location").fill(location);
    await page.getByRole("button", { name: "Suggest", exact: true }).click();
  };

  await suggestRace("Solo Test Race", "Delhi");
  const soloRace = page.locator(".raceIdeaCard").filter({ hasText: "Solo Test Race" });
  await expect(soloRace).toContainText("1vote");
  await soloRace.getByRole("button", { name: /delete solo test race/i }).click();
  await expect(page.getByRole("heading", { name: "No race suggestions yet." })).toBeVisible();

  await suggestRace("Test Mountain Challenge", "Himachal");
  await suggestRace("  test mountain challenge  ", "himachal");
  const raceCard = page.locator(".raceIdeaCard").filter({ hasText: "Test Mountain Challenge" });
  await expect(raceCard).toHaveCount(1);
  await expect(raceCard).toContainText("2votes");
  await expect(page.getByText(/already here.*upvote/i)).toBeVisible();
  await page.reload();
  await expect(
    page.locator(".raceIdeaCard").filter({ hasText: "Test Mountain Challenge" }),
  ).toContainText("2votes");
});
