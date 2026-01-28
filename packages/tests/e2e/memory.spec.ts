import { test, expect } from "./fixtures";

test("memory store should not change browser url", async ({ page }) => {
  await page.goto("/memory.html");
  const initialUrl = page.url();

  const link = page.locator("#link-page1");
  await link.click();

  // Browser URL should NOT change
  expect(page.url()).toBe(initialUrl);

  // App UI should change (this is what we want to achieve)
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toContainText("/page1");
});
