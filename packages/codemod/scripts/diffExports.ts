import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

const [v5Dir, v6Dir] = process.argv.slice(2).map((dir) => path.resolve(dir));
if (!v5Dir || !v6Dir) {
  console.error('usage: tsx scripts/diffExports.ts <@lobehub/ui@5 dir> <@lobehub/ui@6 dir>');
  process.exit(1);
}

const dataDir = path.resolve(import.meta.dirname, '../src/transforms/v6/data');

const V5_TO_V6: Record<string, string> = {
  '.': '.',
  './awesome': './awesome',
  './base-ui': '.',
  './base-ui/form': './form',
  './brand': './brand',
  './chat': './chat',
  './color': './color',
  './dashboard': './dashboard',
  './i18n': './i18n',
  './icons': './icons',
  './mdx': './mdx',
  './mobile': './mobile',
  './storybook': './storybook',
};

interface ExportInfo {
  file: string;
  isValue: boolean;
}

const readExports = (pkgDir: string) => {
  const pkg = JSON.parse(readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
  const entries = Object.entries<any>(pkg.exports)
    .filter(([key, value]) => !key.includes('*') && typeof value === 'object' && value.types)
    .map(([key, value]) => [key, path.join(pkgDir, value.types)] as const);

  const program = ts.createProgram(
    entries.map(([, file]) => file),
    {
      module: ts.ModuleKind.ESNext,
      moduleResolution: ts.ModuleResolutionKind.Bundler,
      skipLibCheck: true,
    },
  );
  const checker = program.getTypeChecker();

  const result = new Map<string, Map<string, ExportInfo>>();
  for (const [key, file] of entries) {
    const source = program.getSourceFile(file);
    const moduleSymbol = source && checker.getSymbolAtLocation(source);
    const names = new Map<string, ExportInfo>();
    for (const symbol of moduleSymbol ? checker.getExportsOfModule(moduleSymbol) : []) {
      const target =
        symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
      const declaration = target.declarations?.[0];
      names.set(symbol.name, {
        file: declaration ? path.relative(pkgDir, declaration.getSourceFile().fileName) : '',
        isValue: Boolean(target.flags & ts.SymbolFlags.Value),
      });
    }
    result.set(key, names);
  }
  return result;
};

const v5 = readExports(v5Dir);
const v6 = readExports(v6Dir);

const removedPath = path.join(dataDir, 'removed-exports.json');
const previous: Record<string, Record<string, string | null>> = existsSync(removedPath)
  ? JSON.parse(readFileSync(removedPath, 'utf8'))
  : {};

const removed: Record<string, Record<string, string | null>> = {};
for (const [from, to] of Object.entries(V5_TO_V6)) {
  const before = v5.get(from);
  const after = v6.get(to);
  if (!before || !after) continue;
  const missing = [...before.keys()]
    .filter((name) => !after.has(name) || (before.get(name)!.isValue && !after.get(name)!.isValue))
    .sort();
  if (missing.length === 0) continue;
  removed[from] = Object.fromEntries(missing.map((name) => [name, previous[from]?.[name] ?? null]));
}

const v5Root = v5.get('.')!;
const v5BaseUi = v5.get('./base-ui')!;
const v6Root = v6.get('.')!;
const changed = [...v5Root.entries()]
  .filter(([name, info]) => {
    const twin = v5BaseUi.get(name);
    return info.isValue && v6Root.get(name)?.isValue && twin && twin.file !== info.file;
  })
  .map(([name]) => name)
  .sort();

writeFileSync(removedPath, `${JSON.stringify(removed, null, 2)}\n`);
const typeOnly = [...v5Root.entries()]
  .filter(([name, info]) => info.isValue && v6Root.has(name) && !v6Root.get(name)!.isValue)
  .map(([name]) => name)
  .sort();
writeFileSync(
  path.join(dataDir, 'type-only-exports.json'),
  `${JSON.stringify(typeOnly, null, 2)}\n`,
);
writeFileSync(
  path.join(dataDir, 'changed-components.json'),
  `${JSON.stringify(changed, null, 2)}\n`,
);
console.log(
  `removed: ${Object.values(removed).reduce((n, names) => n + Object.keys(names).length, 0)}, changed: ${changed.length}`,
);
