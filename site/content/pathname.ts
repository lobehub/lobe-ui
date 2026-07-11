export const canonicalizePathname = (pathname: string): string => {
  const canonical = pathname.replace(/\/+$/, '');
  return canonical || '/';
};
