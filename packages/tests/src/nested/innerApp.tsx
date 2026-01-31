import { useLocation } from "use-navigation-api";

export function InnerApp() {
  const url = useLocation();
  return (
    <div id="inner-scope">
      <h3>Inner (Memory)</h3>
      <p>
        Inner URL: <code id="inner-url">{url}</code>
      </p>
      <nav>
        <a href="inner-path" id="link-inner">
          Inner Path
        </a>
      </nav>
    </div>
  );
}
