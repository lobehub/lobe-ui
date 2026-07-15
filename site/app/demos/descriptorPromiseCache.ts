export interface DescriptorPromiseCache<Value> {
  clear: () => void;
  load: (key: string, loader: () => Promise<Value>) => Promise<Value>;
}

export function createDescriptorPromiseCache<Value>(): DescriptorPromiseCache<Value> {
  const promises = new Map<string, Promise<Value>>();

  return {
    clear: () => promises.clear(),
    load: (key, loader) => {
      const cached = promises.get(key);
      if (cached) return cached;

      const promise = Promise.resolve().then(loader);
      promises.set(key, promise);
      void promise.catch(() => {
        if (promises.get(key) === promise) promises.delete(key);
      });
      return promise;
    },
  };
}
