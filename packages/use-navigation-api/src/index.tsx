import * as React from "react";
import { useMemo } from "react";

type NavigationContextValue = typeof defaultValue;
const defaultValue = {
  navigation: window.navigation,
  url: window?.location?.href || "/",
  info: undefined as unknown,
};
const NavigationContext = React.createContext(defaultValue);

export const useNavigation = () => {
  const context = React.useContext(NavigationContext);
  if (context) return context;
};

export const NavigationProvider = ({
  children,
  store = "url",
  scoped,
}: {
  children: React.ReactNode;
  store?: "url" | "hash" | "memory";
  scoped?: boolean;
}) => {
  const navigation = store === "url" ? window.navigation : undefined;
  const [scope, setScope] = React.useState<HTMLDivElement | null>(null);
  const [state, setState] = React.useState(defaultValue);
  navigation?.addEventListener("navigate", (event) => {
    if (!event.canIntercept || event.downloadRequest) {
      return;
    }
    if (scoped && scope) {
      if (!scope.contains(event.sourceElement)) return;
    }

    const url = event.destination.url;
    setState({ navigation, url, info: event.info });
  });

  return (
    <NavigationContext.Provider value={state}>
      {scoped ? <div ref={setScope}>{children}</div> : children}
    </NavigationContext.Provider>
  );
};

function parseLocation({ url = "/", info }: NavigationContextValue) {
  try {
    const parsed = new URL(url, "https://example.com/");
    return {
      url,
      info,
      pathname: parsed.pathname,
      search: parsed.search,
      hash: parsed.hash,
      searchParams: parsed.searchParams,
    };
  } catch {
    /* fall back to string parsing */
  }
  const pathname = url.split("?")[0];
  const search = url.substring(pathname.length).split("#")[0];
  const hash = url.substring(pathname.length + search.length);
  try {
    const searchParams = new URLSearchParams(search);
    return { url, info, pathname, search, hash, searchParams };
  } catch {
    const searchParams = new URLSearchParams();
    return { url, info, pathname, search, hash, searchParams };
  }
}

export function useLocation(): ReturnType<typeof parseLocation>;
export function useLocation<R>(parse: (value: NavigationContextValue) => R): R;
export function useLocation(parse = parseLocation) {
  const location = React.useContext(NavigationContext);
  return useMemo(() => parse(location), [parse, location]);
}

export const useQueryParam = (param: string) => {
  const location = useLocation();
  return useMemo(() => {
    try {
      const url = new URL(location.url, "https://example.com/");
      return url.searchParams.getAll(param);
    } catch {
      return null;
    }
  }, [location.url, param]);
};
