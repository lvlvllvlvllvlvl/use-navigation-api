import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavigationProvider } from "use-navigation-api";
import { MemoryPane } from "src/peers/memoryPane.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div>
      <NavigationProvider store="memory" scoped>
        <MemoryPane
          title="First"
          href="/one"
          linkId="memory-one-link"
          urlId="memory-one-url"
        />
      </NavigationProvider>
      <NavigationProvider store="memory" scoped>
        <MemoryPane
          title="Second"
          href="/two"
          linkId="memory-two-link"
          urlId="memory-two-url"
        />
      </NavigationProvider>
    </div>
  </StrictMode>,
);
