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

const componentImplementation = (
  declaration: ts.Declaration,
): ts.FunctionLikeDeclaration | undefined => {
  if (ts.isFunctionDeclaration(declaration)) return declaration;

  let expression: ts.Expression | undefined;
  if (ts.isVariableDeclaration(declaration)) expression = declaration.initializer;
  if (ts.isExportAssignment(declaration)) expression = declaration.expression;
  if (!expression) return;

  const unwrapped = unwrapExpression(expression);
  if (ts.isArrowFunction(unwrapped) || ts.isFunctionExpression(unwrapped)) return unwrapped;
  if (ts.isCallExpression(unwrapped)) {
    for (const argument of unwrapped.arguments) {
      const candidate = unwrapExpression(argument);
      if (ts.isArrowFunction(candidate) || ts.isFunctionExpression(candidate)) return candidate;
    }
  }
};

const collectRuntimeDefaults = (declaration: ts.Declaration): Map<string, string> => {
  const defaults = new Map<string, string>();
  const implementation = componentImplementation(declaration);
  const parameter = implementation?.parameters[0];
  if (!parameter || !ts.isObjectBindingPattern(parameter.name)) return defaults;

  for (const element of parameter.name.elements) {
    if (!element.initializer || !ts.isIdentifier(element.name)) continue;
    const value = literalDefault(element.initializer);
    if (value !== undefined) defaults.set(element.name.text, value);
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

const resolveAliasSymbol = (checker: ts.TypeChecker, symbol: ts.Symbol): ts.Symbol =>
  (symbol.flags & ts.SymbolFlags.Alias) === 0 ? symbol : checker.getAliasedSymbol(symbol);

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
  return context.checker
    .getPropertiesOfType(props)
    .map((property) => {
      const propertyNode = propertyDeclaration(property) ?? declaration;
      const type = context.checker.getTypeOfSymbolAtLocation(property, propertyNode);
      return `${property.getName()}:${renderType(context.checker, type, propertyNode)}`;
    })
    .sort()
    .join(';');
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
        collectRuntimeDefaults(resolved.declaration),
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
