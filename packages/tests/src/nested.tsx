import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NavigationProvider } from "use-navigation-api";
import { OuterApp } from "./nested/outerApp.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavigationProvider>
      <OuterApp />
    </NavigationProvider>
  </StrictMode>,
);
