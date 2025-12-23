import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { packages } from '../.dumirc';

const root = resolve(__dirname, '..');
const esDir = resolve(root, 'es');

// 为 packages 创建根目录的 re-export 文件
const buildPackage = async (filename: string) => {
  const content = `export * from './es/${filename}/index.mjs';`;
  writeFileSync(resolve(root, filename + '.js'), content, 'utf8');
  writeFileSync(resolve(root, filename + '.d.ts'), content, 'utf8');
};

// 为 es 目录下的所有组件/目录创建 index.js re-export index.mjs
const buildEsComponents = async () => {
  const entries = readdirSync(esDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dirPath = join(esDir, entry.name);
      const indexMjsPath = join(dirPath, 'index.mjs');

      // 检查是否存在 index.mjs 文件
      try {
        statSync(indexMjsPath);
        const indexJsContent = `export * from './index.mjs';`;
        writeFileSync(join(dirPath, 'index.js'), indexJsContent, 'utf8');

        const dtsContent = `export * from './index.d.mts';`;
        writeFileSync(join(dirPath, 'index.d.ts'), dtsContent, 'utf8');
      } catch {
        // 没有 index.mjs 文件，跳过
      }
    }
  }
};

// 构建 packages 的根目录 re-export
for (const pkg of packages) buildPackage(pkg);

// 构建 es 目录下所有组件的 index.js
buildEsComponents();
