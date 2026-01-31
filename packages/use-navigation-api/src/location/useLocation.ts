import { useContext, useMemo } from "react";
import {
  NavigationContext,
  type NavigationContextState,
} from "src/navigationProvider.ts";
import URI from "uri-js";

const DUMMY_BASE = "fakeprotodonotuse://";

export type Location = string;

export function resolveLocation(
  location: string,
  { url }: NavigationContextState,
): string {
  const parsed = URI.parse(URI.resolve(url, location));
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
  parse = resolveLocation,
) {
  const location = useContext(NavigationContext);
  return useMemo(() => {
    if (typeof url === "string") return parse(url, location);
    if (typeof url === "function") {
      const modified = new URL(location.url, DUMMY_BASE);
      const returned = url(modified);
      return parse((returned || modified).href, location);
    }
    return parse("", location);
  }, [parse, url, location]);
}
