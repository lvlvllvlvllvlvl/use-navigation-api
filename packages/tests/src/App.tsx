import { useLocation } from "use-navigation-api";

function App() {
  const { url } = useLocation();

  return (
    <>
      <p>
        URL: <code id="navigation-url">{url}</code>
      </p>
      <nav>
        <a href="/page1" id="link-page1">
          Page 1
        </a>
        <a href="/page2" id="link-page2">
          Page 2
        </a>
      </nav>
    </>
  );
}

export default App;
