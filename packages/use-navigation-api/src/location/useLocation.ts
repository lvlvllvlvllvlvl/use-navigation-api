import { useContext, useMemo } from "react";
import {
  NavigationContext,
  type NavigationContextState,
} from "src/navigationProvider.ts";

function parseLocation(
  location: string,
  {
    url = window?.location?.href || "https://example.com/",
  }: NavigationContextState,
) {
  try {
    const parsed = new URL(location, url);
    return {
      url: parsed.href,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      searchParams: parsed.searchParams,
    };
  } catch {
    /* fall back to string parsing */
  }
  url = location || url;
  const pathname = url.split("?")[0];
  const search = url.substring(pathname.length).split("#")[0];
  const hash = url.substring(pathname.length + search.length);
  try {
    const searchParams = new URLSearchParams(search);
    return { url, pathname, search, hash, searchParams };
  } catch {
    const searchParams = new URLSearchParams();
    return { url, pathname, search, hash, searchParams };
  }
}

export function useLocation(): ReturnType<typeof parseLocation>;
export function useLocation<R>(
  parse: (location: string, value: NavigationContextState) => R,
): R;
export function useLocation(parse = parseLocation) {
  const location = useContext(NavigationContext);
  return useMemo(() => parse("", location), [parse, location]);
}
