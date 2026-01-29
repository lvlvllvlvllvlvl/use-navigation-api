### Project Guidelines

#### Summary

This project provides a React integration for the Navigation API, a new browser API designed with SPA's in mind.
As this is a relatively new browser API, you should always consult the official documentation
[MDN Navigation API](https://developer.mozilla.org/en-US/docs/Web/API/Navigation_API) before making changes.

#### Project Structure

This is a monorepo containing the following packages:

- `packages/use-navigation-api`: The core library providing react hooks for the browser's Navigation API.
  - `navigationProvider`: React context provider that wires Navigation API events, scope handling, and store mode.
  - `useNavigate`: Hook that returns a context-aware Navigation instance.
  - `location/*`: Helper hooks for accessing the current location.
- `packages/tests`: A React-based test app and Playwright E2E test suite to verify the library's functionality.

This testing setup allows testing both the build process and the browser integration.
Test configuration is optimized for cli use. Test output should attempt to balance conciseness with clarity,
erring towards more verbose output to avoid missing important information when running on a ci server.
The test wrapper in `e2e/fixtures.ts` should be updated as appropriate to provide useful debug information.

#### Development Workflow

Always use `npm` from the root of the monorepo. To run a command for a single package, add a `--workspace <package>`
parameter. Always rebuild the project before running tests.

- **Build the project:**
  ```bash
  npm run build
  ```
- **Run tests:**
  ```bash
  npm run test
  ```
- **Lint the code:**
  ```bash
  npm run lint
  ```

#### TDD Methodology

When making changes or adding new features, follow a Test-Driven Development approach:

1. **Create a test:** Before modifying any production code, create a reproduction test case in the `packages/tests`
   package.
2. **Confirm failure:** Run the tests using `npm run test` from the root and verify that the newly created test fails as
   expected.
3. **Implement changes:** Modify the code in `packages/use-navigation-api` to add the desired functionality.
4. **Verify success:** Build the project then run the tests again to ensure the test now passes and no regressions were
   introduced. If there is any uncertainty about the results of the test, ask the user to inspect the behavior in their
   browser.
