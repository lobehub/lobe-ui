import { existsSync, globSync } from 'node:fs';
import path from 'node:path';

export const componentStylesheets = (srcDir: string) => {
  const sheets = globSync('**/index.mdx', { cwd: srcDir })
    .map((page) => path.dirname(page).split(path.sep).join('/'))
    .toSorted()
    .flatMap((dir) => {
      const entry = ['index.ts', 'index.tsx']
        .map((file) => path.join(srcDir, dir, file))
        .find((file) => existsSync(file));
      if (!entry) return [];
      const fileName = `css/${dir}.css`;
      return [
        {
          entry,
          fileName,
          page: path.join(srcDir, dir, 'index.mdx'),
          specifier: `@lobehub/ui/${fileName}`,
        },
      ];
    });

  const paths = new Map<string, string>();
  for (const { fileName } of sheets) {
    const key = fileName.toLowerCase();
    const previous = paths.get(key);
    if (previous) {
      throw new Error(`Case-insensitive stylesheet path collision: ${previous} and ${fileName}`);
    }
    paths.set(key, fileName);
  }
  return sheets;
};
