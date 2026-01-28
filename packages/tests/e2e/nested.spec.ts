import { test, expect } from "./fixtures";

test("nested memory scope should not update outer URL", async ({ page }) => {
  await page.goto("/nested");

  const outerUrl = page.locator("#outer-url");
  const innerUrl = page.locator("#inner-url");

  const initialUrl = page.url();
  await expect(outerUrl).toHaveText(initialUrl);

  // Click inner link (memory stored)
  await page.click("#link-inner");

  // Inner URL should update
  await expect(innerUrl).toHaveText(/inner-path$/);

  // Outer URL should NOT update
  await expect(outerUrl).toHaveText(initialUrl);
  await expect(page).toHaveURL(initialUrl);
});

test("outer link should still update outer URL", async ({ page }) => {
  await page.goto("/nested");

  const outerUrl = page.locator("#outer-url");

  await page.click("#link-outer");

  await expect(page).toHaveURL(/outer-path$/);
  await expect(outerUrl).toHaveText(/outer-path$/);
});
