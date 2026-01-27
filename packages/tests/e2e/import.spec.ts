import { test, expect } from "@playwright/test";
import { useNavigation } from "use-navigation-api";

test("should import useNavigation and return expected url", async () => {
  const url = useNavigation();
  expect(url.toString()).toBe("https://example.com/");
});
