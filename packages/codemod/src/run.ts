import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { createTwoFilesPatch } from 'diff';

import { namedImports, parse } from './ast';
import { collectFiles } from './files';
import { checkPackageJson } from './packageJson';
import { collectReport, type ReportItem } from './report';
import { v6Rules } from './rules/v6';
import { applyTransforms } from './transform';
import { v6Transforms } from './transforms/v6';

export interface RunOptions {
  cwd: string;
  dry: boolean;
  paths: string[];
}

export interface RunResult {
  changed: string[];
  diffs: Record<string, string>;
  errors: { file: string; message: string }[];
  files: number;
  items: ReportItem[];
}

const findPackageJson = (from: string) => {
  for (let dir = from; ; dir = path.dirname(dir)) {
    const candidate = path.join(dir, 'package.json');
    if (existsSync(candidate)) return candidate;
    if (path.dirname(dir) === dir) return;
  }
};

const RELEVANT = /@lobehub\/ui|antd|@ant-design|rc-|@rc-component|ant-|useThemeMode|useTheme/;

const baseUiNamesOf = (code: string, file: string) =>
  new Set(namedImports(parse(code, file), (s) => s === '@lobehub/ui/base-ui').map((i) => i.name));

export const runCodemod = async ({ cwd, dry, paths }: RunOptions): Promise<RunResult> => {
  const result: RunResult = { changed: [], diffs: {}, errors: [], files: 0, items: [] };

  const packageJson = findPackageJson(cwd);
  if (packageJson) {
    result.items.push(
      ...checkPackageJson(
        readFileSync(packageJson, 'utf8'),
        path.relative(cwd, packageJson) || 'package.json',
      ),
    );
  }

  for (const file of await collectFiles(cwd, paths)) {
    result.files++;
    const absolute = path.join(cwd, file);
    const original = readFileSync(absolute, 'utf8');
    if (!RELEVANT.test(original)) continue;
    try {
      const baseUiNames = baseUiNamesOf(original, file);
      const { changed, code } = applyTransforms(original, file, v6Transforms);
      result.items.push(...collectReport(code, file, v6Rules, { baseUiNames }));
      if (!changed) continue;
      result.changed.push(file);
      if (dry) result.diffs[file] = createTwoFilesPatch(file, file, original, code);
      else writeFileSync(absolute, code);
    } catch (error) {
      result.errors.push({ file, message: (error as Error).message });
    }
  }

  return result;
};
