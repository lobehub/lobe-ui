import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { auditStandaloneBundleIsolation, finalizeDocumentationBuild } from './finalizeBuild';

it('stages the React Router client output at the root dist directory', () => {
  const root = path.resolve(import.meta.dirname, '__fixtures__/finalize');
  const client = path.resolve(root, 'build/client');
  const output = path.resolve(root, 'dist');
  mkdirSync(client, { recursive: true });
  writeFileSync(path.resolve(client, 'index.html'), '<h1>Lobe UI</h1>');
  writeFileSync(path.resolve(client, '__spa-fallback.html'), '<div id="app"></div>');

  finalizeDocumentationBuild({ clientDirectory: client, outputDirectory: output });

  expect(readFileSync(path.resolve(output, 'index.html'), 'utf8')).toContain('Lobe UI');
  expect(readFileSync(path.resolve(output, '__spa-fallback.html'), 'utf8')).toContain('app');
  expect(readFileSync(path.resolve(output, '404.html'), 'utf8')).toContain('app');
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
