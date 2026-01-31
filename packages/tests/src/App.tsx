import {
  useLocation,
  useLocationWithParam,
  useNavigate,
  useQueryParam,
} from "use-navigation-api";

function App() {
  const url = useLocation();
  const navigation = useNavigate();
  const testParam = useQueryParam("test");
  const multiParam = useQueryParam("multi", true);
  const path = url.path();
  const hash = url.hash();
  const locationWithTestParam = useLocationWithParam("test", "override");
  const locationWithoutTestParam = useLocationWithParam("test", null);

  return (
    <>
      <p>
        URL: <code id="navigation-url">{String(url)}</code>
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
      <p>
        Path: <code id="location-path">{path}</code>
      </p>
      <p>
        Hash: <code id="location-hash">{hash}</code>
      </p>
      <p>
        With Param:{" "}
        <code id="location-with-test-param">
          {String(locationWithTestParam)}
        </code>
      </p>
      <p>
        Without Param:{" "}
        <code id="location-without-test-param">
          {String(locationWithoutTestParam)}
        </code>
      </p>
      <div>
        <button
          id="navigate-products"
          type="button"
          onClick={() => navigation?.navigate("/products")}
        >
          Navigate to Products
        </button>
        <button
          id="navigate-edit-relative"
          type="button"
          onClick={() => navigation?.navigate("edit")}
        >
          Navigate to Edit (relative)
        </button>
      </div>
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
