import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { getDocsConfig } from '../../../src/config';
import { createContentManifest } from './createManifest';
import { defaultAtomDirs } from './discoverDocuments';

const fixtureRoot = path.resolve(import.meta.dirname, '../../../../../tests/fixtures/site/content');
const repositoryRoot = path.resolve(import.meta.dirname, '../../../../..');
const temporaryRoots: string[] = [];

const createManifestWithRepositoryConfig = (root: string) => {
  const config = getDocsConfig(repositoryRoot);
  return createContentManifest(root, config.atomDirs ?? defaultAtomDirs, config.navSections ?? {});
};

const createProjectFixture = (files: Record<string, string>): string => {
  const root = mkdtempSync(path.join(tmpdir(), 'lobe-ui-content-'));
  temporaryRoots.push(root);

  for (const [filePath, contents] of Object.entries(files)) {
    const absolutePath = path.resolve(root, filePath);
    mkdirSync(path.dirname(absolutePath), { recursive: true });
    writeFileSync(absolutePath, contents);
  }

  return root;
};

afterEach(() => {
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('content manifest', () => {
  it('derives stable paths and navigation from MDX frontmatter', () => {
    const root = createProjectFixture({
      'src/Button/index.mdx': readFileSync(path.resolve(fixtureRoot, 'valid.mdx'), 'utf8'),
    });
    const manifest = createManifestWithRepositoryConfig(root);

    expect(manifest.documents[0]).toMatchObject({
      category: 'General',
      pathname: '/components/button',
      title: 'Button',
    });
    expect(manifest.navigation).toHaveLength(1);
    expect(manifest.navigation[0]?.title).toBe('Components');
    expect(manifest.navigation[0]?.categories[0]?.title).toBe('General');
    expect(manifest.navigation[0]?.categories[0]?.documents[0]?.pathname).toBe(
      '/components/button',
    );
  });

  it('reports every invalid field in one actionable diagnostic set', () => {
    expect(() =>
      createManifestWithRepositoryConfig(path.resolve(fixtureRoot, 'invalid.mdx')),
    ).toThrow(/invalid\.mdx[\s\S]*description[\s\S]*category[\s\S]*status/);
  });

  it('discovers only public MDX documents and excludes internal specifications', () => {
    const root = createProjectFixture({
      'docs/changelog.mdx': '---\ntitle: Changelog\ndescription: Release history.\n---\n',
      'docs/index.mdx': '---\ntitle: Home\ndescription: Documentation home.\n---\n',
      'docs/superpowers/internal.mdx': '---\ntitle: Internal\n---\n',
      'src/Button/index.mdx':
        '---\ntitle: Button\ndescription: Triggers actions.\ncategory: General\n---\n',
    });

    const manifest = createManifestWithRepositoryConfig(root);

    expect(manifest.documents).toHaveLength(3);
    expect(manifest.documents.some(({ pathname }) => pathname === '/')).toBe(true);
    expect(manifest.documents.some(({ pathname }) => pathname === '/changelog')).toBe(true);
    expect(manifest.documents.some(({ pathname }) => pathname === '/components/button')).toBe(true);
    expect(manifest.documents.some(({ source }) => source.includes('superpowers'))).toBe(false);
  });

  it('falls back to a root CHANGELOG.md when docs/changelog.mdx is absent', () => {
    const root = createProjectFixture({
      'CHANGELOG.md': '# 1.0.0\n\n- Initial release.\n',
      'docs/index.mdx': '---\ntitle: Home\ndescription: Documentation home.\n---\n',
      'src/Button/index.mdx':
        '---\ntitle: Button\ndescription: Triggers actions.\ncategory: General\n---\n',
    });

    const manifest = createManifestWithRepositoryConfig(root);
    const changelog = manifest.documents.find(({ pathname }) => pathname === '/changelog');

    expect(changelog).toMatchObject({ source: 'CHANGELOG.md', title: 'Changelog' });
  });

  it('prefers docs/changelog.mdx over a root CHANGELOG.md when both exist', () => {
    const root = createProjectFixture({
      'CHANGELOG.md': '# 1.0.0\n\n- Initial release.\n',
      'docs/changelog.mdx': '---\ntitle: Changelog\ndescription: Release history.\n---\n',
      'docs/index.mdx': '---\ntitle: Home\ndescription: Documentation home.\n---\n',
    });

    const manifest = createManifestWithRepositoryConfig(root);
    const changelog = manifest.documents.find(({ pathname }) => pathname === '/changelog');

    expect(changelog).toMatchObject({ source: 'docs/changelog.mdx' });
  });

  it('canonicalizes a trailing slash in an explicit component route', () => {
    const root = createProjectFixture({
      'src/Button/index.mdx': `---
title: Foo
description: Foo component.
category: General
route: /components/foo/
---
`,
    });

    const [document] = createManifestWithRepositoryConfig(root).documents;

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

    expect(() => createManifestWithRepositoryConfig(root)).toThrow(
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

    expect(() => createManifestWithRepositoryConfig(root)).toThrow(
      /src\/Guide\/index\.mdx[\s\S]*route "\/guides\/foo"[\s\S]*"\/components\/"/i,
    );
  });

  it('aggregates source-qualified diagnostics for non-pathname route syntax', () => {
    const root = createProjectFixture({
      'src/DotSegment/index.mdx': `---
title: Dot Segment
description: Dot segment route.
category: General
route: /components/a/../b
---
`,
      'src/Hash/index.mdx': `---
title: Hash
description: Hash route.
category: General
route: /components/foo#section
---
`,
      'src/Query/index.mdx': `---
title: Query
description: Query route.
category: General
route: /components/foo?preview=1
---
`,
    });

    let diagnostic = '';
    try {
      createManifestWithRepositoryConfig(root);
    } catch (error) {
      diagnostic = error instanceof Error ? error.message : String(error);
    }

    expect(diagnostic).toMatch(/src\/DotSegment\/index\.mdx[\s\S]*dot segment/i);
    expect(diagnostic).toMatch(/src\/Hash\/index\.mdx[\s\S]*hash fragment/i);
    expect(diagnostic).toMatch(/src\/Query\/index\.mdx[\s\S]*query string/i);
  });

  it('preserves a valid encoded legacy segment while canonicalizing its trailing slash', () => {
    const root = createProjectFixture({
      'src/Button/index.mdx': `---
title: Encoded
description: Encoded legacy route.
category: General
route: /components/legacy%20button/
---
`,
    });

    const [document] = createManifestWithRepositoryConfig(root).documents;

    expect(document.pathname).toBe('/components/legacy%20button');
  });

  it('aggregates malformed network paths with independent document errors', () => {
    const root = createProjectFixture({
      'src/AANetworkEmpty/index.mdx': `---
title: Empty Network Path
description: Empty network path route.
category: General
route: //
---
`,
      'src/ABNetworkMalformed/index.mdx': `---
title: Malformed Network Path
description: Malformed network path route.
category: General
route: //[
---
`,
      'src/ZIndependent/index.mdx': `---
title: Independent Invalid Document
---
`,
    });

    let diagnostic = '';
    try {
      createManifestWithRepositoryConfig(root);
    } catch (error) {
      diagnostic = error instanceof Error ? error.message : String(error);
    }

    expect(diagnostic).toMatch(/src\/AANetworkEmpty\/index\.mdx[\s\S]*network-path/i);
    expect(diagnostic).toMatch(/src\/ABNetworkMalformed\/index\.mdx[\s\S]*network-path/i);
    expect(diagnostic).toMatch(/src\/ZIndependent\/index\.mdx[\s\S]*description[\s\S]*category/i);
  });
});
