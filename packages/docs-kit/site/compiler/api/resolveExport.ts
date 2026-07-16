import { existsSync } from 'node:fs';
import { basename, dirname, extname, relative, resolve } from 'node:path';

import ts from 'typescript';

import type { ApiRequest } from '../../types/api';
import type { ApiProgramContext } from './createProgram';

export interface ResolvedComponentExport {
  declaration: ts.Declaration;
  dependencies: Set<string>;
  modulePath: string;
  symbol: ts.Symbol;
}

interface ExportCandidate extends ResolvedComponentExport {
  exportName: 'default' | string;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const canonicalPath = (path: string): string => {
  return normalizePath(resolve(path));
};

const resolveAlias = (checker: ts.TypeChecker, symbol: ts.Symbol): ts.Symbol => {
  let current = symbol;
  const visited = new Set<ts.Symbol>();
  while ((current.flags & ts.SymbolFlags.Alias) !== 0 && !visited.has(current)) {
    visited.add(current);
    current = checker.getAliasedSymbol(current);
  }
  return current;
};

const getDeclaration = (symbol: ts.Symbol): ts.Declaration | undefined =>
  symbol.valueDeclaration ??
  symbol.declarations?.find((declaration) => !declaration.getSourceFile().isDeclarationFile) ??
  symbol.declarations?.[0];

const getExports = (context: ApiProgramContext, path: string): Map<string, ts.Symbol> => {
  const sourceFile = context.program.getSourceFile(path);
  if (!sourceFile) return new Map();
  const moduleSymbol = context.checker.getSymbolAtLocation(sourceFile);
  if (!moduleSymbol) return new Map();
  return new Map(
    context.checker.getExportsOfModule(moduleSymbol).map((symbol) => [symbol.getName(), symbol]),
  );
};

const createCandidate = (
  context: ApiProgramContext,
  modulePath: string,
  exportName: string,
  symbol: ts.Symbol | undefined,
  dependencies: Set<string>,
): ExportCandidate | undefined => {
  if (!symbol) return;
  const resolvedSymbol = resolveAlias(context.checker, symbol);
  const declaration = getDeclaration(resolvedSymbol);
  if (!declaration) return;
  dependencies.add(canonicalPath(declaration.getSourceFile().fileName));
  return {
    declaration,
    dependencies,
    exportName,
    modulePath: canonicalPath(modulePath),
    symbol: resolvedSymbol,
  };
};

const isWithin = (path: string, root: string): boolean => {
  const fragment = normalizePath(relative(root, path));
  return fragment === '' || (!fragment.startsWith('../') && fragment !== '..');
};

const findBarrel = (context: ApiProgramContext, directory: string): string | undefined =>
  ['index.ts', 'index.tsx', 'index.mts', 'index.cts']
    .map((filename) => canonicalPath(resolve(directory, filename)))
    .find((path) => existsSync(path) && context.program.getSourceFile(path));

const declarationName = (declaration: ts.Declaration): string | undefined => {
  if ('name' in declaration) {
    const name = (declaration as ts.NamedDeclaration).name;
    if (name && ts.isIdentifier(name)) return name.text;
  }
};

const isCallable = (context: ApiProgramContext, candidate: ExportCandidate): boolean => {
  const type = context.checker.getTypeOfSymbolAtLocation(candidate.symbol, candidate.declaration);
  return type.getCallSignatures().length > 0;
};

const matchesDefaultIdentity = (
  context: ApiProgramContext,
  request: ApiRequest,
  candidate: ExportCandidate,
): boolean => {
  if (!isCallable(context, candidate)) return false;
  const declaredName = declarationName(candidate.declaration) ?? candidate.symbol.getName();
  if (declaredName === request.name) return true;
  const sourceFile = candidate.declaration.getSourceFile().fileName;
  const directoryName = basename(dirname(sourceFile));
  const fileName = basename(sourceFile, extname(sourceFile));
  return directoryName === request.name || fileName === request.name;
};

const describeTarget = (candidate: ExportCandidate): string =>
  canonicalPath(candidate.declaration.getSourceFile().fileName);

const assertDefaultCandidate = (
  context: ApiProgramContext,
  request: ApiRequest,
  candidate: ExportCandidate,
): ExportCandidate => {
  if (!isCallable(context, candidate)) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" default export from ${candidate.modulePath} is not callable; export a callable named value or set from= to the intended module.`,
    );
  }
  if (!matchesDefaultIdentity(context, request, candidate)) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" default export ${describeTarget(candidate)} does not match the documented component; add a named export or set from= to a matching callable target.`,
    );
  }
  return candidate;
};

const resolveModulePath = (
  context: ApiProgramContext,
  request: ApiRequest,
  source: string,
): string => {
  const resolvedModule = ts.resolveModuleName(
    source,
    request.documentPath,
    context.options,
    ts.sys,
  ).resolvedModule;
  if (!resolvedModule) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" from=${JSON.stringify(source)} could not be resolved with TypeScript; correct from= or export the component from that exact module.`,
    );
  }
  return canonicalPath(resolvedModule.resolvedFileName);
};

const resolveExplicitExport = (
  context: ApiProgramContext,
  request: ApiRequest & { from: string },
): ResolvedComponentExport => {
  const dependencies = new Set<string>([canonicalPath(context.configPath)]);
  const modulePath = resolveModulePath(context, request, request.from);
  dependencies.add(modulePath);
  const exports = getExports(context, modulePath);
  const named = createCandidate(
    context,
    modulePath,
    request.name,
    exports.get(request.name),
    dependencies,
  );
  if (named) return named;
  const fallback = createCandidate(
    context,
    modulePath,
    'default',
    exports.get('default'),
    dependencies,
  );
  if (fallback) return assertDefaultCandidate(context, request, fallback);
  throw new Error(
    `${request.documentPath}: API "${request.name}" was not exported by from=${JSON.stringify(request.from)} (${modulePath}); export it by name or correct from=.`,
  );
};

export const resolveComponentExport = (
  context: ApiProgramContext,
  request: ApiRequest,
): ResolvedComponentExport => {
  if (request.from) return resolveExplicitExport(context, request as ApiRequest & { from: string });

  const dependencies = new Set<string>([canonicalPath(context.configPath)]);
  const root = canonicalPath(context.root);
  let directory = canonicalPath(dirname(request.documentPath));
  let named: ExportCandidate | undefined;
  let nearestDefault: ExportCandidate | undefined;

  while (isWithin(directory, root)) {
    const barrel = findBarrel(context, directory);
    if (barrel) {
      dependencies.add(barrel);
      const exports = getExports(context, barrel);
      nearestDefault ??= createCandidate(
        context,
        barrel,
        'default',
        exports.get('default'),
        dependencies,
      );
      named = createCandidate(
        context,
        barrel,
        request.name,
        exports.get(request.name),
        dependencies,
      );
      if (named) break;
    }
    const parent = canonicalPath(dirname(directory));
    if (parent === directory) break;
    directory = parent;
  }

  if (named && nearestDefault && named.symbol !== nearestDefault.symbol) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" is ambiguous between named target ${describeTarget(named)} and default target ${describeTarget(nearestDefault)}; set from= to the intended public module.`,
    );
  }
  if (named) return named;
  if (nearestDefault) return assertDefaultCandidate(context, request, nearestDefault);

  throw new Error(
    `${request.documentPath}: API "${request.name}" could not be resolved from a public component barrel; export it by name or set from= explicitly.`,
  );
};
