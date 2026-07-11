import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

import ts from 'typescript';

export type DemoAnalysisDiagnosticCode =
  'browser-worker' | 'dynamic-import' | 'unsupported-local-dependency';

export interface DemoAnalysisDiagnostic {
  code: DemoAnalysisDiagnosticCode;
  column: number;
  line: number;
  message: string;
  sourcePath: string;
}

export interface DemoScopeBinding {
  imported: string;
  local: string;
}

export interface DemoScopeImport {
  bindings: DemoScopeBinding[];
  resolvedSource: string;
  sideEffect: boolean;
  source: string;
}

export interface DemoAnalysis {
  dependencyPaths: string[];
  diagnostics: DemoAnalysisDiagnostic[];
  imports: DemoScopeImport[];
  requiresReadOnly: boolean;
}

const supportedModuleExtensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs'] as const;
const supportedModuleExtensionSet = new Set<string>(supportedModuleExtensions);

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const scriptKindForPath = (path: string): ts.ScriptKind => {
  switch (extname(path)) {
    case '.js':
    case '.mjs':
    case '.cjs': {
      return ts.ScriptKind.JS;
    }
    case '.jsx': {
      return ts.ScriptKind.JSX;
    }
    case '.tsx': {
      return ts.ScriptKind.TSX;
    }
    default: {
      return ts.ScriptKind.TS;
    }
  }
};

const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile();

const resolveLocalModule = (importer: string, specifier: string): string | undefined => {
  const cleanSpecifier = specifier.split('?')[0].split('#')[0];
  const basePath = resolve(dirname(importer), cleanSpecifier);
  const candidates = extname(basePath)
    ? [basePath]
    : [
        basePath,
        ...supportedModuleExtensions.map((extension) => `${basePath}${extension}`),
        ...supportedModuleExtensions.map((extension) => resolve(basePath, `index${extension}`)),
      ];

  return candidates.find(isFile);
};

const isDynamicImport = (node: ts.Node): boolean =>
  ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword;

const isImportMetaGlob = (node: ts.Node): boolean => {
  if (!ts.isCallExpression(node) || !ts.isPropertyAccessExpression(node.expression)) return false;
  const { expression, name } = node.expression;
  return (
    ts.isMetaProperty(expression) &&
    expression.keywordToken === ts.SyntaxKind.ImportKeyword &&
    (name.text === 'glob' || name.text === 'globEager')
  );
};

const isWorkerConstructor = (node: ts.Node): boolean => {
  if (!ts.isNewExpression(node)) return false;
  const expression = node.expression;
  if (ts.isIdentifier(expression)) {
    return expression.text === 'Worker' || expression.text === 'SharedWorker';
  }
  if (ts.isPropertyAccessExpression(expression)) {
    return expression.name.text === 'Worker' || expression.name.text === 'SharedWorker';
  }
  return false;
};

const isServiceWorkerAccess = (node: ts.Node): boolean =>
  ts.isPropertyAccessExpression(node) && node.name.text === 'serviceWorker';

const hasRuntimeImport = (declaration: ts.ImportDeclaration): boolean => {
  const clause = declaration.importClause;
  if (!clause) return true;
  if (clause.isTypeOnly) return false;
  if (clause.name || (clause.namedBindings && ts.isNamespaceImport(clause.namedBindings))) {
    return true;
  }
  return Boolean(clause.namedBindings?.elements.some((element) => !element.isTypeOnly));
};

const hasRuntimeExport = (declaration: ts.ExportDeclaration): boolean => {
  if (declaration.isTypeOnly) return false;
  if (!declaration.exportClause || ts.isNamespaceExport(declaration.exportClause)) return true;
  return declaration.exportClause.elements.some((element) => !element.isTypeOnly);
};

const createScopeImport = (
  declaration: ts.ImportDeclaration,
  source: string,
  resolvedSource: string,
): DemoScopeImport | undefined => {
  const clause = declaration.importClause;
  if (!clause) {
    return { bindings: [], resolvedSource, sideEffect: true, source };
  }
  if (clause.isTypeOnly) return;

  const bindings: DemoScopeBinding[] = [];
  if (clause.name) bindings.push({ imported: 'default', local: clause.name.text });

  const namedBindings = clause.namedBindings;
  if (namedBindings && ts.isNamespaceImport(namedBindings)) {
    bindings.push({ imported: '*', local: namedBindings.name.text });
  }
  if (namedBindings && ts.isNamedImports(namedBindings)) {
    for (const element of namedBindings.elements) {
      if (element.isTypeOnly) continue;
      bindings.push({
        imported: element.propertyName?.text ?? element.name.text,
        local: element.name.text,
      });
    }
  }

  if (bindings.length === 0) return;
  return { bindings, resolvedSource, sideEffect: false, source };
};

export function analyzeDemo(sourcePath: string): DemoAnalysis {
  const entryPath = resolve(sourcePath);
  const diagnostics: DemoAnalysisDiagnostic[] = [];
  const imports: DemoScopeImport[] = [];
  const activePaths = new Set<string>();
  const visitedPaths = new Set<string>();
  const diagnosticKeys = new Set<string>();
  const dependencyPaths = new Set<string>();

  const addDiagnostic = (
    code: DemoAnalysisDiagnosticCode,
    filePath: string,
    sourceFile: ts.SourceFile,
    node: ts.Node,
    reason: string,
  ) => {
    const location = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
    const source = normalizePath(filePath);
    const line = location.line + 1;
    const column = location.character + 1;
    const key = `${code}:${source}:${line}:${column}:${reason}`;
    if (diagnosticKeys.has(key)) return;
    diagnosticKeys.add(key);
    diagnostics.push({
      code,
      column,
      line,
      message: `${reason} Author this demo as read-only with editable={false}.`,
      sourcePath: source,
    });
  };

  const visitModule = (filePath: string) => {
    const absolutePath = resolve(filePath);
    if (visitedPaths.has(absolutePath)) return;
    visitedPaths.add(absolutePath);
    activePaths.add(absolutePath);

    const sourceText = readFileSync(absolutePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      absolutePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      scriptKindForPath(absolutePath),
    );

    const visitNode = (node: ts.Node) => {
      if (isDynamicImport(node) || isImportMetaGlob(node)) {
        addDiagnostic(
          'dynamic-import',
          absolutePath,
          sourceFile,
          node,
          'Dynamic module loading cannot be represented by the editable dependency scope.',
        );
      }
      if (isWorkerConstructor(node) || isServiceWorkerAccess(node)) {
        addDiagnostic(
          'browser-worker',
          absolutePath,
          sourceFile,
          node,
          'Browser Worker APIs cannot be represented by the editable dependency scope.',
        );
      }
      ts.forEachChild(node, visitNode);
    };
    visitNode(sourceFile);

    for (const statement of sourceFile.statements) {
      const importDeclaration = ts.isImportDeclaration(statement) ? statement : undefined;
      const exportDeclaration = ts.isExportDeclaration(statement) ? statement : undefined;
      const moduleSpecifier =
        importDeclaration?.moduleSpecifier ?? exportDeclaration?.moduleSpecifier;
      if (!moduleSpecifier || !ts.isStringLiteral(moduleSpecifier)) continue;
      if (importDeclaration && !hasRuntimeImport(importDeclaration)) continue;
      if (exportDeclaration && !hasRuntimeExport(exportDeclaration)) continue;

      const specifier = moduleSpecifier.text;
      const isLocal = specifier.startsWith('.');
      const requestsWorker = /(?:\?|&)\w*(?:shared)?worker(?:&|$)/i.test(specifier);
      if (requestsWorker) {
        addDiagnostic(
          'browser-worker',
          absolutePath,
          sourceFile,
          moduleSpecifier,
          `Worker import "${specifier}" cannot be represented by the editable dependency scope.`,
        );
      }

      let resolvedSource = specifier;
      if (isLocal) {
        const localPath = resolveLocalModule(absolutePath, specifier);
        if (!localPath || !supportedModuleExtensionSet.has(extname(localPath))) {
          addDiagnostic(
            'unsupported-local-dependency',
            absolutePath,
            sourceFile,
            moduleSpecifier,
            `Local dependency "${specifier}" does not resolve to a supported JavaScript or TypeScript module.`,
          );
          continue;
        }

        resolvedSource = localPath;
        dependencyPaths.add(localPath);
        if (activePaths.has(localPath)) {
          addDiagnostic(
            'unsupported-local-dependency',
            absolutePath,
            sourceFile,
            moduleSpecifier,
            `Circular local dependency "${specifier}" is not supported by the editable dependency scope.`,
          );
        } else {
          visitModule(localPath);
        }
      }

      if (absolutePath === entryPath && importDeclaration) {
        const scopeImport = createScopeImport(importDeclaration, specifier, resolvedSource);
        if (scopeImport) imports.push(scopeImport);
      }
    }

    activePaths.delete(absolutePath);
  };

  visitModule(entryPath);

  return {
    dependencyPaths: [...dependencyPaths],
    diagnostics,
    imports,
    requiresReadOnly: diagnostics.length > 0,
  };
}
