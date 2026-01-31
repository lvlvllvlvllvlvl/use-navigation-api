import { useContext, useMemo } from "react";
import { NavigationContext } from "src/navigationProvider.ts";
import URI from "urijs";

export type Location = URI;

export function resolveLocation(location: string, base: string): URI {
  return URI(location, base);
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
  url: (current: URI) => URI,
  base?: string,
): Location;

export function useLocation(
  url?: string | ((current: URI) => URI),
  baseIn?: string,
) {
  const location = useContext(NavigationContext);
  const base = baseIn ?? location.url;
  return useMemo(() => {
    if (typeof url === "string") return resolveLocation(url, base);
    if (typeof url === "function") return url(resolveLocation("", base));
    return URI(base);
  }, [url, base]);
}
