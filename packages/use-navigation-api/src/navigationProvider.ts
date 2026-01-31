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
import URI from "uri-js";

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
              url = URI.resolve(prev.url, href);
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
  }, [skip, navigation, scoped, store]);

  const value = useMemo(() => ({ ...state, setState }), [state]);

  return createElement(
    NavigationContext.Provider,
    { value },
    scoped ? createElement("div", { ref: setScope }, children) : children,
  );
};
