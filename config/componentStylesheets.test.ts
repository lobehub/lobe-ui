// @vitest-environment node
import * as fs from 'node:fs';
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import pkg from '../package.json';
import { componentStylesheets } from './componentStylesheets';

vi.mock('node:fs', { spy: true });

const roots: string[] = [];
afterEach(async () => {
  vi.restoreAllMocks();
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

const makeSrc = async (files: string[]) => {
  const src = await realpath(await mkdtemp(path.join(tmpdir(), 'lobe-ui-pages-')));
  roots.push(src);
  for (const file of files) {
    await mkdir(path.dirname(path.join(src, file)), { recursive: true });
    await writeFile(path.join(src, file), '');
  }
  return src;
};

describe('componentStylesheets', () => {
  it('names every stylesheet after its complete component module path', async () => {
    const src = await makeSrc([
      'Alert/index.mdx',
      'Alert/index.ts',
      'chat/ChatItem/index.mdx',
      'chat/ChatItem/index.tsx',
      'FormKit/index.mdx',
      'FormKit/index.ts',
      'ProTable/index.mdx',
      'ProTable/index.ts',
    ]);

    expect(componentStylesheets(src)).toEqual([
      {
        entry: path.join(src, 'Alert/index.ts'),
        fileName: 'css/Alert.css',
        page: path.join(src, 'Alert/index.mdx'),
        specifier: '@lobehub/ui/css/Alert.css',
      },
      {
        entry: path.join(src, 'FormKit/index.ts'),
        fileName: 'css/FormKit.css',
        page: path.join(src, 'FormKit/index.mdx'),
        specifier: '@lobehub/ui/css/FormKit.css',
      },
      {
        entry: path.join(src, 'ProTable/index.ts'),
        fileName: 'css/ProTable.css',
        page: path.join(src, 'ProTable/index.mdx'),
        specifier: '@lobehub/ui/css/ProTable.css',
      },
      {
        entry: path.join(src, 'chat/ChatItem/index.tsx'),
        fileName: 'css/chat/ChatItem.css',
        page: path.join(src, 'chat/ChatItem/index.mdx'),
        specifier: '@lobehub/ui/css/chat/ChatItem.css',
      },
    ]);
  });

  it('skips a page whose folder has no module entry', async () => {
    const src = await makeSrc(['icons/Github/index.mdx', 'icons/Github/demos/Icons.tsx']);

    expect(componentStylesheets(src)).toEqual([]);
  });

  it('exposes Form and FormKit through the same wildcard export without aliases', async () => {
    const src = await makeSrc([
      'Form/index.mdx',
      'Form/index.ts',
      'FormKit/index.mdx',
      'FormKit/index.ts',
    ]);
    const sheets = componentStylesheets(src);
    expect(sheets.map(({ fileName }) => fileName)).toEqual(['css/Form.css', 'css/FormKit.css']);
    expect(sheets.map(({ specifier }) => specifier)).toEqual([
      '@lobehub/ui/css/Form.css',
      '@lobehub/ui/css/FormKit.css',
    ]);

    expect(Object.keys(pkg.exports).filter((key) => key.startsWith('./css/'))).toEqual(['./css/*']);
    for (const { fileName, specifier } of sheets) {
      const target = pkg.exports['./css/*'].replace('*', specifier.split('/css/')[1]);
      expect(target).toBe(`./es/${fileName}`);
    }
  });

  it('rejects case-insensitive stylesheet path collisions before writing files', () => {
    // Model a case-sensitive source tree even when this test runs on macOS.
    vi.mocked(fs.globSync).mockReturnValueOnce(['Widget/index.mdx', 'widget/index.mdx']);
    vi.mocked(fs.existsSync).mockReturnValueOnce(true).mockReturnValueOnce(true);

    expect(() => componentStylesheets('/virtual/src')).toThrow(
      'Case-insensitive stylesheet path collision: css/Widget.css and css/widget.css',
    );
  });

  it('preserves namespaces for components with the same basename', async () => {
    const src = await makeSrc([
      'chat/Message/index.mdx',
      'chat/Message/index.ts',
      'dashboard/Message/index.mdx',
      'dashboard/Message/index.ts',
    ]);

    expect(componentStylesheets(src).map(({ fileName }) => fileName)).toEqual([
      'css/chat/Message.css',
      'css/dashboard/Message.css',
    ]);
  });

  it('gives every real component a case-insensitively unique output path', () => {
    const sheets = componentStylesheets(path.resolve(import.meta.dirname, '../src'));
    expect(sheets.length).toBeGreaterThan(100);
    expect(new Set(sheets.map(({ fileName }) => fileName.toLowerCase())).size).toBe(sheets.length);
  });
});
