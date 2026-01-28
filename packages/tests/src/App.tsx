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
        View Param: <code id="query-param-view">{useQueryParam("view")}</code>
      </p>
      <p>
        Multi Param: <code id="query-param-multi">{multiParam.join(",")}</code>
      </p>
      <p>
        Missing Param:{" "}
        <code id="query-param-missing">{String(useQueryParam("missing"))}</code>
      </p>
      <nav>
        <a href="/products" id="link-products">
          Products
        </a>
        <a href="/categories" id="link-categories">
          Categories
        </a>
        <a href="/settings/profile" id="link-settings-profile">
          Profile Settings
        </a>
        <a href="?view=details" id="link-view-details">
          View Details
        </a>
        <a href="edit" id="link-edit-relative">
          Edit (relative)
        </a>
      </nav>
    </>
  );
}

export default App;
