import type { DocumentManifestEntry } from '../types/content';
import { createManifestEngine } from './manifestEngine';

const documents: DocumentManifestEntry[] = [
  {
    category: 'Inputs',
    description: 'Choose one value from a compact group.',
    pathname: '/components/segmented',
    source: 'src/Segmented/index.mdx',
    status: 'stable',
    title: 'Segmented',
  },
  {
    category: 'Actions',
    description: 'Primary action control.',
    pathname: '/components/button',
    source: 'src/Button/index.mdx',
    status: 'beta',
    title: 'Button',
  },
  {
    category: 'Actions',
    description: 'Icon-only button for toolbars.',
    pathname: '/components/action-icon',
    source: 'src/ActionIcon/index.mdx',
    status: 'experimental',
    title: 'ActionIcon',
  },
];

it.each([
  ['button', '/components/button'],
  ['primary action', '/components/button'],
  ['actions', '/components/button'],
  ['beta', '/components/button'],
  ['src/button', '/components/button'],
  ['actionicon', '/components/action-icon'],
])('matches every searchable metadata field for %s', async (query, expectedPathname) => {
  const engine = createManifestEngine(documents);
  const hits = await engine.search(query);
  expect(hits).toContainEqual(expect.objectContaining({ pathname: expectedPathname }));
});

it('carries the document category on each hit', async () => {
  const engine = createManifestEngine(documents);
  const hits = await engine.search('button');
  expect(hits).toContainEqual(expect.objectContaining({ category: 'Actions' }));
});

it('uses deterministic relevance, title, and pathname ranking', async () => {
  const engine = createManifestEngine(documents);

  expect((await engine.search('button')).map((hit) => hit.pathname)).toEqual([
    '/components/button',
    '/components/action-icon',
  ]);
  expect((await engine.search('actions')).map((hit) => hit.pathname)).toEqual([
    '/components/action-icon',
    '/components/button',
  ]);
  await expect(engine.search('   ')).resolves.toEqual([]);
});
