import { existsSync, unlinkSync } from 'node:fs';
import { resolve } from 'node:path';

import { packageNamespaces } from '../config/packageNamespaces';

const root = resolve(__dirname, '..');

const clean = async (filename: string) => {
  const jsPath = resolve(root, filename + '.js');
  const dtsPath = resolve(root, filename + '.d.ts');
  if (existsSync(jsPath)) unlinkSync(jsPath);
  if (dtsPath) unlinkSync(dtsPath);
};

for (const pkg of packageNamespaces) clean(pkg);
