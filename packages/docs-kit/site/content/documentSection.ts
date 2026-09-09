const namespaceSectionLabels: Record<string, string> = {
  'awesome': 'Awesome',
  'base-ui': 'Base UI',
  'brand': 'Brand',
  'chat': 'Chat',
  'color': 'Color',
  // Not a component namespace, so it is absent from `packageNamespaces`; adding
  // it there would make the directory scan treat it as one and change its route.
  'i18n': 'Hooks & Providers',
  'icons': 'Icons',
  'mdx': 'Mdx',
  'mobile': 'Mobile',
  'storybook': 'StoryBook',
};

const documentStem = (source: string): string =>
  source.replaceAll('\\', '/').replace(/\.mdx?$/, '');

export const deriveDocumentSection = (
  source: string,
  overrides: Record<string, string> = {},
): string => {
  const stem = documentStem(source);
  if (stem === 'docs/index') return 'Home';
  // `CHANGELOG.md` is the fallback a consumer gets without a docs/changelog page.
  if (stem === 'docs/changelog' || stem === 'CHANGELOG') return 'Changelog';
  if (stem.startsWith('docs/')) return 'Guides';

  const override = overrides[`${stem}.mdx`] ?? overrides[`${stem}.md`];
  if (override) return override;

  return namespaceSectionLabels[stem.split('/')[1]] ?? 'Components';
};
