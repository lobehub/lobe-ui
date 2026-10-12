import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { collectFiles } from './files';

let dir: string;

const write = (file: string) => {
  mkdirSync(path.join(dir, file, '..'), { recursive: true });
  writeFileSync(path.join(dir, file), '');
};

beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), 'lobe-ui-codemod-files-'));
  for (const file of [
    '.storybook/preview.tsx',
    'src/locales/es/index.ts',
    'src/app.tsx',
    'src/readme.md',
    'public/vendor.min.js',
    'coverage/lcov.js',
    'node_modules/pkg/index.js',
    'generated/out.ts',
  ]) {
    write(file);
  }
});

afterEach(() => rmSync(dir, { force: true, recursive: true }));

describe('collectFiles', () => {
  it('walks dot folders and skips output folders outside git', async () => {
    expect(await collectFiles(dir, ['.'])).toEqual([
      '.storybook/preview.tsx',
      'generated/out.ts',
      'src/app.tsx',
      'src/locales/es/index.ts',
    ]);
  });

  it('respects .gitignore inside a git repository', async () => {
    execFileSync('git', ['init', '-q'], { cwd: dir });
    writeFileSync(path.join(dir, '.gitignore'), 'generated/\nnode_modules/\ncoverage/\npublic/\n');
    expect(await collectFiles(dir, ['.'])).toEqual([
      '.storybook/preview.tsx',
      'src/app.tsx',
      'src/locales/es/index.ts',
    ]);
  });

  it('accepts files and subfolders as paths', async () => {
    expect(await collectFiles(dir, ['src/app.tsx', '.storybook'])).toEqual([
      '.storybook/preview.tsx',
      'src/app.tsx',
    ]);
  });
});
