# useNavigationAPI

Simple [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) integration for React.

## Usage

Wrap your application in a `<NavigationProvider>`, optionally specifying a `store` if you wish to store navigation locations
anywhere other than the browser's location or to modify the location before completing navigation,
for instance you can convert an app to use hash-based routing by specifying `<NavigationProvider store="hash">`,
or bypass the browser location entirely using `store="memory"`. Setting `scoped` to `true` will ignore navigation
events originating from components or elements outside the `<NavigationProvider>` component.
If you render multiple providers, pass a stable `id` to each or let the provider generate one automatically.

The `useNavigation` returns a [Navigation](https://developer.mozilla.org/en-US/docs/Web/API/Navigation) object.
`window.navigation` or `<a>` tags can also be used directly, if browser support for the Navigation API is available
in the target environment.

TODO: test this library on older browsers with the https://github.com/virtualstate/navigation polyfill.

`useLocation` returns the current URL, `useNavigationState` returns the state associated with the current history entry,
or helper functions such as `useQueryParam` can be used for more fine-grained access.
