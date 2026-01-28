import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NavigationProvider } from "use-navigation-api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavigationProvider store="memory">
      <App />
    </NavigationProvider>
  </StrictMode>,
);
