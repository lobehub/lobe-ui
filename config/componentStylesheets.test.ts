// @vitest-environment node
import { mkdirSync, mkdtempSync, realpathSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { componentStylesheets } from './componentStylesheets';

const makeSrc = (files: string[]) => {
  const src = realpathSync(mkdtempSync(path.join(tmpdir(), 'lobe-ui-pages-')));
  for (const file of files) {
    mkdirSync(path.dirname(path.join(src, file)), { recursive: true });
    writeFileSync(path.join(src, file), '');
  }
  return src;
};

describe('componentStylesheets', () => {
  it('gives every documented component a stylesheet named after its import path', () => {
    const src = makeSrc([
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
        fileName: 'css/form.css',
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

  it('skips a page whose folder has no module entry', () => {
    const src = makeSrc(['icons/Github/index.mdx', 'icons/Github/demos/Icons.tsx']);

    expect(componentStylesheets(src)).toEqual([]);
  });
});
