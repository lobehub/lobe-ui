import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';

import { convertPathToPattern, glob } from 'tinyglobby';

const SOURCE_FILE = /\.(?:[cm]?[jt]sx?)$/;
const MINIFIED = /\.min\.[cm]?js$/;
const OUTPUT_DIRS = [
  'node_modules',
  '.git',
  'dist',
  '.next',
  'out',
  'coverage',
  'storybook-static',
  '.vercel',
  '.turbo',
];
const ROOT_OUTPUT_DIRS = ['es', 'build', 'public'];

const isSource = (file: string) => SOURCE_FILE.test(file) && !MINIFIED.test(file);

const gitFiles = (cwd: string, paths: string[]) => {
  try {
    const output = execFileSync(
      'git',
      ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', ...paths],
      { cwd, encoding: 'utf8', maxBuffer: 1024 * 1024 * 512, stdio: ['ignore', 'pipe', 'ignore'] },
    );
    return output.split('\0').filter(Boolean);
  } catch {
    return undefined;
  }
};

const globFiles = (cwd: string, paths: string[]) => {
  const patterns = paths.map((target) => {
    const absolute = path.resolve(cwd, target);
    const relative = convertPathToPattern(path.relative(cwd, absolute));
    if (existsSync(absolute) && statSync(absolute).isFile()) return relative;
    return `${relative || '.'}/**/*`;
  });
  return glob(patterns, {
    cwd,
    dot: true,
    ignore: [
      ...OUTPUT_DIRS.map((dir) => `**/${dir}/**`),
      ...ROOT_OUTPUT_DIRS.map((dir) => `${dir}/**`),
    ],
  });
};

export const collectFiles = async (cwd: string, paths: string[]) => {
  const files = gitFiles(cwd, paths) ?? (await globFiles(cwd, paths));
  return files.filter((file) => isSource(file) && !file.split('/').includes('node_modules')).sort();
};
