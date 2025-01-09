import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { packages } from '../.dumirc';

const root = resolve(__dirname, '..');

const build = async (filename: string) => {
  const content = `export * from './es/${filename}';`;
  writeFileSync(resolve(root, filename + '.js'), content, 'utf8');
  writeFileSync(resolve(root, filename + '.d.ts'), content, 'utf8');
};

for (const pkg of packages) build(pkg);
