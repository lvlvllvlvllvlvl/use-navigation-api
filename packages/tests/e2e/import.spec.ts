import { test, expect } from "./fixtures";

test("should load the app without errors", async ({ page }) => {
  await page.goto("/default");
});

test("should display the current navigation url in the app ui", async ({
  page,
}) => {
  await page.goto("/default");
  const urlElement = page.locator("#navigation-url");
  const currentUrl = page.url();
  await expect(urlElement).toHaveText(currentUrl);
});
