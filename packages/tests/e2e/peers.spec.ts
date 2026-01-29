import { test, expect } from "./fixtures";

test("multiple memory providers should keep independent state", async ({
  page,
}) => {
  await page.goto("/peers");

  const firstUrl = page.locator("#memory-one-url");
  const secondUrl = page.locator("#memory-two-url");
  const initialUrl = page.url();

  await expect(firstUrl).toHaveText(initialUrl);
  await expect(secondUrl).toHaveText(initialUrl);

  await page.click("#memory-one-link");
  await expect(firstUrl).toContainText("/one");
  await expect(secondUrl).toHaveText(initialUrl);

  await page.click("#memory-two-link");
  await expect(secondUrl).toContainText("/two");
  await expect(firstUrl).toContainText("/one");
  await expect(page).toHaveURL(initialUrl);
});
