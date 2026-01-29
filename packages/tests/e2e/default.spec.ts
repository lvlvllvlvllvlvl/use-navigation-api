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

test("should display query parameters using useQueryParam", async ({
  page,
}) => {
  await page.goto("/default?test=value");
  const paramElement = page.locator("#query-param-test");
  await expect(paramElement).toHaveText("value");
});

test("should display multiple query parameters using useQueryParam with all: true", async ({
  page,
}) => {
  await page.goto("/default?multi=1&multi=2");
  const paramElement = page.locator("#query-param-multi");
  await expect(paramElement).toHaveText("1,2");
});

test("should return null for missing query parameter", async ({ page }) => {
  await page.goto("/default");
  const paramElement = page.locator("#query-param-missing");
  await expect(paramElement).toHaveText("null");
});

test("should handle relative links correctly", async ({ page }) => {
  await page.goto("/default");
  await page.locator("#link-products").click();
  await expect(page.locator("#navigation-url")).toContainText("/products");

  await page.locator("#link-edit-relative").click();
  await expect(page.locator("#navigation-url")).toContainText("/edit");
});

test("should navigate via the useNavigate navigation object", async ({
  page,
}) => {
  await page.goto("/default");
  await page.locator("#navigate-products").click();
  await expect(page.locator("#navigation-url")).toContainText("/products");
});
