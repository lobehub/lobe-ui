import { existsSync, globSync } from 'node:fs';
import path from 'node:path';

const subpathOf: Record<string, string> = { FormKit: 'form', ProTable: 'pro-table' };

export const componentStylesheets = (srcDir: string) =>
  globSync('**/index.mdx', { cwd: srcDir })
    .map((page) => path.dirname(page).split(path.sep).join('/'))
    .toSorted()
    .flatMap((dir) => {
      const entry = ['index.ts', 'index.tsx']
        .map((file) => path.join(srcDir, dir, file))
        .find((file) => existsSync(file));
      if (!entry) return [];
      const [head, ...rest] = dir.split('/');
      const fileName = `css/${[subpathOf[head] ?? head, ...rest].join('/')}.css`;
      return [
        {
          entry,
          fileName,
          page: path.join(srcDir, dir, 'index.mdx'),
          specifier: `@lobehub/ui/${fileName}`,
        },
      ];
    });
