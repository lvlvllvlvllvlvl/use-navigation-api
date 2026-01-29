import { test, expect } from "./fixtures";

test("memory store should not change browser url", async ({ page }) => {
  await page.goto("/memory.html");
  const initialUrl = page.url();

  const link = page.locator("#link-products");
  await link.click();

  // Browser URL should NOT change
  expect(page.url()).toBe(initialUrl);

  // App UI should change (this is what we want to achieve)
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toContainText("/products");
});

test("memory store should handle relative links correctly", async ({
  page,
}) => {
  await page.goto("/memory.html");
  const initialUrl = page.url();

  await page.locator("#link-products").click();
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toContainText("/products");

  await page.locator("#link-edit-relative").click();
  // In memory mode, relative links should resolve against the memory state
  await expect(urlElement).toContainText("/edit");
  expect(page.url()).toBe(initialUrl);
});

test("memory store should handle relative links correctly with nested paths", async ({
  page,
}) => {
  await page.goto("/memory.html");
  const initialUrl = page.url();

  await page.locator("#link-settings-profile").click();
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toContainText("/settings/profile");

  await page.locator("#link-edit-relative").click();
  // Browser resolves "edit" relative to "/memory.html" -> "/edit"
  // Memory router SHOULD resolve "edit" relative to "/settings/profile" -> "/settings/edit"
  await expect(urlElement).toContainText("/settings/edit");
  expect(page.url()).toBe(initialUrl);
});

test("memory store should handle query parameters using useQueryParam", async ({
  page,
}) => {
  await page.goto("/memory.html");
  const initialUrl = page.url();

  await page.locator("#link-view-details").click();

  // Browser URL should NOT change
  expect(page.url()).toBe(initialUrl);

  // App UI should reflect the query parameter from memory state
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toContainText("?view=details");

  const paramElement = page.locator("#query-param-view");
  await expect(paramElement).toHaveText("details");
});

test("memory store should navigate via useNavigate and resolve relative paths", async ({
  page,
}) => {
  await page.goto("/memory.html");
  const initialUrl = page.url();

  await page.locator("#navigate-products").click();
  const urlElement = page.locator("#navigation-url");
  await expect(urlElement).toContainText("/products");
  expect(page.url()).toBe(initialUrl);

  await page.locator("#link-settings-profile").click();
  await expect(urlElement).toContainText("/settings/profile");

  await page.locator("#navigate-edit-relative").click();
  await expect(urlElement).toContainText("/settings/edit");
  expect(page.url()).toBe(initialUrl);
});
