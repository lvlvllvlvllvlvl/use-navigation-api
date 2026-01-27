import { test, expect } from "@playwright/test";

test("should display the navigation url in the app ui", async ({ page }) => {
  await page.goto("/");
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toHaveText("https://example.com/");
});
