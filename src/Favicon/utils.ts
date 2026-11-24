/**
 * Host name of a URL, or `undefined` when it cannot be parsed. Search providers
 * do hand back empty or malformed URLs, and `new URL()` throws on them.
 */
export const getFaviconHost = (url?: string): string | undefined => {
  if (!url) return undefined;
  try {
    return new URL(url).hostname || undefined;
  } catch {
    // A bare host such as `github.com` is not a URL, but is still a usable host.
    return /^[\w-]+(\.[\w-]+)+$/.test(url) ? url : undefined;
  }
};

export const defaultFaviconUrl = (host: string) => `https://icons.duckduckgo.com/ip3/${host}.ico`;
