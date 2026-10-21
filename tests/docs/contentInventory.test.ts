// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { extractComponentApi } from '@lobehub/docs-kit/site/compiler/api/extractComponent';
import {
  extractImmutableImports,
  transformLiveSource,
} from '@lobehub/docs-kit/site/compiler/demo/liveTransform';
import { readLegacyMap } from '@lobehub/docs-kit/site/compiler/demo/readLegacyMap';
import { buildDocumentationInventory } from '@lobehub/docs-kit/site/compiler/inventory';
import { getPrerenderPaths } from '@lobehub/docs-kit/site/compiler/manifests';
import type { DocumentationInventory } from '@lobehub/docs-kit/site/compiler/types';
import { getDocsConfig } from '@lobehub/docs-kit/src/config';

import compatibility from '../../compatibility.json';

const repositoryRoot = resolve(import.meta.dirname, '../..');
const frozenInventory = compatibility as DocumentationInventory;

const buildInventory = (): DocumentationInventory => {
  const config = getDocsConfig(repositoryRoot);
  return buildDocumentationInventory(repositoryRoot, {
    atomDirs: config.atomDirs,
    legacyRedirects: config.legacyRedirects,
    navSections: config.navSections,
    publicDocs: config.publicDocs,
  });
};

describe('documentation inventory', () => {
  it('selects public source docs while excluding internal specifications', () => {
    const inventory = buildInventory();

    expect(inventory.documents.length).toBeGreaterThanOrEqual(166);
    expect(inventory.demoReferences.length).toBeGreaterThanOrEqual(460);
    expect(new Set(inventory.documents.map(({ pathname }) => pathname)).size).toBe(
      inventory.documents.length,
    );
    expect(new Set(inventory.demoReferences.map(({ legacyId }) => legacyId)).size).toBe(
      inventory.demoReferences.length,
    );
    expect(inventory.documents.some(({ source }) => source.includes('/superpowers/'))).toBe(false);
  });

  it('preserves duplicate-source demos as separate legacy aliases', () => {
    const aliases = buildInventory().demoReferences.filter(
      ({ source }) => source === 'src/DropdownMenu/demos/index.tsx',
    );

    expect(aliases.length).toBeGreaterThan(1);
    expect(new Set(aliases.map(({ legacyId }) => legacyId)).size).toBe(aliases.length);
  });
});

describe('frozen demo aliases', () => {
  it('preserves every frozen alias and adds one canonical id per unique source', () => {
    const entries = readLegacyMap(frozenInventory);

    expect(entries.filter(({ kind }) => kind === 'legacy')).toHaveLength(
      frozenInventory.demoReferences.length,
    );
    expect(entries.filter(({ kind }) => kind === 'canonical')).toHaveLength(
      new Set(frozenInventory.demoReferences.map(({ source }) => source)).size,
    );
    expect(new Set(entries.map(({ id }) => id)).size).toBe(entries.length);
    expect(entries).toContainEqual(
      expect.objectContaining({ id: 'docs-demo-docs', sourcePath: 'docs/index.tsx' }),
    );
  });

  it('retains route metadata on each alias of a shared source', () => {
    const shared = readLegacyMap(frozenInventory).filter(
      ({ kind, sourcePath }) =>
        kind === 'legacy' && sourcePath === 'src/DropdownMenu/demos/index.tsx',
    );

    expect(shared.length).toBeGreaterThan(1);
    expect(shared.every(({ routeId }) => routeId === 'components/DropdownMenu/index')).toBe(true);
  });

  it('prerenders frozen and canonical standalone demo paths', () => {
    const paths = getPrerenderPaths();

    expect(paths).toContain('/~demos/src-base-ui-button-demo-demos');
    expect(paths).toContain('/~demos/src-button-demos-index');
    expect(paths).toContain('/~demos/file, filetree, folder-demo-demos');
    expect(paths).not.toContain('/~demos/file%2C%20filetree%2C%20folder-demo-demos');
    expect(paths).toContain('/~demos/src-radio-demos-index');
    expect(new Set(paths).size).toBe(paths.length);
  });
});

it('migrates the Button guide once while preserving its demos and the generated API request', () => {
  const documentPath = resolve(repositoryRoot, 'src/Button/index.mdx');
  expect(existsSync(resolve(repositoryRoot, 'src/Button/index.md'))).toBe(false);
  const source = readFileSync(documentPath, 'utf8');

  expect(source).toContain("import DemoIndex from './demos/index.tsx?demo'");
  expect(source.match(/<Demo\b/g)).toHaveLength(5);
  expect(source).toContain('<Api name="Button"');
  expect(
    frozenInventory.demoReferences
      .filter(({ pathname }) => pathname === '/components/button')
      .every(({ document }) => document === 'src/Button/index.mdx'),
  ).toBe(true);
  expect(
    frozenInventory.documents.find(({ pathname }) => pathname === '/components/button')?.source,
  ).toBe('src/Button/index.mdx');
  expect(JSON.stringify(extractComponentApi({ documentPath, name: 'Button' }))).not.toContain(
    repositoryRoot,
  );
}, 120_000);

it('transforms representative simple and StoryBook repository demos for live editing', () => {
  for (const path of ['src/Flex/demos/basic.tsx', 'src/Button/demos/index.tsx']) {
    const source = readFileSync(resolve(repositoryRoot, path), 'utf8');
    expect(transformLiveSource(source, extractImmutableImports(source))).toMatchObject({
      ok: true,
    });
  }
});
