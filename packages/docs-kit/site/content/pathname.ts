export const canonicalizePathname = (pathname: string): string => {
  const canonical = pathname.replace(/\/+$/, '');
  return canonical || '/';
};

const hasDotSegment = (pathname: string): boolean =>
  pathname.split('/').some((segment) => {
    try {
      const decoded = decodeURIComponent(segment);
      return decoded === '.' || decoded === '..';
    } catch {
      return false;
    }
  });

export const validateExplicitPathname = (pathname: string): string | undefined => {
  if (!pathname.startsWith('/')) {
    return `route "${pathname}" must be a pathname beginning with "/"`;
  }
  if (pathname.startsWith('//')) {
    return `route "${pathname}" must be an origin-relative pathname without a network-path prefix`;
  }
  if (pathname.includes('?')) {
    return `route "${pathname}" must be a pathname without a query string`;
  }
  if (pathname.includes('#')) {
    return `route "${pathname}" must be a pathname without a hash fragment`;
  }
  if (/%(?![\dA-Fa-f]{2})/.test(pathname)) {
    return `route "${pathname}" must contain only valid percent-encoded bytes`;
  }
  if (hasDotSegment(pathname)) {
    return `route "${pathname}" must not contain "." or ".." dot segments`;
  }

  const base = new URL('https://docs.invalid');
  let parsed: URL;
  try {
    parsed = new URL(pathname, base);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return `route "${pathname}" must be a valid URL pathname: ${reason}`;
  }
  if (parsed.origin !== base.origin) {
    return `route "${pathname}" must be an origin-relative pathname`;
  }

  const canonical = canonicalizePathname(pathname);
  const browserPathname = canonicalizePathname(parsed.pathname);
  if (canonical !== browserPathname) {
    return `route "${pathname}" must already be URL-normalized; the browser pathname is "${browserPathname}"`;
  }
};
