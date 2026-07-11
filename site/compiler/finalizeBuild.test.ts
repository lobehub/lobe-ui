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
