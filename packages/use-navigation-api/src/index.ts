import {
  createContext,
  createElement,
  type FC,
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

function defaultShouldHandle(event: NavigateEvent) {
  return event.canIntercept && !event.downloadRequest;
}

type ShouldHandle = typeof defaultShouldHandle;

export const NavigationProvider: FC<{
  children: ReactNode;
  store?: "url" | "hash" | "memory";
  scoped?: boolean;
  shouldHandle?: ShouldHandle;
}> = ({
  children,
  store = "url",
  scoped,
  shouldHandle = defaultShouldHandle,
}) => {
  const navigation =
    store === "url" || store === "memory" ? window.navigation : undefined;
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState(defaultValue);
  const skip = useMemo(
    () => (event: NavigateEvent) => {
      const target = event.sourceElement;
      if (scope && target && !scope.contains(target)) return true;
      return !shouldHandle(event);
    },
    [shouldHandle, scope],
  );

  useEffect(() => {
    const handler = (event: NavigateEvent) => {
      if (skip(event)) {
        return;
      }

      let url = event.destination.url;
      if (store === "memory") {
        event.preventDefault();

        setState((prev) => {
          if (
            event.sourceElement instanceof HTMLAnchorElement &&
            event.navigationType === "push"
          ) {
            const href = event.sourceElement.getAttribute("href");
            if (href && !href.startsWith("/") && !/^[a-z]+:\/\//i.test(href)) {
              url = new URL(href, prev.url).href;
            }
          }
          return { ...prev, url, info: event.info };
        });
      } else {
        event.intercept({
          async handler() {
            setState({ navigation, url, info: event.info });
          },
        });
      }
    };

    navigation?.addEventListener("navigate", handler);
    return () => navigation?.removeEventListener("navigate", handler);
  }, [skip, navigation, scoped, store]);

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
