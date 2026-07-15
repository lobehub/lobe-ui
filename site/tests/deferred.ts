export interface Deferred<T> {
  promise: Promise<T>;
  reject: (reason?: unknown) => void;
  resolve: (value: T | PromiseLike<T>) => void;
  readonly settled: boolean;
}

export const deferred = <T>(): Deferred<T> => {
  let reject!: (reason?: unknown) => void;
  let resolve!: (value: T | PromiseLike<T>) => void;
  let settled = false;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = (value) => {
      settled = true;
      promiseResolve(value);
    };
    reject = (reason) => {
      settled = true;
      promiseReject(reason);
    };
  });

  return {
    promise,
    reject,
    resolve,
    get settled() {
      return settled;
    },
  };
};
