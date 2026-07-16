import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { auditStandaloneBundleIsolation, finalizeDocumentationBuild } from './finalizeBuild';

it('runs 404, Pagefind, metadata, audit, and atomic promotion in order', async () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-finalize-order-'));
  const client = path.resolve(root, 'build/client');
  const output = path.resolve(root, 'dist');
  const events: string[] = [];
  mkdirSync(client, { recursive: true });
  writeFileSync(path.resolve(client, 'index.html'), '<h1>Lobe UI</h1>');
  writeFileSync(path.resolve(client, '__spa-fallback.html'), '<div id="app"></div>');
  mkdirSync(path.resolve(client, '404'), { recursive: true });
  writeFileSync(
    path.resolve(client, '404/index.html'),
    '<title>Documentation not found</title><meta name="robots" content="noindex">',
  );
  writeFileSync(path.resolve(client, 'index.data'), 'route payload');
  mkdirSync(output, { recursive: true });
  writeFileSync(path.resolve(output, 'previous.txt'), 'previous dist');

  try {
    await finalizeDocumentationBuild(
      { clientDirectory: client, outputDirectory: output, repositoryRoot: root },
      {
        auditArtifact: (options) => {
          events.push('audit');
          expect(readFileSync(path.resolve(options.outputDirectory, '404.html'), 'utf8')).toContain(
            'Documentation not found',
          );
          expect(
            readFileSync(path.resolve(options.outputDirectory, 'sitemap.xml'), 'utf8'),
          ).toContain('https://ui.lobehub.com/');
          expect(
            readFileSync(path.resolve(options.outputDirectory, 'robots.txt'), 'utf8'),
          ).toContain('Disallow: /~demos/');
          expect(
            readFileSync(path.resolve(options.outputDirectory, 'pagefind/pagefind.js'), 'utf8'),
          ).toContain('search');
          expect(readFileSync(path.resolve(options.outputDirectory, 'index.data'), 'utf8')).toBe(
            'route payload',
          );
          expect(readFileSync(path.resolve(output, 'previous.txt'), 'utf8')).toBe('previous dist');
          return { diagnostics: [], migrated: 0, phase: 'complete', total: 0 };
        },
        buildSearchIndex: async ({ outputDirectory }) => {
          events.push('pagefind');
          mkdirSync(outputDirectory, { recursive: true });
          writeFileSync(
            path.resolve(outputDirectory, 'pagefind.js'),
            'export const search = true;',
          );
          writeFileSync(path.resolve(outputDirectory, 'index.pf_index'), 'index');
        },
        compatibility: { demoReferences: [], documents: [] },
        documents: [
          {
            description: 'Home.',
            pathname: '/',
            source: 'docs/index.mdx',
            title: 'Home',
          },
        ],
        expectedStandalonePaths: [],
      },
    );

    expect(events).toEqual(['pagefind', 'audit']);
    expect(readFileSync(path.resolve(output, 'index.html'), 'utf8')).toContain('Lobe UI');
    expect(readFileSync(path.resolve(output, '__spa-fallback.html'), 'utf8')).toContain('app');
    expect(readFileSync(path.resolve(output, '404.html'), 'utf8')).toContain(
      'Documentation not found',
    );
    expect(readFileSync(path.resolve(output, 'index.data'), 'utf8')).toBe('route payload');
    expect(() => readFileSync(path.resolve(output, 'previous.txt'), 'utf8')).toThrow();
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('preserves the previous dist when Pagefind generation fails', async () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-finalize-failure-'));
  const client = path.resolve(root, 'client');
  const output = path.resolve(root, 'dist');
  mkdirSync(path.resolve(client, '404'), { recursive: true });
  mkdirSync(output, { recursive: true });
  writeFileSync(path.resolve(client, 'index.html'), '<h1>new</h1>');
  writeFileSync(path.resolve(client, '__spa-fallback.html'), '<div>fallback</div>');
  writeFileSync(path.resolve(client, '404/index.html'), '<h1>not found</h1>');
  writeFileSync(path.resolve(output, 'index.html'), '<h1>previous</h1>');

  try {
    await expect(
      finalizeDocumentationBuild(
        { clientDirectory: client, outputDirectory: output, repositoryRoot: root },
        {
          buildSearchIndex: async () => {
            throw new Error('Pagefind failed');
          },
          compatibility: { demoReferences: [], documents: [] },
          documents: [],
          expectedStandalonePaths: [],
        },
      ),
    ).rejects.toThrow(/Pagefind failed/);
    expect(readFileSync(path.resolve(output, 'index.html'), 'utf8')).toContain('previous');
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

const createAtomicFixture = () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-finalize-atomic-'));
  const clientDirectory = path.resolve(root, 'client');
  const outputDirectory = path.resolve(root, 'dist');
  mkdirSync(path.resolve(clientDirectory, '404'), { recursive: true });
  mkdirSync(outputDirectory, { recursive: true });
  writeFileSync(path.resolve(clientDirectory, 'index.html'), '<h1>new</h1>');
  writeFileSync(path.resolve(clientDirectory, '__spa-fallback.html'), '<div>fallback</div>');
  writeFileSync(path.resolve(clientDirectory, '404/index.html'), '<h1>not found</h1>');
  writeFileSync(path.resolve(outputDirectory, 'index.html'), '<h1>previous</h1>');
  return { clientDirectory, outputDirectory, root };
};

const atomicDependencies = {
  auditArtifact: () => ({ diagnostics: [], migrated: 0, phase: 'complete' as const, total: 0 }),
  buildSearchIndex: async ({ outputDirectory }: { outputDirectory: string }) => {
    mkdirSync(outputDirectory, { recursive: true });
  },
  compatibility: { demoReferences: [], documents: [] },
  documents: [],
  expectedStandalonePaths: [],
};

it('preserves the previous dist when artifact audit fails', async () => {
  const fixture = createAtomicFixture();
  try {
    await expect(
      finalizeDocumentationBuild(
        { ...fixture, repositoryRoot: fixture.root },
        {
          ...atomicDependencies,
          auditArtifact: () => {
            throw new Error('audit failed');
          },
        },
      ),
    ).rejects.toThrow(/audit failed/);
    expect(readFileSync(path.resolve(fixture.outputDirectory, 'index.html'), 'utf8')).toContain(
      'previous',
    );
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});

it('cleans the temporary stage when manifest-derived inputs fail before copying', async () => {
  const fixture = createAtomicFixture();
  const duplicateDemo = {
    document: 'src/Button/index.md',
    legacyId: 'duplicate',
    legacyRouteId: 'demo/one',
    options: { inline: false, isolated: true, layout: 'default' as const },
    pathname: '/components/button',
    source: 'src/Button/demo/one.tsx',
  };

  try {
    await expect(
      finalizeDocumentationBuild(
        { ...fixture, repositoryRoot: fixture.root },
        {
          compatibility: {
            demoReferences: [
              duplicateDemo,
              { ...duplicateDemo, legacyRouteId: 'demo/two', source: 'src/Button/demo/two.tsx' },
            ],
            documents: [],
          },
          documents: [],
        },
      ),
    ).rejects.toThrow(/duplicate standalone demo id/i);
    expect(readdirSync(fixture.root).filter((name) => name.includes('dist-stage-'))).toEqual([]);
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});

it('restores the previous dist when promotion fails', async () => {
  const fixture = createAtomicFixture();
  let renameCalls = 0;
  try {
    await expect(
      finalizeDocumentationBuild(
        { ...fixture, repositoryRoot: fixture.root },
        {
          ...atomicDependencies,
          fileSystem: {
            remove: rmSync,
            rename(source, destination) {
              renameCalls += 1;
              if (renameCalls === 2) throw new Error('promotion rename failed');
              renameSync(source, destination);
            },
          },
        },
      ),
    ).rejects.toThrow(/promotion rename failed/);
    expect(readFileSync(path.resolve(fixture.outputDirectory, 'index.html'), 'utf8')).toContain(
      'previous',
    );
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});

it('retains the only previous artifact outside staging when promotion and rollback both fail', async () => {
  const fixture = createAtomicFixture();
  let renameCalls = 0;
  try {
    await expect(
      finalizeDocumentationBuild(
        { ...fixture, repositoryRoot: fixture.root },
        {
          ...atomicDependencies,
          fileSystem: {
            remove: rmSync,
            rename(source, destination) {
              renameCalls += 1;
              if (renameCalls >= 2) throw new Error(`rename failed ${renameCalls}`);
              renameSync(source, destination);
            },
          },
        },
      ),
    ).rejects.toThrow(/rollback[\s\S]*previous artifact retained/i);

    const backup = readdirSync(fixture.root).find((name) => name.includes('dist-previous'));
    expect(backup).toBeTruthy();
    expect(readFileSync(path.resolve(fixture.root, backup!, 'index.html'), 'utf8')).toContain(
      'previous',
    );
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});

it('keeps the promoted artifact successful when temporary cleanup fails', async () => {
  const fixture = createAtomicFixture();
  const cleanupErrors: string[] = [];
  try {
    await finalizeDocumentationBuild(
      { ...fixture, repositoryRoot: fixture.root },
      {
        ...atomicDependencies,
        fileSystem: {
          remove() {
            throw new Error('cleanup failed');
          },
          rename: renameSync,
        },
        onCleanupError: (error) => cleanupErrors.push(String(error)),
      },
    );

    expect(readFileSync(path.resolve(fixture.outputDirectory, 'index.html'), 'utf8')).toContain(
      'new',
    );
    expect(cleanupErrors).toEqual([expect.stringContaining('cleanup failed')]);
  } finally {
    rmSync(fixture.root, { force: true, recursive: true });
  }
});

it('audits actual standalone HTML preloads without rejecting shared runtime chunks', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-standalone-pass-'));
  const assets = path.resolve(root, 'assets');
  const standalone = path.resolve(root, '~demos/example');
  mkdirSync(assets, { recursive: true });
  mkdirSync(standalone, { recursive: true });
  writeFileSync(path.resolve(assets, 'runtime.js'), 'export const runtime = true;');
  writeFileSync(path.resolve(assets, 'standalone.js'), 'export const standalone = true;');
  writeFileSync(
    path.resolve(standalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/runtime.js"><link rel="modulepreload" href="/assets/standalone.js">',
  );

  try {
    expect(() => auditStandaloneBundleIsolation(root)).not.toThrow();
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('rejects a standalone artifact that preloads documentation chrome', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-standalone-fail-'));
  const assets = path.resolve(root, 'assets');
  const standalone = path.resolve(root, '~demos/example');
  mkdirSync(assets, { recursive: true });
  mkdirSync(standalone, { recursive: true });
  writeFileSync(
    path.resolve(assets, 'docs-shell.js'),
    'export const label = "Skip to documentation";',
  );
  writeFileSync(
    path.resolve(standalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/docs-shell.js">',
  );

  try {
    expect(() => auditStandaloneBundleIsolation(root)).toThrow(/documentation chrome/i);
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('reports every documentation dependency with its standalone entry point', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-standalone-aggregate-'));
  const assets = path.resolve(root, 'assets');
  const standalone = path.resolve(root, '~demos/example');
  mkdirSync(assets, { recursive: true });
  mkdirSync(standalone, { recursive: true });
  writeFileSync(
    path.resolve(assets, 'docs-shell-a.js'),
    'export const label = "Open documentation navigation";',
  );
  writeFileSync(
    path.resolve(assets, 'docs-shell-b.js'),
    'export const label = "Search documentation";',
  );
  writeFileSync(
    path.resolve(standalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/docs-shell-a.js"><link rel="modulepreload" href="/assets/docs-shell-b.js">',
  );

  try {
    expect(() => auditStandaloneBundleIsolation(root)).toThrow(
      /~demos\/example\/index\.html[\s\S]*docs-shell-a\.js[\s\S]*docs-shell-b\.js/i,
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('retains a dependency chain for every standalone page that shares an asset', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-standalone-cache-'));
  const assets = path.resolve(root, 'assets');
  const firstStandalone = path.resolve(root, '~demos/first');
  const secondStandalone = path.resolve(root, '~demos/second');
  mkdirSync(assets, { recursive: true });
  mkdirSync(firstStandalone, { recursive: true });
  mkdirSync(secondStandalone, { recursive: true });
  writeFileSync(
    path.resolve(assets, 'docs-shell.js'),
    'export const label = "Search documentation";',
  );
  writeFileSync(
    path.resolve(firstStandalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/docs-shell.js">',
  );
  writeFileSync(
    path.resolve(secondStandalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/docs-shell.js">',
  );
  try {
    let message = '';
    try {
      auditStandaloneBundleIsolation(root);
    } catch (error) {
      message = error instanceof Error ? error.message : String(error);
    }

    expect(message).toContain('~demos/first/index.html');
    expect(message).toContain('~demos/second/index.html');
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('rejects a marker-free docs layout reached through transitive static imports', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-standalone-transitive-'));
  const assets = path.resolve(root, 'assets');
  const standalone = path.resolve(root, '~demos/example');
  mkdirSync(assets, { recursive: true });
  mkdirSync(standalone, { recursive: true });
  writeFileSync(path.resolve(assets, 'entry.js'), 'import "./shared.js";');
  writeFileSync(
    path.resolve(assets, 'shared.js'),
    'export { docsRoute } from "./docs-layout-ABCD1234.js";',
  );
  writeFileSync(path.resolve(assets, 'docs-layout-ABCD1234.js'), 'export const docsRoute = true;');
  writeFileSync(
    path.resolve(standalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/entry.js">',
  );

  try {
    expect(() => auditStandaloneBundleIsolation(root)).toThrow(
      /entry\.js.*shared\.js.*docs-layout-ABCD1234\.js/i,
    );
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});

it('does not treat dynamic docs imports as initial-load dependencies', () => {
  const root = mkdtempSync(path.resolve(tmpdir(), 'lobe-ui-standalone-dynamic-'));
  const assets = path.resolve(root, 'assets');
  const standalone = path.resolve(root, '~demos/example');
  mkdirSync(assets, { recursive: true });
  mkdirSync(standalone, { recursive: true });
  writeFileSync(
    path.resolve(assets, 'entry.js'),
    'export const loadDocs = () => import("./docs-layout-lazy.js");',
  );
  writeFileSync(path.resolve(assets, 'docs-layout-lazy.js'), 'export const docs = true;');
  writeFileSync(
    path.resolve(standalone, 'index.html'),
    '<link rel="modulepreload" href="/assets/entry.js">',
  );

  try {
    expect(() => auditStandaloneBundleIsolation(root)).not.toThrow();
  } finally {
    rmSync(root, { force: true, recursive: true });
  }
});
