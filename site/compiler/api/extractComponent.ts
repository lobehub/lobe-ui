import { relative, resolve } from 'node:path';

import ts from 'typescript';

import type { ApiComponent, ApiProperty, ApiRequest, ApiSourceLocation } from '../../types/api';
import { ApiProgramCache, type ApiProgramContext, resolveProgramConfigPath } from './createProgram';
import { renderType } from './renderType';
import { resolveComponentExport } from './resolveExport';

export interface ApiExtractionResult {
  component: ApiComponent;
  dependencies: string[];
  generation: number;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const locationFor = (context: ApiProgramContext, declaration: ts.Node): ApiSourceLocation => {
  const sourceFile = declaration.getSourceFile();
  const position = sourceFile.getLineAndCharacterOfPosition(declaration.getStart(sourceFile));
  const relativePath = normalizePath(relative(context.root, sourceFile.fileName));
  return {
    column: position.character + 1,
    file: relativePath.startsWith('../') ? normalizePath(sourceFile.fileName) : relativePath,
    line: position.line + 1,
  };
};

const displayTag = (tag: ts.JSDocTagInfo): string | undefined => {
  const value = ts.displayPartsToString(tag.text).trim();
  return value || undefined;
};

const documentationFor = (checker: ts.TypeChecker, symbol: ts.Symbol): string | undefined => {
  const value = ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim();
  return value || undefined;
};

const tagsFor = (checker: ts.TypeChecker, symbol: ts.Symbol): Map<string, string | undefined> =>
  new Map(symbol.getJsDocTags(checker).map((tag) => [tag.name, displayTag(tag)]));

const literalDefault = (expression: ts.Expression): string | undefined => {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return JSON.stringify(expression.text);
  }
  if (ts.isNumericLiteral(expression)) return expression.text;
  if (expression.kind === ts.SyntaxKind.TrueKeyword) return 'true';
  if (expression.kind === ts.SyntaxKind.FalseKeyword) return 'false';
  if (expression.kind === ts.SyntaxKind.NullKeyword) return 'null';
  if (
    ts.isPrefixUnaryExpression(expression) &&
    expression.operator === ts.SyntaxKind.MinusToken &&
    ts.isNumericLiteral(expression.operand)
  ) {
    return `-${expression.operand.text}`;
  }
};

const unwrapExpression = (expression: ts.Expression): ts.Expression => {
  let current = expression;
  while (
    ts.isParenthesizedExpression(current) ||
    ts.isAsExpression(current) ||
    ts.isSatisfiesExpression(current) ||
    ts.isTypeAssertionExpression(current) ||
    ts.isNonNullExpression(current)
  ) {
    current = current.expression;
  }
  return current;
};

const resolveAliasSymbol = (checker: ts.TypeChecker, symbol: ts.Symbol): ts.Symbol =>
  (symbol.flags & ts.SymbolFlags.Alias) === 0 ? symbol : checker.getAliasedSymbol(symbol);

const wrapperName = (expression: ts.LeftHandSideExpression): string | undefined => {
  if (ts.isIdentifier(expression)) return expression.text;
  if (ts.isPropertyAccessExpression(expression)) return expression.name.text;
};

const implementationFromExpression = (
  context: ApiProgramContext,
  expression: ts.Expression,
  visited: Set<ts.Node>,
): ts.FunctionLikeDeclaration | undefined => {
  const unwrapped = unwrapExpression(expression);
  if (visited.has(unwrapped)) return;
  visited.add(unwrapped);

  if (ts.isArrowFunction(unwrapped) || ts.isFunctionExpression(unwrapped)) return unwrapped;
  if (ts.isIdentifier(unwrapped)) {
    const symbol = context.checker.getSymbolAtLocation(unwrapped);
    if (!symbol) return;
    const resolved = resolveAliasSymbol(context.checker, symbol);
    for (const declaration of [resolved.valueDeclaration, ...(resolved.declarations ?? [])]) {
      if (!declaration) continue;
      const implementation = componentImplementation(context, declaration, visited);
      if (implementation) return implementation;
    }
    return;
  }
  if (
    ts.isCallExpression(unwrapped) &&
    ['assign', 'forwardRef', 'memo'].includes(wrapperName(unwrapped.expression) ?? '')
  ) {
    const wrapped = unwrapped.arguments[0];
    if (wrapped) return implementationFromExpression(context, wrapped, visited);
  }
};

const componentImplementation = (
  context: ApiProgramContext,
  declaration: ts.Declaration,
  visited = new Set<ts.Node>(),
): ts.FunctionLikeDeclaration | undefined => {
  if (visited.has(declaration)) return;
  visited.add(declaration);
  if (ts.isFunctionDeclaration(declaration)) return declaration;

  let expression: ts.Expression | undefined;
  if (ts.isVariableDeclaration(declaration)) expression = declaration.initializer;
  if (ts.isExportAssignment(declaration)) expression = declaration.expression;
  if (!expression) return;

  return implementationFromExpression(context, expression, visited);
};

const bindingPropertyName = (element: ts.BindingElement): string | undefined => {
  if (!ts.isIdentifier(element.name) || element.dotDotDotToken) return;
  if (!element.propertyName) return element.name.text;
  if (
    ts.isIdentifier(element.propertyName) ||
    ts.isStringLiteral(element.propertyName) ||
    ts.isNumericLiteral(element.propertyName)
  ) {
    return element.propertyName.text;
  }
};

const collectRuntimeDefaults = (
  context: ApiProgramContext,
  declaration: ts.Declaration,
): Map<string, string> => {
  const defaults = new Map<string, string>();
  const implementation = componentImplementation(context, declaration);
  const parameter = implementation?.parameters[0];
  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return defaults;

  for (const element of parameter.name.elements) {
    if (!element.initializer) continue;
    const name = bindingPropertyName(element);
    if (!name) continue;
    const value = literalDefault(element.initializer);
    if (value !== undefined) defaults.set(name, value);
  }
  return defaults;
};

const comparableDefault = (value: string): unknown => {
  const sourceFile = ts.createSourceFile(
    'api-default.ts',
    `const value = ${value};`,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  const statement = sourceFile.statements[0];
  if (statement && ts.isVariableStatement(statement)) {
    const initializer = statement.declarationList.declarations[0]?.initializer;
    if (initializer) {
      const literal = literalDefault(initializer);
      if (literal !== undefined) {
        try {
          return JSON.parse(literal);
        } catch {
          // Fall through to exact textual comparison for unsupported syntax.
        }
      }
    }
  }
  try {
    return JSON.parse(value);
  } catch {
    return value.trim();
  }
};

const propertyDeclaration = (symbol: ts.Symbol): ts.Declaration | undefined =>
  symbol.valueDeclaration ?? symbol.declarations?.[0];

const containerInfo = (
  checker: ts.TypeChecker,
  declaration: ts.Declaration,
): { name: string; symbol?: ts.Symbol } | undefined => {
  const parent = declaration.parent;
  if (
    (ts.isInterfaceDeclaration(parent) ||
      ts.isClassDeclaration(parent) ||
      ts.isTypeAliasDeclaration(parent)) &&
    parent.name
  ) {
    const symbol = checker.getSymbolAtLocation(parent.name);
    return {
      name: parent.name.text,
      ...(symbol ? { symbol: resolveAliasSymbol(checker, symbol) } : {}),
    };
  }
};

const collectRootTypeSymbols = (
  checker: ts.TypeChecker,
  type: ts.Type,
  symbols = new Set<ts.Symbol>(),
): Set<ts.Symbol> => {
  if (type.aliasSymbol) symbols.add(resolveAliasSymbol(checker, type.aliasSymbol));
  const symbol = type.getSymbol();
  if (symbol) symbols.add(resolveAliasSymbol(checker, symbol));
  if (type.isIntersection()) {
    for (const part of type.types) collectRootTypeSymbols(checker, part, symbols);
  }
  return symbols;
};

const renderPropertyType = (
  context: ApiProgramContext,
  type: ts.Type,
  declaration: ts.Declaration,
  optional: boolean,
): string => {
  if (optional && type.isUnion()) {
    const visible = type.types.filter((part) => (part.flags & ts.TypeFlags.Undefined) === 0);
    if (
      visible.length > 0 &&
      visible.every((part) => (part.flags & ts.TypeFlags.BooleanLiteral) !== 0)
    ) {
      return 'boolean';
    }
    if (visible.length === 1) return renderType(context.checker, visible[0], declaration);
    if (visible.length !== type.types.length) {
      return visible.map((part) => renderType(context.checker, part, declaration)).join(' | ');
    }
  }
  return renderType(context.checker, type, declaration);
};

const signatureShape = (context: ApiProgramContext, signature: ts.Signature): string => {
  const parameter = signature.getParameters()[0];
  if (!parameter) return '';
  const declaration = parameter.valueDeclaration ?? parameter.declarations?.[0];
  if (!declaration) return parameter.getName();
  const props = context.checker.getTypeOfSymbolAtLocation(parameter, declaration);
  const properties = context.checker.getPropertiesOfType(props).map((property) => {
    const propertyNode = propertyDeclaration(property) ?? declaration;
    const type = context.checker.getTypeOfSymbolAtLocation(property, propertyNode);
    const optional = (property.flags & ts.SymbolFlags.Optional) !== 0 ? '?' : '!';
    return `property:${JSON.stringify(property.getName())}:${optional}:${renderType(context.checker, type, propertyNode)}`;
  });
  const indexes = context.checker.getIndexInfosOfType(props).map((index) => {
    const indexNode = index.declaration ?? declaration;
    return `index:${index.isReadonly ? 'readonly' : 'mutable'}:${renderType(context.checker, index.keyType, indexNode)}:${renderType(context.checker, index.type, indexNode)}`;
  });
  return [...properties, ...indexes].sort().join(';');
};

interface ReferencedSymbols {
  names: Set<string>;
  symbols: Set<ts.Symbol>;
}

const collectReferencedSymbols = (
  context: ApiProgramContext,
  declarations: readonly ts.Node[],
): ReferencedSymbols => {
  const names = new Set<string>();
  const symbols = new Set<ts.Symbol>();
  const visit = (node: ts.Node): void => {
    if (ts.isIdentifier(node)) {
      names.add(node.text);
      const symbol = context.checker.getSymbolAtLocation(node);
      if (symbol) {
        symbols.add(symbol);
        symbols.add(resolveAliasSymbol(context.checker, symbol));
      }
    }
    ts.forEachChild(node, visit);
  };
  for (const declaration of declarations) visit(declaration);
  return { names, symbols };
};

const importBindings = (declaration: ts.ImportDeclaration): ts.Identifier[] => {
  const clause = declaration.importClause;
  if (!clause) return [];
  const bindings: ts.Identifier[] = [];
  if (clause.name) bindings.push(clause.name);
  if (clause.namedBindings) {
    if (ts.isNamespaceImport(clause.namedBindings)) bindings.push(clause.namedBindings.name);
    else {
      for (const element of clause.namedBindings.elements) bindings.push(element.name);
    }
  }
  return bindings;
};

const overlaps = (diagnostic: ts.Diagnostic, declaration: ts.Node): boolean => {
  if (diagnostic.start === undefined || diagnostic.length === undefined) return false;
  const diagnosticEnd = diagnostic.start + diagnostic.length;
  return diagnostic.start < declaration.end && diagnosticEnd > declaration.getStart();
};

const relatedTypeDiagnostics = (
  context: ApiProgramContext,
  declarations: readonly ts.Node[],
): ts.Diagnostic[] => {
  const references = collectReferencedSymbols(context, declarations);
  const byFile = new Map<ts.SourceFile, ts.Node[]>();
  for (const declaration of declarations) {
    const sourceFile = declaration.getSourceFile();
    const entries = byFile.get(sourceFile) ?? [];
    entries.push(declaration);
    byFile.set(sourceFile, entries);
  }

  const diagnostics: ts.Diagnostic[] = [];
  for (const [sourceFile, relevantDeclarations] of byFile) {
    const sourceDiagnostics = [
      ...context.program.getSyntacticDiagnostics(sourceFile),
      ...context.program.getSemanticDiagnostics(sourceFile),
    ];
    for (const diagnostic of sourceDiagnostics) {
      if (diagnostic.category !== ts.DiagnosticCategory.Error || diagnostic.file !== sourceFile)
        continue;
      if (relevantDeclarations.some((declaration) => overlaps(diagnostic, declaration))) {
        diagnostics.push(diagnostic);
        continue;
      }
      const relatedImport = sourceFile.statements.find(
        (statement): statement is ts.ImportDeclaration =>
          ts.isImportDeclaration(statement) && overlaps(diagnostic, statement),
      );
      if (!relatedImport) continue;
      if (
        importBindings(relatedImport).some((binding) => {
          const symbol = context.checker.getSymbolAtLocation(binding);
          if (!symbol) return references.names.has(binding.text);
          return (
            references.symbols.has(symbol) ||
            references.symbols.has(resolveAliasSymbol(context.checker, symbol))
          );
        })
      ) {
        diagnostics.push(diagnostic);
      }
    }
  }
  return diagnostics;
};

const formatDiagnostics = (diagnostics: readonly ts.Diagnostic[]): string => {
  const host: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (file) => file,
    getCurrentDirectory: () => process.cwd(),
    getNewLine: () => '\n',
  };
  return ts.formatDiagnostics(diagnostics, host).trim();
};

const propsDeclarations = (
  context: ApiProgramContext,
  componentDeclaration: ts.Declaration,
  propsType: ts.Type,
): ts.Node[] => {
  const declarations = new Set<ts.Node>();
  if (ts.isVariableDeclaration(componentDeclaration) && componentDeclaration.type) {
    declarations.add(componentDeclaration.type);
  }
  if (ts.isFunctionLike(componentDeclaration)) {
    for (const parameter of componentDeclaration.parameters) declarations.add(parameter);
  }
  const implementation = componentImplementation(context, componentDeclaration);
  if (implementation?.parameters[0]) declarations.add(implementation.parameters[0]);
  for (const symbol of collectRootTypeSymbols(context.checker, propsType)) {
    for (const declaration of symbol.declarations ?? []) declarations.add(declaration);
  }
  for (const property of context.checker.getPropertiesOfType(propsType)) {
    for (const declaration of property.declarations ?? []) declarations.add(declaration);
  }
  return [...declarations];
};

const assertPropsGraph = (
  context: ApiProgramContext,
  request: ApiRequest,
  componentDeclaration: ts.Declaration,
  propsType: ts.Type,
): void => {
  const diagnostics = relatedTypeDiagnostics(
    context,
    propsDeclarations(context, componentDeclaration, propsType),
  );
  if (diagnostics.length > 0) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" has an incomplete TypeScript props graph related to ${componentDeclaration.getSourceFile().fileName}:\n${formatDiagnostics(diagnostics)}\nResolve the related TypeScript errors before generating this API reference.`,
    );
  }
  const kind =
    (propsType.flags & ts.TypeFlags.Any) !== 0
      ? 'any'
      : (propsType.flags & ts.TypeFlags.Unknown) !== 0
        ? 'unknown'
        : undefined;
  if (kind) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" resolves to ${kind} instead of a concrete props contract; define and export a complete props type.`,
    );
  }
};

const resolvePropsType = (
  context: ApiProgramContext,
  request: ApiRequest,
  symbol: ts.Symbol,
  declaration: ts.Declaration,
): ts.Type | undefined => {
  const componentType = context.checker.getTypeOfSymbolAtLocation(symbol, declaration);
  const signatures = componentType.getCallSignatures();
  if (signatures.length === 0) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" target ${declaration.getSourceFile().fileName} is not callable; export a React component or correct from=.`,
    );
  }
  for (const signature of signatures) {
    const parameter = signature.getParameters()[0];
    if (!parameter) continue;
    const parameterDeclaration =
      parameter.valueDeclaration ?? parameter.declarations?.[0] ?? declaration;
    const propsType = context.checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration);
    assertPropsGraph(context, request, declaration, propsType);
  }
  const shapes = new Set(signatures.map((signature) => signatureShape(context, signature)));
  if (shapes.size > 1) {
    throw new Error(
      `${request.documentPath}: API "${request.name}" has multiple callable signatures with different props contracts; set from= to an unambiguous component export.`,
    );
  }
  const parameter = signatures[0].getParameters()[0];
  if (!parameter) return;
  const parameterDeclaration =
    parameter.valueDeclaration ?? parameter.declarations?.[0] ?? declaration;
  return context.checker.getTypeOfSymbolAtLocation(parameter, parameterDeclaration);
};

const extractProperties = (
  context: ApiProgramContext,
  request: ApiRequest,
  propsType: ts.Type | undefined,
  runtimeDefaults: Map<string, string>,
  dependencies: Set<string>,
): ApiProperty[] => {
  if (!propsType) return [];
  const rootTypeSymbols = collectRootTypeSymbols(context.checker, propsType);

  return context.checker
    .getPropertiesOfType(propsType)
    .map((symbol): ApiProperty | undefined => {
      const declaration = propertyDeclaration(symbol);
      if (!declaration) return;
      const sourceFile = declaration.getSourceFile();
      dependencies.add(resolve(sourceFile.fileName));
      const optional = (symbol.flags & ts.SymbolFlags.Optional) !== 0;
      const type = context.checker.getTypeOfSymbolAtLocation(symbol, declaration);
      const tags = tagsFor(context.checker, symbol);
      const documentedDefault = tags.get('default');
      const runtimeDefault = runtimeDefaults.get(symbol.getName());
      if (
        documentedDefault !== undefined &&
        runtimeDefault !== undefined &&
        comparableDefault(documentedDefault) !== comparableDefault(runtimeDefault)
      ) {
        throw new Error(
          `${request.documentPath}: API "${request.name}" property "${symbol.getName()}" has conflicting runtime default ${runtimeDefault} and @default ${documentedDefault}; make the declarations agree.`,
        );
      }
      const declaringContainer = containerInfo(context.checker, declaration);
      return {
        defaultValue: runtimeDefault ?? documentedDefault,
        deprecated: tags.has('deprecated') ? (tags.get('deprecated') ?? '') : undefined,
        description: documentationFor(context.checker, symbol),
        inheritedFrom:
          declaringContainer &&
          (!declaringContainer.symbol || !rootTypeSymbols.has(declaringContainer.symbol))
            ? declaringContainer.name
            : undefined,
        name: symbol.getName(),
        required: !optional,
        since: tags.get('since'),
        source: locationFor(context, declaration),
        type: renderPropertyType(context, type, declaration, optional),
      };
    })
    .filter((property): property is ApiProperty => Boolean(property))
    .sort((left, right) => left.name.localeCompare(right.name, 'en'));
};

const extractionKey = (request: ApiRequest): string =>
  JSON.stringify({
    documentPath: resolve(request.documentPath),
    from: request.from,
    name: request.name,
  });

export class ApiExtractor {
  readonly #cache = new Map<string, ApiExtractionResult>();
  readonly #program: ApiProgramCache;

  constructor(request: Pick<ApiRequest, 'documentPath' | 'tsconfigPath'>) {
    this.#program = new ApiProgramCache(request);
  }

  extract(request: ApiRequest): ApiExtractionResult {
    const key = extractionKey(request);
    const cached = this.#cache.get(key);
    if (cached?.generation === this.#program.generation) return cached;

    const context = this.#program.get();
    const resolved = resolveComponentExport(context, request);
    const dependencies = new Set(resolved.dependencies);
    dependencies.add(resolve(resolved.declaration.getSourceFile().fileName));
    const propsType = resolvePropsType(context, request, resolved.symbol, resolved.declaration);
    const tags = tagsFor(context.checker, resolved.symbol);
    const component: ApiComponent = {
      deprecated: tags.has('deprecated') ? (tags.get('deprecated') ?? '') : undefined,
      description: documentationFor(context.checker, resolved.symbol),
      name: request.name,
      properties: extractProperties(
        context,
        request,
        propsType,
        collectRuntimeDefaults(context, resolved.declaration),
        dependencies,
      ),
      since: tags.get('since'),
      source: locationFor(context, resolved.declaration),
    };
    const result = {
      component,
      dependencies: [...dependencies].map((dependency) => resolve(dependency)).toSorted(),
      generation: context.generation,
    };
    this.#cache.set(key, result);
    return result;
  }

  invalidate(): void {
    this.#cache.clear();
    this.#program.invalidate();
  }
}

const sharedExtractors = new Map<string, ApiExtractor>();

const extractorKey = (request: ApiRequest): string => resolveProgramConfigPath(request);

export const extractComponentApiDetailed = (request: ApiRequest): ApiExtractionResult => {
  const key = extractorKey(request);
  let extractor = sharedExtractors.get(key);
  if (!extractor) {
    extractor = new ApiExtractor(request);
    sharedExtractors.set(key, extractor);
  }
  return extractor.extract(request);
};

export const extractComponentApi = (request: ApiRequest): ApiComponent =>
  extractComponentApiDetailed(request).component;
