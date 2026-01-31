import { test as base } from "@playwright/test";

export function toRelativeUrl(url: string): string {
  const parsed = new URL(url);
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    const logs: string[] = [];
    const errors: Error[] = [];

    page.on("console", (msg) => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
    });

    page.on("pageerror", (error) => {
      errors.push(error);
    });

    await use(page);

    if (testInfo.status !== testInfo.expectedStatus || errors.length > 0) {
      if (testInfo.status !== testInfo.expectedStatus) {
        console.log(`\n--- Test Failure Context: ${testInfo.title} ---`);
      } else {
        console.log(`\n--- Test Error Context: ${testInfo.title} ---`);
      }
      console.log(`URL: ${page.url()}`);

      if (errors.length > 0) {
        console.log("\nUnhandled Exceptions:");
        errors.forEach((err) => {
          console.log(err.stack || err.message);
        });
      }

      console.log("\nConsole Logs:");
      logs.forEach((log) => console.log(log));

      console.log("\nPage Content:");
      console.log(await page.content());
      console.log("-------------------------------------------\n");

      if (errors.length > 0 && testInfo.status === "passed") {
        throw new Error(
          `Test passed but had ${errors.length} unhandled page error(s)`,
        );
      }
    }
  },
});

export { expect } from "@playwright/test";
