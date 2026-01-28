import { test, expect } from "./fixtures";

test("should intercept navigation within the scoped element", async ({
  page,
}) => {
  await page.goto("/scoped");

  await page.click("#link-page1");

  // URL in browser should change
  await expect(page).toHaveURL(/\/page1$/);

  // useLocation should reflect the change
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toHaveText(page.url());
});

test("should NOT intercept navigation from outside the scoped element", async ({
  page,
}) => {
  await page.goto("/scoped");

  // We expect a full page reload when clicking outside link because it's NOT intercepted.
  // We can check this by seeing if a global variable is cleared.
  await page.evaluate(() => {
    (window as any).isNotReloaded = true;
  });

  await page.click("#outside-link");

  // Browser URL should change
  await expect(page).toHaveURL(/\/default$/);

  // Global variable should be gone if it was a real navigation
  const isNotReloaded = await page.evaluate(
    () => (window as any).isNotReloaded,
  );
  expect(isNotReloaded).toBeUndefined();
});
