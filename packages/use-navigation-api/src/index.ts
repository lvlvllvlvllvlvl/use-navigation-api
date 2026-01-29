import {
  createContext,
  createElement,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type NavigationContextState<Info = unknown> = {
  navigation: Navigation;
  url: string;
  info: Info;
  store: "url" | "hash" | "memory";
};
type NavigationContextValue = NavigationContextState & {
  setState?: Dispatch<SetStateAction<NavigationContextState>>;
};
const defaultValue: NavigationContextValue = {
  navigation: window.navigation!,
  url: window?.location?.href || "/",
  info: undefined as unknown,
  store: "url" as "url" | "hash" | "memory",
};
const NavigationContext = createContext(defaultValue);

export const useNavigation = <Info = unknown>() => {
  const context = useContext(NavigationContext);
  if (context) return context as NavigationContextState<Info>;
};

function defaultShouldHandle(event: NavigateEvent) {
  return event.canIntercept && !event.downloadRequest;
}

type ShouldHandle = typeof defaultShouldHandle;

type Resolution<T> = {
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};
type Future<T> = Promise<T> & Resolution<T>;
function future<T>(suppressUncaught?: boolean) {
  const resolution = {} as Resolution<T>;
  const result = new Promise<T>((resolve, reject) => {
    resolution.resolve = resolve;
    resolution.reject = reject;
  }) as Future<T>;
  result.resolve = resolution.resolve;
  result.reject = resolution.reject;
  if (suppressUncaught) result.catch(() => {});
  return result;
}

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
  const navigation = defaultValue.navigation;
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState(() => ({ ...defaultValue, store }));
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
          return { ...prev, url, info: event.info, store };
        });
      } else {
        event.intercept({
          async handler() {
            setState({ navigation, url, info: event.info, store });
          },
        });
      }
    };

    navigation?.addEventListener("navigate", handler);
    return () => navigation?.removeEventListener("navigate", handler);
  }, [skip, navigation, scoped, store]);

  const value = useMemo(() => ({ ...state, setState }), [state]);

  return createElement(
    NavigationContext.Provider,
    { value },
    scoped ? createElement("div", { ref: setScope }, children) : children,
  );
};

export function useNavigate() {
  const { navigation, setState } = useContext(NavigationContext);
  return useMemo(() => {
    if (!setState) return navigation;
    const navigate: Navigation["navigate"] = (destination, options) => {
      const result = {
        committed: future(true),
        finished: future(true),
      };
      const handle = ({ committed, finished }: NavigationResult) => {
        committed.then(result.committed.resolve, result.committed.reject);
        finished.then(result.finished.resolve, result.finished.reject);
      };

      setState((state) => {
        Promise.resolve().then(() => {
          try {
            handle(
              navigation.navigate(
                new URL(destination, state.url).href,
                options,
              ),
            );
          } catch {
            handle(navigation.navigate(destination, options));
          }
        });
        return state;
      });
      return result as NavigationResult;
    };
    return new Proxy(navigation, {
      get(target, prop, receiver) {
        if (prop === "navigate") return navigate;
        const value = Reflect.get(target, prop, receiver);
        return typeof value === "function" ? value.bind(target) : value;
      },
    });
  }, [navigation, setState]);
}

function parseLocation(
  location: string,
  {
    url = window?.location?.href || "https://example.com/",
    info,
  }: NavigationContextState,
) {
  try {
    const parsed = new URL(location, url);
    return {
      url: parsed.href,
      info,
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
    return { url, info, pathname, search, hash, searchParams };
  } catch {
    const searchParams = new URLSearchParams();
    return { url, info, pathname, search, hash, searchParams };
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
