import { readFileSync } from 'node:fs';
import path from 'node:path';

import ts from 'typescript';

import changed from './changed-components.json';
import removed from './removed-exports.json';
import typeOnlyExports from './type-only-exports.json';

const repoRoot = path.resolve(import.meta.dirname, '../../../../../..');

const rootExports = () => {
  const configPath = path.resolve(repoRoot, 'tsconfig.json');
  const { config } = ts.readConfigFile(configPath, (p) => readFileSync(p, 'utf8'));
  const { options } = ts.parseJsonConfigFileContent(config, ts.sys, repoRoot);
  const entry = path.resolve(repoRoot, 'src/index.ts');
  const program = ts.createProgram([entry], { ...options, noEmit: true });
  const checker = program.getTypeChecker();
  const symbol = checker.getSymbolAtLocation(program.getSourceFile(entry)!)!;
  const exports = checker.getExportsOfModule(symbol);
  const isValue = (s: ts.Symbol) => {
    const target = s.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(s) : s;
    return Boolean(target.flags & ts.SymbolFlags.Value);
  };
  return {
    names: new Set(exports.map((s) => s.name)),
    values: new Set(exports.filter(isValue).map((s) => s.name)),
  };
};

describe('v6 data tables', () => {
  const { names, values } = rootExports();

  it('lists no name that the v6 root still exports as removed, except type-only names', () => {
    const typeOnly = new Set(typeOnlyExports);
    expect(
      Object.keys(removed['.']).filter(
        (name) => values.has(name) || (names.has(name) && !typeOnly.has(name)),
      ),
    ).toEqual([]);
  });

  it('lists only names that the v6 root exports as values as changed', () => {
    expect(changed.filter((name) => !values.has(name))).toEqual([]);
  });
});
