const DEV = process.env.NODE_ENV === 'development';

type Registry = {
  global: Map<string, number>;
  scoped: Map<string, WeakMap<object, number>>;
};

const GLOBAL_KEY = '__LOBE_UI_DEV_SINGLETON_REGISTRY__';

const getRegistry = (): Registry => {
  const g = globalThis as unknown as Record<string, unknown>;
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      global: new Map<string, number>(),
      scoped: new Map<string, WeakMap<object, number>>(),
    } satisfies Registry;
  }
  return g[GLOBAL_KEY] as Registry;
};

const getScopedMap = (registry: Registry, name: string) => {
  const existing = registry.scoped.get(name);
  if (existing) return existing;
  const next = new WeakMap<object, number>();
  registry.scoped.set(name, next);
  return next;
};

const singletonError = (name: string) =>
  new Error(
    `[lobe-ui] ${name} must be rendered only once in a single React tree. ` +
      `You probably mounted it multiple times (or in multiple roots).`,
  );

/**
 * Dev-only singleton guard.
 * - If `scope` is provided, it's enforced per scope object (e.g. portal root).
 * - Otherwise it's enforced globally in the current JS runtime.
 */
export const registerDevSingleton = (name: string, scope?: object | null): (() => void) => {
  if (!DEV) return () => {};

  const registry = getRegistry();

  // Scoped singleton (preferred)
  if (scope) {
    const scoped = getScopedMap(registry, name);
    const prev = scoped.get(scope) ?? 0;
    const next = prev + 1;
    scoped.set(scope, next);

    if (next > 1) {
      // rollback to avoid poisoning the registry after throwing
      if (prev === 0) scoped.delete(scope);
      else scoped.set(scope, prev);
      throw singletonError(name);
    }

    return () => {
      const curr = scoped.get(scope) ?? 0;
      const after = curr - 1;
      if (after <= 0) scoped.delete(scope);
      else scoped.set(scope, after);
    };
  }

  // Global singleton (fallback)
  const prev = registry.global.get(name) ?? 0;
  const next = prev + 1;
  registry.global.set(name, next);

  if (next > 1) {
    // rollback to avoid poisoning the registry after throwing
    if (prev === 0) registry.global.delete(name);
    else registry.global.set(name, prev);
    throw singletonError(name);
  }

  return () => {
    const curr = registry.global.get(name) ?? 0;
    const after = curr - 1;
    if (after <= 0) registry.global.delete(name);
    else registry.global.set(name, after);
  };
};
