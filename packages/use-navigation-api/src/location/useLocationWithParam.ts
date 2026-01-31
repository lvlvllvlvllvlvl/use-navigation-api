import { useLocation } from "src/location/useLocation.ts";

/**
 * returns The current location with the specified parameter set to the provided value or removed if the value === null.
 * @param param name of the query parameter to set
 * @param value value to set the parameter to, or `null` to remove any existing value of that parameter
 * @param base If provided, uses this value instead of the current location.
 */
export function useLocationWithParam(
  param: string,
  value: string | null,
  base?: string,
) {
  return useLocation(
    (url) =>
      value === null
        ? url.searchParams.delete(param)
        : url.searchParams.set(param, value),
    base,
  );
}

/**
 * returns The current location with the specified parameter set to the provided value or removed if the value === null.
 * @param params map of parameters to update. null or empty entries will be removed.
 * @param base If provided, uses this value instead of the current location.
 */
export function useLocationWithParams(
  params: Record<string, string | string[] | null>,
  base?: string,
) {
  return useLocation((url) => {
    for (const [param, value] of Object.entries(params)) {
      if (value === null) {
        url.searchParams.delete(param);
      } else if (Array.isArray(value)) {
        url.searchParams.delete(param);
        value.forEach((v) => url.searchParams.append(param, v));
      } else {
        url.searchParams.set(param, value);
      }
    }
    return url;
  }, base);
}
