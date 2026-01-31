import { useLocation } from "src/location/useLocation.ts";
import { useMemo } from "react";
import { parseSearchParams } from "src/location/useQueryParam.ts";

export type ParamsMapper<T> = (params: URLSearchParams) => T;

export function mapQueryParams(
  params: URLSearchParams,
  keys?: string[],
  arrayKeys?: string[],
) {
  const result: Record<string, string | string[] | null> = Object.fromEntries(
    (keys || [])
      .map((key) => [key, null as string | string[] | null])
      .concat((arrayKeys || []).map((key) => [key, []])),
  );
  params.forEach((value, key) => {
    if (keys && !(keys.includes(key) || arrayKeys?.includes(key))) return;
    if (!result[key]) result[key] = value;
    else if (keys?.includes(key)) return;
    else if (Array.isArray(result[key])) result[key].push(value);
    else result[key] = [result[key] as string, value];
  });
  return result;
}

/**
 * Returns the first value of each query parameter found in the url.
 */
export function useQueryParams(): Record<string, string>;
/**
 * Returns the first value of each query parameter found in keys, and all values of each parameter found in arrayKeys.
 * Note that typescript types of K and M should not overlap - manual typing or casting variables to `as const` may be required.
 */
export function useQueryParams<K extends string, M extends string>(
  keys: K[],
  arrayKeys?: M[],
): Record<K, string | null> & Record<M, string[]>;
/**
 * Maps SearchParams to a custom type using the provided mapper function.
 */
export function useQueryParams<T>(mapper: ParamsMapper<T>): T;
export function useQueryParams(
  mapping?: string[] | ParamsMapper<unknown>,
  arrayKeys?: string[],
) {
  const location = useLocation();
  return useMemo(() => {
    const params = parseSearchParams(location);
    return Array.isArray(mapping)
      ? mapQueryParams(params, mapping, arrayKeys)
      : (mapping || mapQueryParams)(params);
  }, [location, mapping, arrayKeys]);
}
