import { useLocation } from "src/useLocation";
import { useMemo } from "react";

export function useQueryParam(param: string, all?: false): string | null;
export function useQueryParam(param: string, all: true): string[];
export function useQueryParam(param: string, all: boolean = false) {
  const location = useLocation();
  return useMemo(() => {
    try {
      const url = new URL(location.url, "https://example.com/");
      return all
        ? url.searchParams.getAll(param) || []
        : url.searchParams.get(param);
    } catch {
      return null;
    }
  }, [location.url, param, all]);
}
