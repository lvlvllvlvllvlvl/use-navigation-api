type Resolution<T> = {
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
};
type Future<T> = Promise<T> & Resolution<T>;

/**
 * Returns a Promise that can be resolved or rejected from outside.
 * @param suppressUncaught If true, adds a dummy catch handler to bypass browsers' uncaught error logging.
 */
export function future<T>(suppressUncaught?: boolean) {
  const resolution = {} as Resolution<T>;
  const result = new Promise<T>((resolve, reject) => {
    resolution.resolve = resolve;
    resolution.reject = reject;
  }) as Future<T>;
  result.resolve = resolution.resolve;
  result.reject = resolution.reject;
  if (suppressUncaught) result.catch(() => {});
  return result;
}
