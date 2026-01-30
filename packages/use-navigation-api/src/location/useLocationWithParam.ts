import { useLocation } from "src/location/useLocation.ts";

/**
 * returns The current location with the specified parameter set to the provided value or removed if the value === null.
 * @param param name of the query parameter to set
 * @param value value to set the parameter to, or `null` to remove any existing value of that parameter
 */
export function useLocationWithParam(param: string, value: string | null) {
  return useLocation((url) =>
    value === null
      ? url.searchParams.delete(param)
      : url.searchParams.set(param, value),
  );
}
