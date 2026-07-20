import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import type { DocumentManifestEntry } from '../../types/content';
import type { DocumentationInventory } from '../types';
import { extractManifestDemoReferences } from './extractDemoReferences';
import { getStandaloneDemoPaths, readLegacyMap } from './readLegacyMap';

const temporaryRoots: string[] = [];

const createRoot = (): string => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-demo-refs-'));
  temporaryRoots.push(root);
  return root;
};

const write = (root: string, file: string, source: string): void => {
  const absolutePath = path.resolve(root, file);
  mkdirSync(path.dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, source);
};

const documentEntry = (source: string, pathname: string): DocumentManifestEntry => ({
  description: 'Test document.',
  pathname,
  source,
  title: 'Test',
});

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('extractManifestDemoReferences', () => {
  it('derives canonical references from mdx ?demo imports', () => {
    const root = createRoot();
    write(root, 'src/base-ui/Radio/demos/index.tsx', 'export default () => null;');
    write(
      root,
      'src/base-ui/Radio/index.mdx',
      [
        '---',
        'title: Radio',
        '---',
        '',
        "import DemoIndex from './demos/index.tsx?demo';",
        '',
        '<Demo of={DemoIndex} />',
      ].join('\n'),
    );

    const references = extractManifestDemoReferences(root, [
      documentEntry('src/base-ui/Radio/index.mdx', '/components/base-ui/radio'),
    ]);

    expect(references).toEqual([
      {
        canonicalId: 'src-base-ui-radio-demos-index',
        document: 'src/base-ui/Radio/index.mdx',
        pathname: '/components/base-ui/radio',
        source: 'src/base-ui/Radio/demos/index.tsx',
      },
    ]);
  });

  it('ignores imports inside fenced code blocks and duplicate imports', () => {
    const root = createRoot();
    write(root, 'src/Widget/demos/index.tsx', 'export default () => null;');
    write(
      root,
      'src/Widget/index.mdx',
      [
        '---',
        'title: Widget',
        '---',
        '',
        "import DemoIndex from './demos/index.tsx?demo';",
        "import DemoAgain from './demos/index.tsx?demo';",
        '',
        '```tsx',
        "import Fenced from './demos/missing.tsx?demo';",
        '```',
      ].join('\n'),
    );

    const references = extractManifestDemoReferences(root, [
      documentEntry('src/Widget/index.mdx', '/components/widget'),
    ]);

    expect(references.map(({ source }) => source)).toEqual(['src/Widget/demos/index.tsx']);
  });

  it('throws when a referenced demo source is missing', () => {
    const root = createRoot();
    write(
      root,
      'src/Widget/index.mdx',
      ['---', 'title: Widget', '---', '', "import DemoIndex from './demos/index.tsx?demo';"].join(
        '\n',
      ),
    );

    expect(() =>
      extractManifestDemoReferences(root, [
        documentEntry('src/Widget/index.mdx', '/components/widget'),
      ]),
    ).toThrow(/Missing demo source/);
  });

  it('skips non-mdx documents', () => {
    const root = createRoot();
    write(root, 'CHANGELOG.md', "import Fake from './demos/index.tsx?demo';");

    expect(
      extractManifestDemoReferences(root, [documentEntry('CHANGELOG.md', '/changelog')]),
    ).toEqual([]);
  });
});

describe('standalone demo map with manifest references', () => {
  const emptyInventory: DocumentationInventory = { demoReferences: [], documents: [] };

  it('registers canonical routes for mdx-born demos without frozen records', () => {
    const entries = readLegacyMap(emptyInventory, [
      { pathname: '/components/base-ui/radio', source: 'src/base-ui/Radio/demos/index.tsx' },
    ]);

    expect(entries).toEqual([
      {
        canonicalId: 'src-base-ui-radio-demos-index',
        id: 'src-base-ui-radio-demos-index',
        kind: 'canonical',
        pathname: '/components/base-ui/radio',
        sourcePath: 'src/base-ui/Radio/demos/index.tsx',
      },
    ]);
    expect(
      getStandaloneDemoPaths(emptyInventory, [
        { pathname: '/components/base-ui/radio', source: 'src/base-ui/Radio/demos/index.tsx' },
      ]),
    ).toContain('/~demos/src-base-ui-radio-demos-index');
  });

  it('merges manifest references with frozen legacy aliases without duplication', () => {
    const inventory: DocumentationInventory = {
      demoReferences: [
        {
          document: 'src/Button/index.mdx',
          legacyId: 'button-demo-demos',
          legacyRouteId: 'components/Button/index',
          options: { inline: false, isolated: false, layout: 'bare' },
          pathname: '/components/button',
          source: 'src/Button/demos/index.tsx',
        },
      ],
      documents: [],
    };

    const entries = readLegacyMap(inventory, [
      { pathname: '/components/button', source: 'src/Button/demos/index.tsx' },
    ]);

    expect(entries.map(({ id }) => id).toSorted()).toEqual([
      'button-demo-demos',
      'src-button-demos-index',
    ]);
  });

  it('rejects canonical id collisions across different sources', () => {
    expect(() =>
      readLegacyMap(emptyInventory, [
        { source: 'src/Widget/demos/index.tsx' },
        { source: 'src/widget/demos/index.tsx' },
      ]),
    ).toThrow(/Canonical standalone demo id collision/);
  });
});
