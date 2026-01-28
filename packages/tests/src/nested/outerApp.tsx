import { NavigationProvider, useLocation } from "use-navigation-api";
import { InnerApp } from "./innerApp.tsx";

export function OuterApp() {
  const { url } = useLocation();
  return (
    <div>
      <h2>Outer (URL)</h2>
      <p>
        Outer URL: <code id="outer-url">{url}</code>
      </p>
      <nav>
        <a href="/outer-path" id="link-outer">
          Outer Path
        </a>
      </nav>
      <hr />
      <NavigationProvider store="memory" scoped>
        <InnerApp />
      </NavigationProvider>
    </div>
  );
}
