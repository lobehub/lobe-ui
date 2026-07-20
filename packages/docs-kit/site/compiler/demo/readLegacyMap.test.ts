import compatibility from '../../../../../compatibility.json';
import type { DocumentationInventory } from '../types';
import {
  createStandaloneDemoPath,
  createStandaloneDemoPrerenderPath,
  readLegacyMap,
} from './readLegacyMap';

const realInventory = compatibility as DocumentationInventory;

it('preserves every frozen alias and adds one canonical id per unique source', () => {
  const entries = readLegacyMap(realInventory);

  expect(entries.filter(({ kind }) => kind === 'legacy')).toHaveLength(
    realInventory.demoReferences.length,
  );
  expect(entries.filter(({ kind }) => kind === 'canonical')).toHaveLength(
    new Set(realInventory.demoReferences.map(({ source }) => source)).size,
  );
  expect(new Set(entries.map(({ id }) => id)).size).toBe(entries.length);
  expect(entries).toContainEqual(
    expect.objectContaining({
      id: 'docs-demo-docs',
      sourcePath: 'docs/index.tsx',
    }),
  );
});

it('retains route metadata on each alias of a shared source', () => {
  const entries = readLegacyMap(realInventory);
  const shared = entries.filter(
    ({ kind, sourcePath }) =>
      kind === 'legacy' && sourcePath === 'src/DropdownMenu/demos/index.tsx',
  );

  expect(shared).toEqual(
    expect.arrayContaining([
      expect.objectContaining({ routeId: 'components/DropdownMenu/index' }),
      expect.objectContaining({ routeId: 'components/base-ui/DropdownMenu/index' }),
    ]),
  );
});

it('encodes punctuation-bearing ids exactly once', () => {
  expect(createStandaloneDemoPath('file, filetree, folder-demo-demos')).toBe(
    '/~demos/file%2C%20filetree%2C%20folder-demo-demos',
  );
  expect(createStandaloneDemoPrerenderPath('file, filetree, folder-demo-demos')).toBe(
    '/~demos/file, filetree, folder-demo-demos',
  );
});

it('fails duplicate legacy ids and canonical collisions instead of choosing a source', () => {
  const reference = realInventory.demoReferences[0];
  expect(() =>
    readLegacyMap({
      demoReferences: [reference, { ...reference, source: 'src/Other/demos/index.tsx' }],
      documents: [],
    }),
  ).toThrow(/duplicate standalone demo id/i);

  expect(() =>
    readLegacyMap({
      demoReferences: [
        { ...reference, legacyId: 'first', source: 'src/FooBar/demos/index.tsx' },
        { ...reference, legacyId: 'second', source: 'src/foo-bar/demos/index.tsx' },
      ],
      documents: [],
    }),
  ).toThrow(/canonical standalone demo id collision/i);
});
