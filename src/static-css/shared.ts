export interface CssinjsCacheLike {
  cache: Map<string, unknown>;
}

export const styleKeysOf = (cache: CssinjsCacheLike): string[] =>
  [...cache.cache.keys()].filter((key) => key.startsWith('style%'));
