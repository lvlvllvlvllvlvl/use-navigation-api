import { useLocation } from "use-navigation-api";

function App() {
  const { url } = useLocation();

  return (
    <div>
      <p>
        URL: <code id="navigation-url">{url}</code>
      </p>
    </div>
  );
}

export default App;
