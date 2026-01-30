import { useContext, useMemo } from "react";
import {
  NavigationContext,
  type NavigationContextState,
} from "src/navigationProvider.ts";

type Location = { pathname: string; search: string; hash: string; url?: URL };

export function parseLocation(
  location: string,
  {
    url = window?.location?.href || "https://example.com/",
  }: NavigationContextState,
): Location {
  try {
    const parsed = new URL(location, url);
    return {
      url: parsed,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
    };
  } catch {
    /* fall back to string parsing */
  }
  if (!location) return { pathname: "/", search: "", hash: "" };
  const pathname = location.split("?")[0];
  const search = location.substring(pathname.length).split("#")[0];
  const hash = location.substring(pathname.length + search.length);
  try {
    return { url: undefined, pathname, search, hash };
  } catch {
    return { url: undefined, pathname, search, hash };
  }
}

/**
 * Returns the current location for the navigation context.
 */
export function useLocation(): Location;
/**
 * Resolves a URL string relative to the current location and returns its parts.
 */
export function useLocation(url: string): Location;
/**
 * Resolves a URL string relative to the current location after applying the supplied function.
 */
export function useLocation<R>(
  url: string,
  parse: (location: string, value: NavigationContextState) => R,
): R;
/**
 * Returns a location based on the returned url if present, or the modified input argument.
 * For instance, `useLocation(url => url.searchParams.set("parameter", "value"))` returns the current location with only a single parameter updated.
 */
export function useLocation(url: (current: URL) => URL | void): Location;
export function useLocation(
  url?: string | ((current: URL) => URL | void),
  parse = parseLocation,
) {
  const location = useContext(NavigationContext);
  return useMemo(() => {
    if (typeof url === "string") return parse(url, location);
    if (typeof url === "function") {
      const modified = new URL(location.url);
      const returned = url(modified);
      return parse((returned || modified).href, location);
    }
    return parse("", location);
  }, [parse, url, location]);
}
