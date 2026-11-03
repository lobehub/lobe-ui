import { existsSync, globSync } from 'node:fs';
import path from 'node:path';

const subpathOf: Record<string, string> = { FormKit: 'form', ProTable: 'pro-table' };

export const componentStylesheets = (srcDir: string) => {
  const sheets = globSync('**/index.mdx', { cwd: srcDir })
    .map((page) => path.dirname(page).split(path.sep).join('/'))
    .toSorted()
    .flatMap((dir) => {
      const entry = ['index.ts', 'index.tsx']
        .map((file) => path.join(srcDir, dir, file))
        .find((file) => existsSync(file));
      if (!entry) return [];
      const [head, ...rest] = dir.split('/');
      const publicFileName = `css/${[subpathOf[head] ?? head, ...rest].join('/')}.css`;
      // The public form.css import is aliased in package.json: Form.css and form.css
      // cannot coexist on case-insensitive filesystems.
      const fileName = dir === 'FormKit' ? 'css/FormKit.css' : publicFileName;
      return [
        {
          entry,
          fileName,
          page: path.join(srcDir, dir, 'index.mdx'),
          specifier: `@lobehub/ui/${publicFileName}`,
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
