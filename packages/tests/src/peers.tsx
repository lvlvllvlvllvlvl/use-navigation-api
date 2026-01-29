import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { NavigationProvider, useLocation } from "use-navigation-api";

type MemoryPaneProps = {
  title: string;
  linkId: string;
  urlId: string;
  href: string;
};

function MemoryPane({ title, linkId, urlId, href }: MemoryPaneProps) {
  const { url } = useLocation();
  return (
    <section>
      <h2>{title}</h2>
      <p>
        URL: <code id={urlId}>{url}</code>
      </p>
      <nav>
        <a href={href} id={linkId}>
          {title} Link
        </a>
      </nav>
    </section>
  );
}

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
