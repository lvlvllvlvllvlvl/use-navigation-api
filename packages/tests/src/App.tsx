import { useLocation } from "use-navigation-api";

function App() {
  const { url } = useLocation();

  return (
    <>
      <p>
        URL: <code id="navigation-url">{url}</code>
      </p>
    </>
  );
}

export default App;
