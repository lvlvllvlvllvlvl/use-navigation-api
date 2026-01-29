import { useContext, useMemo } from "react";
import { NavigationContext } from "src/navigationProvider";
import { future } from "src/util/future";

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
