import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { finalizeDocumentationBuild } from './finalizeBuild';

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
