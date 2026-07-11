import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { createContentManifest } from './createManifest';

const fixtureRoot = resolve(import.meta.dirname, '../../../tests/fixtures/site/content');
const temporaryRoots: string[] = [];

const createProjectFixture = (files: Record<string, string>): string => {
  const root = mkdtempSync(join(tmpdir(), 'lobe-ui-content-'));
  temporaryRoots.push(root);

  for (const [path, contents] of Object.entries(files)) {
    const absolutePath = resolve(root, path);
    mkdirSync(dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents);
  }

  return root;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('content manifest', () => {
  it('derives stable paths and navigation from MDX frontmatter', () => {
    const manifest = createContentManifest(resolve(fixtureRoot, 'valid.mdx'));

    expect(manifest.documents[0]).toMatchObject({
      category: 'General',
      pathname: '/components/button',
      title: 'Button',
    });
    expect(manifest.navigation).toHaveLength(1);
    expect(manifest.navigation[0]?.title).toBe('General');
    expect(manifest.navigation[0]?.documents[0]?.pathname).toBe('/components/button');
  });

  it('reports every invalid field in one actionable diagnostic set', () => {
    expect(() => createContentManifest(resolve(fixtureRoot, 'invalid.mdx'))).toThrow(
      /invalid\.mdx[\s\S]*description[\s\S]*category[\s\S]*status/,
    );
  });

  it('discovers only public MDX documents and excludes internal specifications', () => {
    const root = createProjectFixture({
      'docs/changelog.mdx': '---\ntitle: Changelog\ndescription: Release history.\n---\n',
      'docs/index.mdx': '---\ntitle: Home\ndescription: Documentation home.\n---\n',
      'docs/superpowers/internal.mdx': '---\ntitle: Internal\n---\n',
      'src/Button/index.mdx':
        '---\ntitle: Button\ndescription: Triggers actions.\ncategory: General\n---\n',
    });

    const manifest = createContentManifest(root);

    expect(manifest.documents).toHaveLength(3);
    expect(manifest.documents.some(({ pathname }) => pathname === '/')).toBe(true);
    expect(manifest.documents.some(({ pathname }) => pathname === '/changelog')).toBe(true);
    expect(manifest.documents.some(({ pathname }) => pathname === '/components/button')).toBe(true);
    expect(manifest.documents.some(({ source }) => source.includes('superpowers'))).toBe(false);
  });

  it('canonicalizes a trailing slash in an explicit component route', () => {
    const root = createProjectFixture({
      'src/Foo/index.mdx': `---
title: Foo
description: Foo component.
category: General
route: /components/foo/
---
`,
    });

    const [document] = createContentManifest(root).documents;

    expect(document.pathname).toBe('/components/foo');
  });

  it('reports both sources when routes collide after canonicalization', () => {
    const root = createProjectFixture({
      'src/Foo/index.mdx': `---
title: Foo
description: Foo component.
category: General
route: /components/foo
---
`,
      'src/LegacyFoo/index.mdx': `---
title: Legacy Foo
description: Legacy Foo component.
category: General
route: /components/foo/
---
`,
    });

    expect(() => createContentManifest(root)).toThrow(
      /duplicate documentation pathname[\s\S]*src\/Foo\/index\.mdx[\s\S]*src\/LegacyFoo\/index\.mdx/i,
    );
  });

  it('reports an explicit route outside the registered component surface', () => {
    const root = createProjectFixture({
      'src/Guide/index.mdx': `---
title: Guide
description: Guide component.
category: General
route: /guides/foo
---
`,
    });

    expect(() => createContentManifest(root)).toThrow(
      /src\/Guide\/index\.mdx[\s\S]*route "\/guides\/foo"[\s\S]*"\/components\/"/i,
    );
  });
});
