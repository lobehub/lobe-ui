import { siteMetadata } from '../../content/siteMetadata';

const xmlEscape = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const normalizeDocumentPathname = (pathname: string, origin: string): string | undefined => {
  const expectedOrigin = new URL(origin).origin;
  const parsed = new URL(pathname, expectedOrigin);
  if (parsed.origin !== expectedOrigin) return;
  const normalized = parsed.pathname.replace(/\/+$/, '') || '/';
  if (
    normalized === '/404' ||
    normalized === '/__spa-fallback.html' ||
    normalized === '/~demos' ||
    normalized.startsWith('/~demos/')
  ) {
    return;
  }
  return normalized;
};

export function createSitemap(pathnames: string[], origin: string = siteMetadata.origin): string {
  const urls = [
    ...new Set(pathnames.flatMap((pathname) => normalizeDocumentPathname(pathname, origin) ?? [])),
  ]
    .toSorted((left, right) => left.localeCompare(right, 'en'))
    .map((pathname) => new URL(pathname, origin).href);

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join('\n');
}

export function createRobots(origin: string = siteMetadata.origin): string {
  return [
    'User-agent: *',
    'Allow: /',
    'Disallow: /~demos/',
    '',
    `Sitemap: ${new URL('/sitemap.xml', origin).href}`,
    '',
  ].join('\n');
}
