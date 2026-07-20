import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { getDocsConfig } from '../../src/config';
import { buildDocumentationInventory, deriveAtomIdFromPaths } from './inventory';
import type { DocumentationInventory } from './types';

const realRoot = resolve(import.meta.dirname, '../../../..');
const realConfig = getDocsConfig(realRoot);
const buildRealInventory = (): DocumentationInventory =>
  buildDocumentationInventory(realRoot, {
    atomDirs: realConfig.atomDirs,
    legacyRedirects: realConfig.legacyRedirects,
    navSections: realConfig.navSections,
    publicDocs: realConfig.publicDocs,
  });

const temporaryRoots: string[] = [];

const createFixture = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'lobe-ui-docs-inventory-'));
  temporaryRoots.push(root);

  const fixtureFiles = {
    'docs/changelog.md': '---\ntitle: Changelog\n---\n',
    'docs/index.md': '---\ntitle: Home\n---\n',
    ...files,
  };

  for (const [path, contents] of Object.entries(fixtureFiles)) {
    const absolutePath = resolve(root, path);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents);
  }

  return root;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('documentation inventory', () => {
  it('infers the deepest atom namespace from Windows paths', () => {
    expect(
      deriveAtomIdFromPaths(
        ['C:\\repo\\src', 'C:\\repo\\src\\storybook'],
        'C:\\repo\\src\\storybook\\StoryBook\\index.tsx',
      ),
    ).toBe('StoryBook');
  });

  it('selects public source docs while excluding internal specifications', () => {
    const inventory = buildRealInventory();

    expect(inventory.documents).toHaveLength(166);
    expect(inventory.demoReferences).toHaveLength(525);
    expect(inventory.documents.some(({ source }) => source.includes('/superpowers/'))).toBe(false);
  });

  it('preserves duplicate-source demos as separate legacy aliases', () => {
    const inventory = buildRealInventory();
    const aliases = inventory.demoReferences.filter(
      ({ source }) => source === 'src/DropdownMenu/demos/index.tsx',
    );

    expect(aliases.length).toBeGreaterThan(1);
    expect(new Set(aliases.map(({ legacyId }) => legacyId)).size).toBe(aliases.length);
  });

  it('inherits frozen demo aliases when a public document migrates to MDX', () => {
    const frozenInventory = {
      demoReferences: [
        {
          document: 'src/Fixture/index.md',
          legacyId: 'src-fixture-demo-primary',
          legacyRouteId: 'components/Fixture/index',
          options: {
            inline: false,
            isolated: true,
            layout: 'center',
          },
          pathname: '/components/fixture',
          source: 'src/Fixture/demos/index.tsx',
        },
      ],
      documents: [
        {
          category: 'General',
          legacyRouteId: 'components/Fixture/index',
          pathname: '/components/fixture',
          section: 'Components',
          source: 'src/Fixture/index.md',
          title: 'Fixture',
        },
      ],
    } satisfies DocumentationInventory;
    const root = createFixture({
      'src/Fixture/demos/index.tsx': '',
      'src/Fixture/index.mdx': `---
title: Fixture
description: Migrated fixture.
category: General
---

No legacy dumi code tag remains.
`,
    });

    const inventory = buildDocumentationInventory(root, { legacyRedirects: frozenInventory });
    const [alias] = inventory.demoReferences;

    expect(alias).toEqual({
      ...frozenInventory.demoReferences[0],
      document: 'src/Fixture/index.mdx',
    });
    expect(inventory.documents).toContainEqual({
      ...frozenInventory.documents[0],
      source: 'src/Fixture/index.mdx',
    });
  });

  it('fails when both Markdown document formats exist for one public source', () => {
    const root = createFixture({
      'src/Fixture/index.md': '---\ntitle: Fixture\n---\n',
      'src/Fixture/index.mdx': '---\ntitle: Fixture\n---\n',
    });

    expect(() => buildDocumentationInventory(root)).toThrow(
      /exactly one.*src\/Fixture\/index\.md.*src\/Fixture\/index\.mdx/i,
    );
  });

  it('fails when a frozen public document has neither Markdown format', () => {
    const frozenInventory = {
      demoReferences: [],
      documents: [
        {
          legacyRouteId: 'components/Missing/index',
          pathname: '/components/missing',
          section: 'Components',
          source: 'src/Missing/index.md',
        },
      ],
    } satisfies DocumentationInventory;
    const root = createFixture({
      'src/.keep': '',
    });

    expect(() => buildDocumentationInventory(root, { legacyRedirects: frozenInventory })).toThrow(
      /exactly one.*src\/Missing\/index\.md.*src\/Missing\/index\.mdx/i,
    );
  });

  it('associates each demo with its owning document pathname', () => {
    const root = createFixture({
      'src/Button/demos/index.tsx': '',
      'src/Button/index.md': '<code src="./demos/index.tsx"></code>',
    });

    const [demo] = buildDocumentationInventory(root).demoReferences;

    expect(demo.pathname).toBe('/components/button');
  });

  it('normalizes every supported demo presentation option', () => {
    const root = createFixture({
      'src/Fixture/demos/bare.tsx': '',
      'src/Fixture/demos/center.tsx': '',
      'src/Fixture/demos/default.tsx': '',
      'src/Fixture/demos/inline.tsx': '',
      'src/Fixture/demos/isolated.tsx': '',
      'src/Fixture/index.md': `---
nav: Components
group: General
title: Fixture
---

<code src="./demos/default.tsx"></code>
<code src="./demos/bare.tsx" noPadding></code>
<code src="./demos/center.tsx" center></code>
<code src="./demos/isolated.tsx" iframe nopadding></code>
<code src="./demos/inline.tsx" inline></code>
`,
    });

    const references = buildDocumentationInventory(root).demoReferences;
    const optionsBySource = Object.fromEntries(
      references.map(({ options, source }) => [source, options]),
    );

    expect(optionsBySource['src/Fixture/demos/default.tsx']).toEqual({
      inline: false,
      isolated: false,
      layout: 'default',
    });
    expect(optionsBySource['src/Fixture/demos/bare.tsx']).toEqual({
      inline: false,
      isolated: false,
      layout: 'bare',
    });
    expect(optionsBySource['src/Fixture/demos/center.tsx']).toEqual({
      inline: false,
      isolated: false,
      layout: 'center',
    });
    expect(optionsBySource['src/Fixture/demos/isolated.tsx']).toEqual({
      inline: false,
      isolated: true,
      layout: 'bare',
    });
    expect(optionsBySource['src/Fixture/demos/inline.tsx']).toEqual({
      inline: true,
      isolated: false,
      layout: 'default',
    });
  });

  it('preserves dumi route casing around numeric component names', () => {
    const root = createFixture({
      'src/brand/Logo3d/index.md': '---\ntitle: Logo3d\n---\n',
      'src/i18n/index.md': '---\ntitle: i18n\n---\n',
      'src/icons/Auth0/index.md': '---\ntitle: Auth0\n---\n',
    });

    const pathnames = buildDocumentationInventory(root).documents.map(({ pathname }) => pathname);

    expect(pathnames).toContain('/components/brand/logo3d');
    expect(pathnames).toContain('/components/i18n');
    expect(pathnames).toContain('/components/icons/auth0');
  });

  it('normalizes top-level sections from namespaces and public document roles', () => {
    const root = createFixture({
      'src/Button/index.md': '---\nnav: Components\ntitle: Button\n---\n',
      'src/base-ui/Button/index.md': '---\nnav: Components\ntitle: Button\n---\n',
      'src/i18n/index.md': '---\nnav: Hooks & Providers\ntitle: i18n\n---\n',
    });

    const sections = Object.fromEntries(
      buildDocumentationInventory(root, {
        navSections: { 'src/i18n/index.md': 'Hooks & Providers' },
      }).documents.map(({ section, source }) => [source, section]),
    );

    expect(sections['src/Button/index.md']).toBe('Components');
    expect(sections['src/base-ui/Button/index.md']).toBe('Base UI');
    expect(sections['src/i18n/index.md']).toBe('Hooks & Providers');
    expect(sections['docs/index.md']).toBe('Home');
    expect(sections['docs/changelog.md']).toBe('Changelog');
  });

  it('freezes explicitly configured public guides without discovering internal docs', () => {
    const root = createFixture({
      'docs/components.md': `---
title: Components
description: Component documentation index.
route: /components/
---
`,
      'docs/internal.md': '---\ntitle: Internal\n---\n',
      'src/Fixture/index.md': '---\ntitle: Fixture\n---\n',
    });

    const inventory = buildDocumentationInventory(root, {
      publicDocs: ['docs/components.mdx'],
    });

    expect(inventory.documents).toContainEqual({
      description: 'Component documentation index.',
      legacyRouteId: 'docs/components',
      pathname: '/components',
      section: 'Guides',
      source: 'docs/components.md',
      title: 'Components',
    });
    expect(inventory.documents.some(({ source }) => source === 'docs/internal.md')).toBe(false);
  });

  it('retains the home page description from its hero metadata', () => {
    const root = createFixture({
      'docs/index.md': `---
hero:
  title: LobeHub UI
  description: Documentation home
---
`,
      'src/Fixture/index.md': '---\ntitle: Fixture\n---\n',
    });

    const home = buildDocumentationInventory(root).documents.find(
      ({ pathname }) => pathname === '/',
    );

    expect(home?.description).toBe('Documentation home');
  });

  it('fails when a demo uses an unknown attribute', () => {
    const root = createFixture({
      'src/Fixture/demos/index.tsx': '',
      'src/Fixture/index.md': '<code src="./demos/index.tsx" unknown></code>',
    });

    expect(() => buildDocumentationInventory(root)).toThrow(/unknown demo attribute/i);
  });

  it('fails when a referenced demo source is missing', () => {
    const root = createFixture({
      'src/Fixture/index.md': '<code src="./demos/missing.tsx"></code>',
    });

    expect(() => buildDocumentationInventory(root)).toThrow(/missing demo source/i);
  });

  it('fails when distinct documents resolve to the same public pathname', () => {
    const root = createFixture({
      'src/FooBar/index.md': '---\ntitle: FooBar\n---\n',
      'src/foo_bar/index.md': '---\ntitle: Foo Bar\n---\n',
    });

    expect(() => buildDocumentationInventory(root)).toThrow(/duplicate documentation pathname/i);
  });

  it('fails when explicit aliases produce the same legacy demo ID', () => {
    const root = createFixture({
      'src/Fixture/demos/first.tsx': '',
      'src/Fixture/demos/second.tsx': '',
      'src/Fixture/index.md': `
<code src="./demos/first.tsx" id="shared"></code>
<code src="./demos/second.tsx" id="shared"></code>
`,
    });

    expect(() => buildDocumentationInventory(root)).toThrow(/duplicate legacy demo id/i);
  });
});
