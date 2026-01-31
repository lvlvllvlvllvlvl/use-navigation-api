import { test, expect, toRelativeUrl } from "./fixtures";

test("multiple memory providers should keep independent state", async ({
  page,
}) => {
  await page.goto("/peers");

  const firstUrl = page.locator("#memory-one-url");
  const secondUrl = page.locator("#memory-two-url");
  const initialUrl = page.url();
  const initialRelativeUrl = toRelativeUrl(initialUrl);

  await expect(firstUrl).toHaveText(initialRelativeUrl);
  await expect(secondUrl).toHaveText(initialRelativeUrl);

  await page.click("#memory-one-link");
  await expect(firstUrl).toContainText("/one");
  await expect(secondUrl).toHaveText(initialRelativeUrl);

  await page.click("#memory-two-link");
  await expect(secondUrl).toContainText("/two");
  await expect(firstUrl).toContainText("/one");
  await expect(page).toHaveURL(initialUrl);
});
