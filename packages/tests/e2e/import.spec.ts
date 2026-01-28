import { test, expect } from "@playwright/test";

test("should load the app without errors", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error));
  await page.goto("/");
  console.log("Page content:", await page.content());
  expect(errors).toEqual([]);
});

test("should display the current navigation url in the app ui", async ({
  page,
}) => {
  await page.goto("/");
  const urlElement = page.locator("#navigation-url");
  const currentUrl = page.url();
  await expect(urlElement).toHaveText(currentUrl);
});
