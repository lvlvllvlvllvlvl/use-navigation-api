import { useContext, useMemo } from "react";
import { NavigationContext } from "src/navigationProvider.ts";
import URI from "uri-js";

const DUMMY_BASE = "fakeprotodonotuse://";

export type Location = string;

export function resolveLocation(location: string, base: string): string {
  const parsed = URI.parse(URI.resolve(base, location));
  parsed.scheme = undefined;
  parsed.host = undefined;
  parsed.port = undefined;
  return URI.serialize(parsed);
}

/**
 * Returns the current location for the navigation context.
 */
export function useLocation(): Location;
/**
 * Resolves a URL string relative to the current location and returns its parts.
 */
export function useLocation(url: string, base?: string): Location;
/**
 * Returns a location based on the returned url if present, or the modified input argument.
 * For instance, `useLocation(url => url.searchParams.set("parameter", "value"))` returns the current location with only a single parameter updated.
 */
export function useLocation(
  url: (current: URL) => URL | void,
  base?: string,
): Location;

export function useLocation(
  url?: string | ((current: URL) => URL | void),
  baseIn?: string,
) {
  const location = useContext(NavigationContext);
  const base = baseIn ?? location.url;
  return useMemo(() => {
    if (typeof url === "string") return resolveLocation(url, base);
    if (typeof url === "function") {
      const modified = new URL(base, DUMMY_BASE);
      const returned = url(modified);
      return resolveLocation((returned || modified).href, base);
    }
    return resolveLocation("", base);
  }, [url, base]);
}
