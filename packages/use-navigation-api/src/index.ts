import {
  createContext,
  createElement,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type NavigationContextValue = typeof defaultValue;
const defaultValue = {
  navigation: window.navigation,
  url: window?.location?.href || "/",
  info: undefined as unknown,
};
const NavigationContext = createContext(defaultValue);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context) return context;
};

export const NavigationProvider = ({
  children,
  store = "url",
  scoped,
}: {
  children: ReactNode;
  store?: "url" | "hash" | "memory";
  scoped?: boolean;
}) => {
  const navigation = store === "url" ? window.navigation : undefined;
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState(defaultValue);

  useEffect(() => {
    const handler = (event: NavigateEvent) => {
      if (!event.canIntercept || event.downloadRequest) {
        return;
      }
      if (scoped && scope) {
        if (
          !event.sourceElement ||
          !(event.sourceElement instanceof Element) ||
          !scope.contains(event.sourceElement)
        ) {
          return;
        }
      }

      const url = event.destination.url;
      event.intercept({
        async handler() {
          setState({ navigation, url, info: event.info });
        },
      });
    };

    navigation?.addEventListener("navigate", handler);
    return () => navigation?.removeEventListener("navigate", handler);
  }, [navigation, scoped, scope]);

  return createElement(
    NavigationContext.Provider,
    { value: state },
    scoped ? createElement("div", { ref: setScope }, children) : children,
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
  const location = useContext(NavigationContext);
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
