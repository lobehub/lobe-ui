import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { runCodemod } from './run';

let dir: string;

const write = (file: string, content: string) => {
  mkdirSync(path.join(dir, file, '..'), { recursive: true });
  writeFileSync(path.join(dir, file), content);
};

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'lobe-ui-codemod-'));
  write('package.json', JSON.stringify({ dependencies: { antd: '^6.0.0' } }, null, 2));
  write(
    'src/a.tsx',
    `import { cx } from 'antd-style';\nimport { Modal } from '@lobehub/ui/base-ui';\n`,
  );
  write('src/b.ts', `import { Dropdown } from '@lobehub/ui';\n`);
  write('src/broken.ts', `import { cx } from 'antd-style';\nconst = ;`);
  write('src/unrelated.ts', `const = ;`);
  write('src/node_modules/x.ts', `import { cx } from 'antd-style';\n`);
});

afterEach(() => rmSync(dir, { force: true, recursive: true }));

describe('runCodemod', () => {
  it('rewrites files, reports leftovers and checks package.json', async () => {
    const result = await runCodemod({ cwd: dir, dry: false, paths: ['src'] });

    expect(readFileSync(path.join(dir, 'src/a.tsx'), 'utf8')).toBe(
      `import { cx, Modal } from '@lobehub/ui';\n`,
    );
    expect(result.changed).toEqual(['src/a.tsx']);
    expect(result.items.map((i) => `${i.rule} ${i.file}:${i.line}`)).toEqual([
      'R7 package.json:3',
      'R4 src/b.ts:1',
    ]);
    expect(result.errors.map((e) => e.file)).toEqual(['src/broken.ts']);
  });

  it('leaves files untouched and returns diffs in dry mode', async () => {
    const result = await runCodemod({ cwd: dir, dry: true, paths: ['src'] });

    expect(readFileSync(path.join(dir, 'src/a.tsx'), 'utf8')).toContain('antd-style');
    expect(result.diffs['src/a.tsx']).toContain(`+import { cx, Modal } from '@lobehub/ui';`);
  });

  it('accepts single files as paths', async () => {
    const result = await runCodemod({ cwd: dir, dry: true, paths: ['src/b.ts'] });
    expect(result.items.map((i) => i.file)).toEqual(['package.json', 'src/b.ts']);
  });
});
