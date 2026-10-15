import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { main } from './cli';

let dir: string;
let out: string[];
const io = () => ({ cwd: dir, log: (line: string) => out.push(line) });

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'lobe-ui-codemod-cli-'));
  out = [];
  writeFileSync(path.join(dir, 'a.ts'), `import { cx } from 'antd-style';\n`);
});

afterEach(() => rmSync(dir, { force: true, recursive: true }));

describe('cli', () => {
  it('prints usage and fails without a transform set', async () => {
    expect(await main([], io())).toBe(1);
    expect(out.join('\n')).toContain('Usage: lobe-ui-codemod v6');
  });

  it('rejects an unknown transform set', async () => {
    expect(await main(['v7'], io())).toBe(1);
    expect(out.join('\n')).toContain('Unknown transform set "v7"');
  });

  it('runs v6 on the given paths and writes a Markdown report', async () => {
    expect(await main(['v6', '.', '--report', 'report.md'], io())).toBe(0);
    expect(out.join('\n').split('\n').at(-2)).toBe(
      'Rewrote 1 of 1 files. 0 items need a manual fix.',
    );
    const { readFileSync } = await import('node:fs');
    expect(readFileSync(path.join(dir, 'report.md'), 'utf8')).toContain(
      '# @lobehub/ui v6 migration report',
    );
  });

  it('prints JSON with --json', async () => {
    await main(['v6', '.', '--json', '--dry'], io());
    expect(JSON.parse(out.join('\n')).changed).toEqual(['a.ts']);
  });
});
