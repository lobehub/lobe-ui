import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
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
    expect(out.join('\n')).toContain('Rewrote 1 of 1 files. 0 items need a manual fix.');
    expect(readFileSync(path.join(dir, 'report.md'), 'utf8')).toContain(
      '# @lobehub/ui v6 migration report',
    );
    expect(out.join('\n')).toContain(`Markdown report: ${path.join(dir, 'report.md')}`);
    const json = JSON.parse(readFileSync(path.join(dir, 'report.json'), 'utf8'));
    expect(json).toMatchObject({
      mode: 'write',
      scope: { root: dir, paths: ['.'] },
      artifacts: { markdown: path.join(dir, 'report.md') },
    });
  });

  it('prints JSON with --json', async () => {
    await main(['v6', '.', '--json', '--dry'], io());
    expect(JSON.parse(out.join('\n')).changed).toEqual(['a.ts']);
    expect(JSON.parse(out.join('\n')).nextSteps.length).toBeGreaterThan(0);
    const report = JSON.parse(out.join('\n'));
    expect(JSON.parse(readFileSync(report.artifacts.json, 'utf8'))).toEqual(report);
    expect(readFileSync(report.artifacts.markdown, 'utf8')).toContain('Mode: dry-run');
    expect(readFileSync(report.artifacts.patch, 'utf8')).toContain('+import { cx }');
  });

  it('does not claim to have rewritten files in a dry-run Markdown report', async () => {
    await main(['v6', '.', '--dry', '--report', 'report.md'], io());
    const report = readFileSync(path.join(dir, 'report.md'), 'utf8');
    expect(report).toContain('Would rewrite 1 of 1 files');
    expect(report).toContain('Next steps (manual verification required)');
    expect(readFileSync(path.join(dir, 'a.ts'), 'utf8')).toContain('antd-style');
    expect(out.join('\n')).not.toContain('--- a.ts');
    expect(out.join('\n')).toContain(`Patch: ${path.join(dir, 'report.patch')}`);
  });

  it('creates reports by default and preserves earlier reviewed reports on rerun', async () => {
    await main(['v6', '.'], io());
    const root = path.join(dir, '.lobe-ui-codemod');
    const [first] = readdirSync(root);
    const previous = path.join(root, first, 'report.md');
    writeFileSync(previous, 'Reviewed by a human');
    await main(['v6', '.'], io());
    expect(readdirSync(root)).toHaveLength(2);
    expect(readFileSync(previous, 'utf8')).toBe('Reviewed by a human');
    expect(out.join('\n')).toContain(previous);
  });

  it.each(['report.md', 'report.json'])(
    'refuses an existing %s before changing source files',
    async (file) => {
      writeFileSync(path.join(dir, file), 'user content');
      await expect(main(['v6', '.', '--report', 'report.md'], io())).rejects.toThrow(
        'Report file already exists',
      );
      expect(readFileSync(path.join(dir, file), 'utf8')).toBe('user content');
      expect(readFileSync(path.join(dir, 'a.ts'), 'utf8')).toContain('antd-style');
    },
  );
});
