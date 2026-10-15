import { parse as babelParse, type ParserPlugin } from '@babel/parser';
import type {
  ExportNamedDeclaration,
  ExportSpecifier,
  File,
  ImportDeclaration,
  ImportSpecifier,
  Node,
  StringLiteral,
} from '@babel/types';

const pluginsFor = (filename: string): ParserPlugin[] => {
  if (/\.[cm]?tsx$/.test(filename)) return ['typescript', 'jsx', 'decorators-legacy'];
  if (/\.[cm]?ts$/.test(filename)) return ['typescript', 'decorators-legacy'];
  return ['jsx', 'decorators-legacy'];
};

export const parse = (code: string, filename: string): File =>
  babelParse(code, {
    allowReturnOutsideFunction: true,
    createImportExpressions: true,
    plugins: pluginsFor(filename),
    sourceType: 'module',
  });

const SKIP_KEYS = new Set([
  'loc',
  'start',
  'end',
  'leadingComments',
  'trailingComments',
  'innerComments',
  'extra',
  'range',
]);

export const walk = (
  node: Node,
  visit: (node: Node, parent: Node | null) => void,
  parent: Node | null = null,
) => {
  visit(node, parent);
  for (const key of Object.keys(node)) {
    if (SKIP_KEYS.has(key)) continue;
    const value = (node as any)[key];
    if (Array.isArray(value)) {
      for (const child of value)
        if (child && typeof child.type === 'string') walk(child, visit, node);
    } else if (value && typeof value.type === 'string') {
      walk(value, visit, node);
    }
  }
};

const MOCK_OBJECTS = new Set(['vi', 'jest']);

const stringArg = (node: Node | undefined): StringLiteral | undefined =>
  node?.type === 'StringLiteral' ? node : undefined;

export const mockSources = (ast: File): StringLiteral[] => {
  const sources: StringLiteral[] = [];
  walk(ast, (node) => {
    if (node.type !== 'CallExpression') return;
    const { callee } = node;
    const isMock =
      callee.type === 'MemberExpression' &&
      callee.object.type === 'Identifier' &&
      MOCK_OBJECTS.has(callee.object.name);
    const source = stringArg(node.arguments[0] as Node | undefined);
    if (isMock && source) sources.push(source);
  });
  return sources;
};

export const moduleSources = (ast: File): StringLiteral[] => {
  const sources: StringLiteral[] = [];
  walk(ast, (node) => {
    switch (node.type) {
      case 'ImportDeclaration':
      case 'ExportAllDeclaration': {
        sources.push(node.source);
        break;
      }
      case 'ExportNamedDeclaration': {
        if (node.source) sources.push(node.source);
        break;
      }
      case 'ImportExpression': {
        const source = stringArg(node.source);
        if (source) sources.push(source);
        break;
      }
      case 'CallExpression': {
        const { callee } = node;
        const isRequire = callee.type === 'Identifier' && callee.name === 'require';
        const isMock =
          callee.type === 'MemberExpression' &&
          callee.object.type === 'Identifier' &&
          MOCK_OBJECTS.has(callee.object.name);
        const source = stringArg(node.arguments[0] as Node | undefined);
        if ((isRequire || isMock) && source) sources.push(source);
        break;
      }
    }
  });
  return sources;
};

export const importedName = (specifier: ImportSpecifier) =>
  specifier.imported.type === 'Identifier' ? specifier.imported.name : specifier.imported.value;

export const boundNames = (ast: File) => {
  const names = new Set<string>();
  for (const node of ast.program.body) {
    const declaration =
      node.type === 'ExportNamedDeclaration' || node.type === 'ExportDefaultDeclaration'
        ? node.declaration
        : node;
    if (!declaration) continue;
    switch (declaration.type) {
      case 'ImportDeclaration': {
        for (const specifier of declaration.specifiers) names.add(specifier.local.name);
        break;
      }
      case 'VariableDeclaration': {
        for (const declarator of declaration.declarations) {
          if (declarator.id.type === 'Identifier') names.add(declarator.id.name);
        }
        break;
      }
      case 'FunctionDeclaration':
      case 'ClassDeclaration':
      case 'TSTypeAliasDeclaration':
      case 'TSInterfaceDeclaration':
      case 'TSEnumDeclaration': {
        if (declaration.id) names.add(declaration.id.name);
        break;
      }
    }
  }
  return names;
};

export interface NamedImport {
  declaration: ImportDeclaration | ExportNamedDeclaration;
  name: string;
  specifier: ImportSpecifier | ExportSpecifier;
}

const exportedFrom = (specifier: ExportSpecifier) =>
  specifier.local.type === 'Identifier'
    ? specifier.local.name
    : (specifier.local as StringLiteral).value;

export const namedImports = (ast: File, isSource: (source: string) => boolean) => {
  const result: NamedImport[] = [];
  for (const node of ast.program.body) {
    if (node.type === 'ImportDeclaration' && isSource(node.source.value)) {
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ImportSpecifier') {
          result.push({ declaration: node, name: importedName(specifier), specifier });
        }
      }
    }
    if (node.type === 'ExportNamedDeclaration' && node.source && isSource(node.source.value)) {
      for (const specifier of node.specifiers) {
        if (specifier.type === 'ExportSpecifier') {
          result.push({ declaration: node, name: exportedFrom(specifier), specifier });
        }
      }
    }
  }
  return result;
};
