import {
  createContext,
  createElement,
  type Dispatch,
  type FC,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import URI from "urijs";

export type NavigationContextState = {
  url: string;
  store: "url" | "hash" | "memory";
};
type NavigationContextValue = NavigationContextState & {
  setState?: Dispatch<SetStateAction<NavigationContextState>>;
};
const defaultValue: NavigationContextValue = {
  url: "/",
  store: "url" as "url" | "hash" | "memory",
};
export const NavigationContext = createContext(defaultValue);

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
  const [scope, setScope] = useState<HTMLDivElement | null>(null);
  const [state, setState] = useState(() => {
    const url = new URL(window.location.href);
    return {
      store,
      url: url.pathname + url.search + url.hash,
    };
  });
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
      const { pathname, search, hash } = new URL(event.destination.url);
      let url = pathname + search + hash;

      if (store === "memory") {
        event.preventDefault();

        setState((prev) => {
          if (
            event.sourceElement?.hasAttribute("href") &&
            event.navigationType === "push"
          ) {
            const href = event.sourceElement.getAttribute("href");
            if (href && !href.startsWith("/") && !/^[a-z]+:\/\//i.test(href)) {
              url = String(URI(href, prev.url));
            }
          }
          return { ...prev, url, store };
        });
      } else {
        event.intercept({
          async handler() {
            setState({ url, store });
          },
        });
      }
    };

    navigation?.addEventListener("navigate", handler);
    return () => navigation?.removeEventListener("navigate", handler);
  }, [skip, scoped, store]);

  const value = useMemo(() => ({ ...state, setState }), [state]);

  return createElement(
    NavigationContext.Provider,
    { value },
    scoped ? createElement("div", { ref: setScope }, children) : children,
  );
};
