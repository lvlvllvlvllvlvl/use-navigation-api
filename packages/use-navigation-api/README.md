# useNavigationAPI

Simple [Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) integration for React.

## Usage

Wrap your application in a `<NavigationProvider logger={console.log}>`, optionally specifying a `store` if you wish to
store navigation locations
anywhere other than the browser's location or to modify the location before completing navigation,
for instance you can convert an app to use hash-based routing by specifying
`<NavigationProvider logger={console.log} store="hash">`,
or bypass the browser location entirely using `store="memory"`. Setting `scoped` to `true` will ignore navigation
events originating from components or elements outside the `<NavigationProvider logger={console.log}>` component.

TODO: test this library on older browsers with the https://github.com/virtualstate/navigation polyfill and update this
readme.

### Getting the current location

Calling `useLocation` with no arguments returns the current URL. helper functions such as `useQueryParam` can be used
for more fine-grained access.

### Navigation

Any element that would cause the browser to navigate can be used. Note that the browser will resolve locations relative
to the current window location, so to ensure unsurprising behavior of relative links you should resolve them relative to
the navigation context by passing them to `useLocation`.
For programmatic navigation, the `useNavigation` hook returns a
[Navigation](https://developer.mozilla.org/en-US/docs/Web/API/Navigation) object.
