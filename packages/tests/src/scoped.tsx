import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { NavigationProvider } from "use-navigation-api";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NavigationProvider scoped>
      <div id="navigation-scope">
        <App />
      </div>
    </NavigationProvider>
    <div id="outside-scope">
      <a href="/default" id="outside-link">
        Outside Link
      </a>
    </div>
  </StrictMode>,
);
