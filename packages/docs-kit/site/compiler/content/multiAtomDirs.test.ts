import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { AtomDirConfig } from '../../../src/config';
import { buildDocumentationInventory } from '../inventory';
import { createContentManifest } from './createManifest';

const editorAtomDirs: AtomDirConfig[] = [
  { dir: 'src/react', subType: 'react' },
  { dir: 'src/plugins', subType: 'plugins' },
];

const homeNavSections: Record<string, string> = {
  'docs/changelog.mdx': 'Changelog',
  'docs/index.mdx': 'Home',
};

const temporaryRoots: string[] = [];

const writeFixtureFiles = (root: string, files: Record<string, string>): void => {
  for (const [relativePath, contents] of Object.entries(files)) {
    const absolutePath = path.resolve(root, relativePath);
    mkdirSync(path.dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents);
  }
};

const createTemporaryRoot = (): string => {
  const root = mkdtempSync(path.join(tmpdir(), 'lobe-ui-multi-atom-dirs-'));
  temporaryRoots.push(root);
  return root;
};

const createManifestFixture = (): string => {
  const root = createTemporaryRoot();
  writeFixtureFiles(root, {
    'docs/changelog.mdx': '---\ntitle: Changelog\ndescription: Release history.\n---\n',
    'docs/index.mdx': '---\ntitle: Home\ndescription: Documentation home.\n---\n',
    'src/plugins/Common/index.mdx': `---
title: Common
description: Shared plugin utilities.
category: General
---

Shared plugin utilities.
`,
    'src/react/Editor/index.mdx': `---
title: Editor
description: React editor surface.
category: General
---

React editor surface.
`,
  });
  return root;
};

const createInventoryFixture = (): string => {
  const root = createTemporaryRoot();
  writeFixtureFiles(root, {
    'docs/changelog.md': '---\ntitle: Changelog\n---\n',
    'docs/index.md': '---\ntitle: Home\n---\n',
    'src/plugins/Common/demos/index.tsx': 'export default () => null;\n',
    'src/plugins/Common/index.md': `---
title: Common
category: General
---

<code src="./demos/index.tsx"></code>
`,
    'src/react/Editor/demos/index.tsx': 'export default () => null;\n',
    'src/react/Editor/index.md': `---
title: Editor
category: General
---

<code src="./demos/index.tsx"></code>
`,
  });
  return root;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('multi-atomDir consumers', () => {
  it('routes each atomDir under its own /components/<subType>/<slug> segment', () => {
    const root = createManifestFixture();

    const manifest = createContentManifest(root, editorAtomDirs, homeNavSections);
    const pathnames = manifest.documents.map(({ pathname }) => pathname).toSorted();

    expect(pathnames).toEqual([
      '/',
      '/changelog',
      '/components/plugins/common',
      '/components/react/editor',
    ]);
  });

  it('tags manifest documents with their originating atomDir subType', () => {
    const root = createManifestFixture();

    const manifest = createContentManifest(root, editorAtomDirs, homeNavSections);
    const editor = manifest.documents.find(
      ({ pathname }) => pathname === '/components/react/editor',
    );
    const common = manifest.documents.find(
      ({ pathname }) => pathname === '/components/plugins/common',
    );

    expect(editor?.subType).toBe('react');
    expect(common?.subType).toBe('plugins');
  });

  it('groups navigation sections by subType without requiring a frozen navSections entry', () => {
    const root = createManifestFixture();

    const manifest = createContentManifest(root, editorAtomDirs, homeNavSections);
    const sectionTitles = manifest.navigation.map(({ title }) => title).toSorted();

    expect(sectionTitles).toEqual(['Plugins', 'React']);

    const reactSection = manifest.navigation.find(({ title }) => title === 'React');
    expect(reactSection?.categories[0]?.documents[0]?.pathname).toBe('/components/react/editor');

    const pluginsSection = manifest.navigation.find(({ title }) => title === 'Plugins');
    expect(pluginsSection?.categories[0]?.documents[0]?.pathname).toBe(
      '/components/plugins/common',
    );
  });

  it('keeps single-atomDir consumers routed without a subType segment', () => {
    const root = createTemporaryRoot();
    writeFixtureFiles(root, {
      'docs/changelog.mdx': '---\ntitle: Changelog\ndescription: Release history.\n---\n',
      'docs/index.mdx': '---\ntitle: Home\ndescription: Documentation home.\n---\n',
      'src/Editor/index.mdx': `---
title: Editor
description: A flat, unnested component.
category: General
---

A flat, unnested component.
`,
    });

    const manifest = createContentManifest(root, [{ dir: 'src' }], {
      ...homeNavSections,
      'src/Editor/index.mdx': 'Components',
    });
    const editor = manifest.documents.find(({ title }) => title === 'Editor');

    expect(editor?.pathname).toBe('/components/editor');
    expect(editor?.subType).toBeUndefined();
  });

  it('derives inventory pathnames and subType-qualified legacy route ids for each atomDir', () => {
    const root = createInventoryFixture();

    const inventory = buildDocumentationInventory(root, { atomDirs: editorAtomDirs });
    const editor = inventory.documents.find(
      ({ pathname }) => pathname === '/components/react/editor',
    );
    const common = inventory.documents.find(
      ({ pathname }) => pathname === '/components/plugins/common',
    );

    expect(editor?.legacyRouteId).toBe('components/react/Editor/index');
    expect(common?.legacyRouteId).toBe('components/plugins/Common/index');
  });

  it('resolves demo references to their subType-qualified document pathname', () => {
    const root = createInventoryFixture();

    const inventory = buildDocumentationInventory(root, { atomDirs: editorAtomDirs });
    const editorDemo = inventory.demoReferences.find(
      ({ source }) => source === 'src/react/Editor/demos/index.tsx',
    );
    const commonDemo = inventory.demoReferences.find(
      ({ source }) => source === 'src/plugins/Common/demos/index.tsx',
    );

    expect(editorDemo?.pathname).toBe('/components/react/editor');
    expect(commonDemo?.pathname).toBe('/components/plugins/common');
  });
});
