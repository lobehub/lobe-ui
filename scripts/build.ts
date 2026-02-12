import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const esDir = resolve(root, 'es');

// 为 es 目录下的所有组件/目录创建 index.js re-export index.mjs
const buildEsComponents = async () => {
  const entries = readdirSync(esDir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const dirPath = join(esDir, entry.name);
      const indexMjsPath = join(dirPath, 'index.mjs');

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

buildEsComponents();
