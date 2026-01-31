import { useLocation } from "src/location/useLocation.ts";
import { useMemo } from "react";
import URI from "uri-js";

export function parseSearchParams(location?: string) {
  return new URLSearchParams(URI.parse(location || "").query);
}

/**
 * Returns the first value for a query parameter, or null if it is missing.
 */
export function useQueryParam(param: string, all?: false): string | null;
/**
 * Returns all values for a query parameter when it appears multiple times.
 */
export function useQueryParam(param: string, all: true): string[];

export function useQueryParam(param: string, all: boolean = false) {
  const location = useLocation();
  return useMemo(() => {
    try {
      const searchParams = parseSearchParams(location);
      return all ? searchParams.getAll(param) || [] : searchParams.get(param);
    } catch {
      return null;
    }
  }, [location, all, param]);
}
