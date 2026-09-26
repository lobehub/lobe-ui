import { collectNavItems, findActiveBranch, resolveActiveHref } from './active';

describe('resolveActiveHref', () => {
  const items = [
    { href: '/', icon: () => null, label: 'Home' },
    { href: '/resources', icon: () => null, label: 'Resources' },
    { href: '/resources/archive', icon: () => null, label: 'Archive' },
  ];

  it('picks the longest matching path', () => {
    expect(resolveActiveHref('/resources/archive/12', items)).toBe('/resources/archive');
    expect(resolveActiveHref('/resources', items)).toBe('/resources');
  });

  it('does not treat the root as a prefix of every path', () => {
    expect(resolveActiveHref('/resources', items)).not.toBe('/');
    expect(resolveActiveHref('/', items)).toBe('/');
  });
});

describe('nested groups', () => {
  const groups = [
    {
      groups: [
        {
          items: [{ href: '/docs/button', label: 'Button' }],
          key: 'docs/general',
          label: 'General',
        },
      ],
      href: '/sections/docs',
      items: [{ href: '/docs/intro', label: 'Intro' }],
      key: 'docs',
      label: 'Docs',
    },
    { items: [{ href: '/guides/start', label: 'Start' }], key: 'guides', label: 'Guides' },
  ];

  it('collects items at every depth', () => {
    expect(collectNavItems(groups).map((item) => item.href)).toEqual([
      '/docs/intro',
      '/docs/button',
      '/guides/start',
    ]);
  });

  it('returns the path of group keys to the active item', () => {
    expect(findActiveBranch('/docs/button', groups, '/docs/button')).toEqual([
      'docs',
      'docs/general',
    ]);
    expect(findActiveBranch('/docs/intro', groups, '/docs/intro')).toEqual(['docs']);
    expect(findActiveBranch('/guides/start', groups, '/guides/start')).toEqual(['guides']);
    expect(findActiveBranch('/elsewhere', groups, undefined)).toEqual([]);
  });

  it('treats a group overview page as inside the group', () => {
    expect(findActiveBranch('/sections/docs', groups, undefined)).toEqual(['docs']);
  });
});
