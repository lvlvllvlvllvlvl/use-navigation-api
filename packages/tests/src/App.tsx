import { useLocation, useQueryParam } from "use-navigation-api";

function App() {
  const { url } = useLocation();
  const testParam = useQueryParam("test");
  const multiParam = useQueryParam("multi", true);

  return (
    <>
      <p>
        URL: <code id="navigation-url">{url}</code>
      </p>
      <p>
        Test Param: <code id="query-param-test">{testParam}</code>
      </p>
      <p>
        Multi Param: <code id="query-param-multi">{multiParam.join(",")}</code>
      </p>
      <p>
        Missing Param:{" "}
        <code id="query-param-missing">{String(useQueryParam("missing"))}</code>
      </p>
      <nav>
        <a href="/page1" id="link-page1">
          Page 1
        </a>
        <a href="/page2" id="link-page2">
          Page 2
        </a>
        <a href="?page=3" id="link-param">
          Page 3
        </a>
      </nav>
    </>
  );
}

export default App;
