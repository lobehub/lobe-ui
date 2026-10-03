import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(__dirname, '../../..');
const src = join(root, 'src');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(tsx?|mts)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [full] : [];
  });

const files = walk(src).map((file) => ({
  path: relative(root, file),
  text: readFileSync(file, 'utf8'),
}));

describe('form entry boundaries', () => {
  it('only the TanStack adapter imports @tanstack/form-*', () => {
    const importers = files
      .filter(({ text }) => /from ['"]@tanstack\/(react-)?form/.test(text))
      .map(({ path }) => path);
    expect(importers).toEqual(['src/base-ui/FormKit/engine/tanstack.ts']);
  });

  it('nothing outside FormKit imports FormKit, so the base-ui main entry stays TanStack-free', () => {
    const leaks = files
      .filter(({ path }) => !path.startsWith('src/base-ui/FormKit/'))
      .filter(({ text }) => /from ['"][^'"]*FormKit[^'"]*['"]/.test(text))
      .map(({ path }) => path);
    expect(leaks).toEqual([]);
  });

  it('package.json publishes ./base-ui/form from FormKit and tsdown builds it', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    expect(pkg.exports['./base-ui/form']).toEqual({
      import: './es/base-ui/FormKit/index.mjs',
      types: './es/base-ui/FormKit/index.d.mts',
    });
    expect(readFileSync(join(root, 'tsdown.config.ts'), 'utf8')).toContain(
      "'src/base-ui/FormKit/index.ts'",
    );
  });

  it('the public index exports the documented API', async () => {
    const mod = await import('./index');
    expect(Object.keys(mod).sort()).toEqual(
      [
        'Form',
        'FormField',
        'FormList',
        'FormSubmitFooter',
        'default',
        'useForm',
        'useFormInstance',
        'useWatch',
      ].sort(),
    );
    expect(
      Object.keys(mod.Form)
        .filter((key) => /^[A-Z]/.test(key))
        .sort(),
    ).toEqual(
      ['Divider', 'Field', 'FlatGroup', 'Footer', 'Group', 'List', 'SubmitFooter', 'Title'].sort(),
    );
  });
});
