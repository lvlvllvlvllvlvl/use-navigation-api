import { useLocation } from "src/location/useLocation.ts";
import { useMemo } from "react";
import { parseSearchParams } from "src/location/useQueryParam.ts";

export type ParamsMapper<T> = (params: URLSearchParams) => T;

export function mapQueryParams(params: URLSearchParams, keys?: string[]) {
  const result: Record<string, string | string[]> = {};
  params.forEach((value, key) => {
    if (keys && !keys.includes(key)) return;
    if (!result[key]) result[key] = value;
    else if (Array.isArray(result[key])) result[key].push(value);
    else result[key] = [result[key] as string, value];
  });
  return result;
}

export function useQueryParams(): Record<string, string | string[]>;
export function useQueryParams<K extends string>(
  keys: K[],
): Record<K, string | string[]>;
export function useQueryParams<T>(mapper: ParamsMapper<T>): T;
export function useQueryParams(mapping?: string[] | ParamsMapper<unknown>) {
  const location = useLocation();
  return useMemo(() => {
    const params = parseSearchParams(location);
    return Array.isArray(mapping)
      ? mapQueryParams(params, mapping)
      : (mapping || mapQueryParams)(params);
  }, [location, mapping]);
}
