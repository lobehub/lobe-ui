import type { ApiRequest } from '../../types/api';

export const apiVirtualModulePrefix = 'virtual:lobe-docs/api:';

interface Position {
  start?: {
    column?: number;
    line?: number;
  };
}

interface MdxAttribute {
  name?: string;
  type: string;
  value?: unknown;
}

interface MdxNode {
  attributes?: MdxAttribute[];
  children?: MdxNode[];
  data?: Record<string, unknown>;
  name?: string | null;
  position?: Position;
  type: string;
  value?: string;
}

interface MdxRoot extends MdxNode {
  children: MdxNode[];
  type: 'root';
}

interface VirtualFile {
  history?: string[];
  path?: string;
}

interface ValidApiNode {
  from?: string;
  name: string;
  node: MdxNode;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const stableRequest = (request: ApiRequest): ApiRequest => ({
  documentPath: normalizePath(request.documentPath),
  ...(request.from === undefined ? {} : { from: request.from }),
  name: request.name,
});

export const encodeApiVirtualRequest = (request: ApiRequest): string =>
  encodeURIComponent(JSON.stringify(stableRequest(request)));

export const decodeApiVirtualRequest = (encoded: string): ApiRequest =>
  JSON.parse(decodeURIComponent(encoded)) as ApiRequest;

export const createApiVirtualModuleId = (request: ApiRequest): string =>
  `${apiVirtualModulePrefix}${encodeApiVirtualRequest(request)}`;

const isApiNode = (node: MdxNode): boolean =>
  (node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'Api';

const collectApiNodes = (node: MdxNode, result: MdxNode[]): void => {
  if (isApiNode(node)) result.push(node);
  for (const child of node.children ?? []) collectApiNodes(child, result);
};

const record = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

const collectPatternBindings = (value: unknown, bindings: Set<string>): void => {
  const pattern = record(value);
  if (!pattern) return;

  switch (pattern.type) {
    case 'Identifier': {
      if (typeof pattern.name === 'string') bindings.add(pattern.name);
      break;
    }
    case 'AssignmentPattern': {
      collectPatternBindings(pattern.left, bindings);
      break;
    }
    case 'ArrayPattern': {
      if (!Array.isArray(pattern.elements)) return;
      for (const element of pattern.elements) collectPatternBindings(element, bindings);
      break;
    }
    case 'ObjectPattern': {
      if (!Array.isArray(pattern.properties)) return;
      for (const value of pattern.properties) {
        const property = record(value);
        if (!property) continue;
        collectPatternBindings(
          property.type === 'RestElement' ? property.argument : property.value,
          bindings,
        );
      }
      break;
    }
    case 'RestElement': {
      collectPatternBindings(pattern.argument, bindings);
      break;
    }
  }
};

const collectDeclarationBindings = (value: unknown, bindings: Set<string>): void => {
  const declaration = record(value);
  if (!declaration) return;

  if (declaration.type === 'VariableDeclaration' && Array.isArray(declaration.declarations)) {
    for (const value of declaration.declarations) {
      collectPatternBindings(record(value)?.id, bindings);
    }
    return;
  }

  if (declaration.type === 'FunctionDeclaration' || declaration.type === 'ClassDeclaration') {
    collectPatternBindings(declaration.id, bindings);
  }
};

const collectMdxEsmBindings = (root: MdxRoot): Set<string> => {
  const bindings = new Set<string>();

  for (const node of root.children) {
    if (node.type !== 'mdxjsEsm') continue;
    const program = record(node.data?.estree);
    if (!Array.isArray(program?.body)) continue;

    for (const value of program.body) {
      const statement = record(value);
      if (!statement) continue;

      if (statement.type === 'ImportDeclaration' && Array.isArray(statement.specifiers)) {
        for (const value of statement.specifiers) {
          collectPatternBindings(record(value)?.local, bindings);
        }
        continue;
      }

      if (
        statement.type === 'ExportNamedDeclaration' ||
        statement.type === 'ExportDefaultDeclaration'
      ) {
        collectDeclarationBindings(statement.declaration, bindings);
        continue;
      }

      collectDeclarationBindings(statement, bindings);
    }
  }

  return bindings;
};

const staticAttribute = (node: MdxNode, name: string): string | undefined => {
  const attribute = node.attributes?.find(
    (candidate) => candidate.type === 'mdxJsxAttribute' && candidate.name === name,
  );
  return typeof attribute?.value === 'string' ? attribute.value : undefined;
};

const hasAttribute = (node: MdxNode, name: string): boolean =>
  Boolean(
    node.attributes?.some(
      (candidate) => candidate.type === 'mdxJsxAttribute' && candidate.name === name,
    ),
  );

const isNonEmpty = (value: string | undefined): value is string =>
  value !== undefined && value.trim().length > 0;

const locationFor = (filePath: string, node: MdxNode): string => {
  const line = node.position?.start?.line ?? 1;
  const column = node.position?.start?.column ?? 1;
  return `${filePath}:${line}:${column}`;
};

const importNode = (identifier: string, source: string): MdxNode => ({
  data: {
    estree: {
      body: [
        {
          source: { raw: JSON.stringify(source), type: 'Literal', value: source },
          specifiers: [
            {
              local: { name: identifier, type: 'Identifier' },
              type: 'ImportDefaultSpecifier',
            },
          ],
          type: 'ImportDeclaration',
        },
      ],
      sourceType: 'module',
      type: 'Program',
    },
  },
  type: 'mdxjsEsm',
  value: `import ${identifier} from ${JSON.stringify(source)};`,
});

const dataAttribute = (identifier: string): MdxAttribute => ({
  name: 'data',
  type: 'mdxJsxAttribute',
  value: {
    data: {
      estree: {
        body: [
          {
            expression: { name: identifier, type: 'Identifier' },
            type: 'ExpressionStatement',
          },
        ],
        sourceType: 'module',
        type: 'Program',
      },
    },
    type: 'mdxJsxAttributeValueExpression',
    value: identifier,
  },
});

export function remarkApi() {
  return (tree: MdxRoot, file: VirtualFile): void => {
    const documentPath = normalizePath(file.path ?? file.history?.[0] ?? '<unknown>');
    const apiNodes: MdxNode[] = [];
    const diagnostics: string[] = [];
    const validNodes: ValidApiNode[] = [];
    collectApiNodes(tree, apiNodes);

    for (const node of apiNodes) {
      const name = staticAttribute(node, 'name');
      const from = staticAttribute(node, 'from');
      const location = locationFor(documentPath, node);

      if (!isNonEmpty(name)) {
        diagnostics.push(
          `${location} — <Api> name must be a non-empty static string, for example <Api name="Button" />.`,
        );
      }
      if (hasAttribute(node, 'from') && !isNonEmpty(from)) {
        diagnostics.push(
          `${location} — <Api> from must be a non-empty static string, for example <Api name="Button" from="../Button" />.`,
        );
      }
      if (hasAttribute(node, 'data')) {
        diagnostics.push(
          `${location} — <Api> data is reserved for compiler-generated component metadata; remove the data prop.`,
        );
      }
      if (
        isNonEmpty(name) &&
        (!hasAttribute(node, 'from') || isNonEmpty(from)) &&
        !hasAttribute(node, 'data')
      ) {
        validNodes.push({ ...(from === undefined ? {} : { from }), name, node });
      }
    }

    if (diagnostics.length > 0) {
      throw new Error(
        ['Invalid <Api> declarations:', ...diagnostics.map((diagnostic) => `- ${diagnostic}`)].join(
          '\n',
        ),
      );
    }

    const bindings = collectMdxEsmBindings(tree);
    let identifierIndex = 0;
    const imports = validNodes.map(({ from, name, node }) => {
      let identifier = `__lobe_docs_api_${identifierIndex++}`;
      while (bindings.has(identifier)) identifier = `__lobe_docs_api_${identifierIndex++}`;
      bindings.add(identifier);
      const request = { documentPath, ...(from === undefined ? {} : { from }), name };
      node.attributes = [...(node.attributes ?? []), dataAttribute(identifier)];
      return importNode(identifier, createApiVirtualModuleId(request));
    });

    tree.children.unshift(...imports);
  };
}
