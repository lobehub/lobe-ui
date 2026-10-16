import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const root = resolve(__dirname, '../..');
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

const SPLINE_IMPORT =
  /from ['"](@splinetool\/runtime|@\/spline(\/[^'"]*)?|@lobehub\/ui\/spline(\/[^'"]*)?|[^'"]*\/spline\/[^'"]*)['"]|import\(\s*['"]@splinetool\/runtime['"]\s*\)/;

describe('spline entry boundaries', () => {
  it('only the spline entry references the optional @splinetool/runtime peer', () => {
    const importers = files
      .filter(({ text }) => /['"]@splinetool\/runtime['"]/.test(text))
      .map(({ path }) => path);
    expect(importers.length).toBeGreaterThan(0);
    expect(importers.filter((path) => !path.startsWith('src/spline/'))).toEqual([]);
  });

  it('no other entry imports the spline entry, so shared barrels never reach the peer', () => {
    const leaks = files
      .filter(({ path }) => !path.startsWith('src/spline/') && !path.includes('/demos/'))
      .filter(({ text }) => SPLINE_IMPORT.test(text))
      .map(({ path }) => path);
    expect(leaks).toEqual([]);
  });

  it('package.json publishes ./spline and keeps the runtime an optional peer', () => {
    const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
    expect(pkg.exports['./spline']).toEqual({
      import: './es/spline/index.mjs',
      types: './es/spline/index.d.mts',
    });
    expect(pkg.dependencies['@splinetool/runtime']).toBeUndefined();
    expect(pkg.peerDependencies['@splinetool/runtime']).toBeDefined();
    expect(pkg.peerDependenciesMeta['@splinetool/runtime']).toEqual({ optional: true });
  });

  it('awesome and brand no longer export the Spline components', async () => {
    const [awesome, brand, spline] = await Promise.all([
      import('@/awesome'),
      import('@/brand'),
      import('@/spline'),
    ]);
    expect('Spline' in awesome).toBe(false);
    expect('LogoThree' in brand || 'LogoSpline' in brand).toBe(false);
    expect(Object.keys(spline).sort()).toEqual(['LogoSpline', 'LogoThree', 'Spline']);
  });
});
