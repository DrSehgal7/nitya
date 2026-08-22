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
  await expect(
    page.getByRole("img", { name: /Hritik Saroch smiling beside a snowy mountain stream/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("img", { name: /Hritik Saroch playfully leaning into a snowy chai break/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /message Hritik.*Instagram/i })).toHaveAttribute(
    "href",
    "https://www.instagram.com/hritik_saroch/",
  );
  await expect(page.getByText(/as of 10 Aug 2026.*updated manually/i)).toBeVisible();
  const runGoal = page.locator(".artifactGoalCard").filter({
    has: page.getByRole("heading", { name: "Run 1,000 km this year" }),
  });
  await expect(runGoal.locator(".goalUpdatePreview")).toContainText(/\/ 1,000 km/);
  await expect(runGoal.locator(".publicMilestones li")).toHaveCount(4);

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

test("contact form requires only name and note and confirms private delivery", async ({ page }) => {
  await page.goto("./#contact");
  const form = page.locator(".contactForm");
  await expect(form.locator("[required]")).toHaveCount(2);
  await expect(form.getByLabel("Your email optional")).not.toHaveAttribute("required", "");
  await expect(form.getByLabel("What brings you here? optional")).not.toHaveAttribute(
    "required",
    "",
  );

  await form.getByLabel("Your name").fill("Local test visitor");
  await form.getByLabel("Your note").fill("Checking the private Nitya inbox flow.");
  await form.getByRole("button", { name: "Send my note" }).click();
  await expect(form.getByRole("status")).toContainText("private inbox");
  await expect(form.getByLabel("Your name")).toHaveValue("");
  await expect(form.getByLabel("Your note")).toHaveValue("");

  const privateInbox = await page.request.get("./api/contact");
  expect(privateInbox.status()).toBe(401);
  await expect(privateInbox.json()).resolves.toEqual({ error: "Owner access required." });
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
  await expect(page).toHaveURL(/\/owner\/sign-in/);
  await expect(page.getByRole("heading", { name: /sign in to update nitya/i })).toBeVisible();
  await expect(page.getByText(/authentication is not available/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /continue with google/i })).toHaveCount(0);
});

test("habit participation requires an account and exposes one toggle per habit", async ({
  page,
}) => {
  await page.goto("./#habit-challenge");
  await expect(page.getByText(/tap the thumbs-up on any habit/i)).toBeVisible();
  await expect(page.getByRole("button", { name: /sign in to join/i })).toHaveCount(6);
  await expect(page.getByText("0 people are joining")).toHaveCount(6);

  const response = await page.request.post("./api/habit-joins", {
    data: { habitId: "plan-food-better" },
  });
  expect(response.status()).toBe(401);
  await expect(response.json()).resolves.toEqual({
    error: "Sign in with Google to join a habit.",
  });
});

test("restored motion, protected race voting, and habit challenge work", async ({ page }) => {
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

  await expect(page.getByText(/average hybrid athlete · runner · always exploring/i)).toBeVisible();
  await expect(page.getByText(/mango espresso tonics/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: "Plan food better" })).toBeVisible();

  const runGoal = page.locator(".artifactGoalCard").filter({
    has: page.getByRole("heading", { name: "Run 1,000 km this year" }),
  });
  const statusBox = await runGoal.locator(".workStatus").boundingBox();
  const descriptionBox = await runGoal
    .getByText(/Public Strava runs update this goal/i)
    .boundingBox();
  expect((statusBox?.y ?? 0) + (statusBox?.height ?? 0)).toBeLessThanOrEqual(
    (descriptionBox?.y ?? 0) + 1,
  );

  await expect(page.locator('input[type="number"]')).toHaveCount(0);
  await expect(page.getByText(/Brewing this section for you/)).toBeVisible();
  await expect(page.getByRole("button", { name: /Analyse my spending/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Food & eating out/i })).toHaveCount(0);

  const trailMap = page.locator(".trailMap");
  const mumbaiCard = trailMap
    .getByRole("link", { name: /Tata Mumbai Marathon/i })
    .locator(".checkpointCard");
  await mumbaiCard.scrollIntoViewIfNeeded();
  const trailBox = await trailMap.boundingBox();
  const mumbaiBox = await mumbaiCard.boundingBox();
  expect((mumbaiBox?.x ?? 0) + (mumbaiBox?.width ?? 0)).toBeLessThanOrEqual(
    (trailBox?.x ?? 0) + (trailBox?.width ?? 0) + 1,
  );

  const trailRunnerBox = await trailMap.locator(".trailRunner").boundingBox();
  const nextTrailCheckpointBox = await trailMap.locator(".trailCheckpoint-next").boundingBox();
  expect((trailRunnerBox?.x ?? 0) + (trailRunnerBox?.width ?? 0) / 2).toBeLessThan(
    (nextTrailCheckpointBox?.x ?? 0) + (nextTrailCheckpointBox?.width ?? 0) / 2,
  );

  const railRunnerBox = await page.locator(".railRunner").boundingBox();
  const nextRailCheckpointBox = await page.locator(".railCheckpoint-next").boundingBox();
  expect((railRunnerBox?.x ?? 0) + (railRunnerBox?.width ?? 0) / 2).toBeLessThan(
    (nextRailCheckpointBox?.x ?? 0) + (nextRailCheckpointBox?.width ?? 0) / 2,
  );

  await expect(page.getByText("One person. One vote.", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Race or challenge name")).toBeDisabled();
  await expect(page.getByRole("button", { name: "Suggest", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: /google sign-in unavailable/i })).toBeDisabled();

  const response = await page.request.post("./api/race-ideas", {
    data: { action: "vote", id: "test-race" },
  });
  expect(response.status()).toBe(401);
  await expect(response.json()).resolves.toEqual({
    error: "Sign in with Google to suggest a race or vote.",
  });
});
