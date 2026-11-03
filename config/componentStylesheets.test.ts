// @vitest-environment node
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import pkg from '../package.json';
import { componentStylesheets } from './componentStylesheets';

const roots: string[] = [];
afterEach(async () => {
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
  it('gives every documented component a stylesheet named after its import path', async () => {
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
        specifier: '@lobehub/ui/css/form.css',
      },
      {
        entry: path.join(src, 'ProTable/index.ts'),
        fileName: 'css/pro-table.css',
        page: path.join(src, 'ProTable/index.mdx'),
        specifier: '@lobehub/ui/css/pro-table.css',
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

  it('keeps Form and FormKit in distinct files without changing their public imports', async () => {
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
      '@lobehub/ui/css/form.css',
    ]);

    const exports: Record<string, unknown> = pkg.exports;
    for (const { fileName, specifier } of sheets) {
      const key = specifier.replace('@lobehub/ui', '.');
      const target = exports[key] ?? String(exports['./css/*']).replace('*', key.slice(6));
      expect(target).toBe(`./es/${fileName}`);
    }
  });

  it('rejects case-insensitive stylesheet path collisions before writing files', async () => {
    const src = await makeSrc([
      'ProTable/index.mdx',
      'ProTable/index.ts',
      'Pro-table/index.mdx',
      'Pro-table/index.ts',
    ]);

    expect(() => componentStylesheets(src)).toThrow(
      'Case-insensitive stylesheet path collision: css/Pro-table.css and css/pro-table.css',
    );
  });

  it('gives every real component a case-insensitively unique output path', () => {
    const sheets = componentStylesheets(path.resolve(import.meta.dirname, '../src'));
    expect(sheets.length).toBeGreaterThan(100);
    expect(new Set(sheets.map(({ fileName }) => fileName.toLowerCase())).size).toBe(sheets.length);
  });
});
