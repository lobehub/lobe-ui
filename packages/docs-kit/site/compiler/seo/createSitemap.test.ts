import { createRobots, createSitemap } from './createSitemap';

it('creates a sorted deduplicated absolute sitemap and excludes non-document routes', () => {
  const sitemap = createSitemap([
    '/components/zeta',
    '/~demos/src-button-demo-demos',
    '/components/alpha/',
    '/404',
    '/',
    '/components/alpha',
    '/__spa-fallback.html',
  ]);

  expect(sitemap).toContain('<loc>https://ui.lobehub.com/</loc>');
  expect(sitemap).toContain('<loc>https://ui.lobehub.com/components/alpha</loc>');
  expect(sitemap).toContain('<loc>https://ui.lobehub.com/components/zeta</loc>');
  expect(sitemap.match(/components\/alpha/g)).toHaveLength(1);
  expect(sitemap).not.toContain('~demos');
  expect(sitemap).not.toContain('/404');
  expect(sitemap).not.toContain('__spa-fallback');
  expect(sitemap.indexOf('/components/alpha')).toBeLessThan(sitemap.indexOf('/components/zeta'));
});

it('escapes XML-significant URL characters', () => {
  const sitemap = createSitemap(['/components/a&b']);

  expect(sitemap).toContain('/components/a&amp;b');
  expect(sitemap).not.toContain('/components/a&b</loc>');
});

it('generates robots directives that keep demos out of crawling and advertise the sitemap', () => {
  expect(createRobots()).toBe(
    [
      'User-agent: *',
      'Allow: /',
      'Disallow: /~demos/',
      '',
      'Sitemap: https://ui.lobehub.com/sitemap.xml',
      '',
    ].join('\n'),
  );
});

it('uses the supplied origin consistently while normalizing absolute inputs', () => {
  const sitemap = createSitemap(
    ['https://docs.example.com/components/button'],
    'https://docs.example.com',
  );

  expect(sitemap).toContain('https://docs.example.com/components/button');
  expect(sitemap).not.toContain('https://ui.lobehub.com');
});
