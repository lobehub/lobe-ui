import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

import { createProcessor } from '@mdx-js/mdx';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import ts from 'typescript';
import { unified } from 'unified';
import type { Node } from 'unist';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const { basename, dirname, extname, relative, resolve } = path;

type DemoLayout = 'bare' | 'center' | 'default';
type ApiDisposition = 'preserve-all' | 'replace-all' | 'replace-tables';

interface DemoOptions {
  inline: boolean;
  isolated: boolean;
  layout: DemoLayout;
}

interface DemoReference {
  document: string;
  legacyId: string;
  options: DemoOptions;
  source: string;
}

interface DocumentRecord {
  description?: string;
  source: string;
}

interface CompatibilityManifest {
  demoReferences: DemoReference[];
  documents: DocumentRecord[];
}

export interface ApiTarget {
  from?: string;
  name: string;
}

export type ApiTableSelector =
  | { headingPath: string[]; occurrence?: number; unheadedOccurrence?: never }
  | { headingPath?: never; occurrence?: never; unheadedOccurrence: number };

export interface ApiMigrationConfig {
  bodySha?: string;
  disposition: ApiDisposition;
  reason?: string;
  tableSelectors?: ApiTableSelector[];
  targets?: ApiTarget[];
}

export interface DocumentMigrationConfig {
  api?: ApiMigrationConfig;
  apiHeader?: Record<string, unknown> | string;
  atomId?: string;
  category?: string;
  categoryOrder?: number;
  deliberateApiOmission?: { reason?: string } | boolean;
  description?: string;
  hero?: Record<string, unknown> | string;
  nav?: Record<string, unknown> | string;
  reviewedApiHeaderOverride?: boolean;
  subType?: string;
}

export interface FrozenInventoryConfig {
  apiSourceOverrides: number;
  componentApiDecisions: number;
  demoReferences: number;
  documents: number;
  initiallyMissingDescriptions: number;
  isolatedDemos: number;
  legacyManualApiSections: number;
}

export interface MigrationConfig {
  acknowledgedStandaloneOnly?: string[];
  documents?: Record<string, DocumentMigrationConfig>;
  frozenInventory?: FrozenInventoryConfig;
}

export interface Diagnostic {
  column: number;
  document: string;
  line: number;
  message: string;
}

export interface ApiBodyDispositionRecord {
  diagnostics?: string[];
  disposition: ApiDisposition | 'pending';
  document: string;
  manualContent: boolean;
  originalSha: string;
  preservedSha: string;
  reason?: string;
}

export interface ApiBodyDispositionReport {
  manualSections: number;
  missing: string[];
  records: ApiBodyDispositionRecord[];
}

export interface DocumentMigrationMetadata {
  apiHeader?: Record<string, unknown> | string;
  atomId?: string;
  category?: string;
  categoryOrder?: number;
  hero?: Record<string, unknown> | string;
  nav?: Record<string, unknown> | string;
  source: string;
  subType?: string;
}

export interface MigrationReport {
  acknowledgedStandaloneOnly: number;
  apiBodyDispositions: ApiBodyDispositionReport;
  apiSections: number;
  apiSourceOverrides: number;
  deliberateApiOmissions: number;
  destinationConflicts: Diagnostic[];
  duplicateAttributes: Diagnostic[];
  invariantDiagnostics: Diagnostic[];
  isolatedDemos: number;
  legacyDemoTags: number;
  legacyDocuments: number;
  metadata: DocumentMigrationMetadata[];
  migratedDemoUses: number;
  migratedDocuments: number;
  missingDescriptions: string[];
  pendingApiOmissions: string[];
  phase: 'discovery' | 'post-migration';
  unknownAttributes: Diagnostic[];
  unpersistedMetadata: Diagnostic[];
  unresolvedSources: Diagnostic[];
  wouldChange: string[];
}

export interface MigrateDumiDocsOptions {
  check: boolean;
  fileOperations?: Partial<MigrationFileOperations>;
  root: string;
  write?: boolean;
}

export interface MigrationFileOperations {
  unlink: (path: string) => void;
  writeFile: (path: string, contents: string) => void;
}

interface MdxAttribute extends Node {
  name?: string;
  value?: MdxAttributeExpression | null | string;
}

interface MdxAttributeExpression extends Node {
  value?: string;
}

interface MdxNode extends Node {
  attributes?: MdxAttribute[];
  children?: MdxNode[];
  data?: {
    estree?: {
      body?: EstreeStatement[];
    };
  };
  depth?: number;
  name?: string;
  url?: string;
  value?: string;
}

interface EstreeStatement {
  source?: { value?: unknown };
  specifiers?: Array<{ local?: { name?: string }; type?: string }>;
  type?: string;
}

interface TextEdit {
  end: number;
  start: number;
  text: string;
}

interface ExistingDemoImport {
  identifier: string;
  source: string;
}

interface ParsedElement {
  attributes: Map<string, MdxAttribute[]>;
  node: MdxNode;
}

interface ApiSection {
  bodyEnd: number;
  bodyNodes: MdxNode[];
  bodyStart: number;
  heading: MdxNode;
}

interface RecognizedApiTable {
  headingPath: string[];
  index: number;
  node: MdxNode;
}

interface SelectedApiTable {
  migrationKey?: string;
  table: RecognizedApiTable;
}

interface MigratedApiTarget extends ApiTarget {
  migrationKey?: string;
}

interface PlannedDocument {
  nextSource: string;
  originalSource: string;
  output: string;
}

interface PlannedWrite {
  contents: string;
  path: string;
  requireAbsent?: boolean;
}

interface FileSnapshot {
  contents?: string;
  existed: boolean;
}

interface DocumentAnalysis {
  apiSections: number;
  demoImports: ExistingDemoImport[];
  legacyDemoTags: number;
  manualApiSections: number;
  metadata: DocumentMigrationMetadata;
  migratedDemoUses: number;
  output: string;
}

const mdxProcessor = createProcessor({
  format: 'mdx',
  remarkPlugins: [[remarkFrontmatter, ['yaml']], remarkGfm],
});
const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter, ['yaml'])
  .use(remarkGfm);

const defaultFrozenInventory: FrozenInventoryConfig = {
  apiSourceOverrides: 79,
  componentApiDecisions: 158,
  demoReferences: 367,
  documents: 160,
  initiallyMissingDescriptions: 43,
  isolatedDemos: 35,
  legacyManualApiSections: 67,
};

const supportedDemoAttributes = new Set([
  'center',
  'id',
  'iframe',
  'inline',
  'noPadding',
  'nopadding',
  'src',
]);

const normalizePath = (path: string): string => path.replaceAll('\\', '/');
const documentStem = (path: string): string => normalizePath(path).replace(/\.mdx?$/, '');
const sha = (value: string): string =>
  createHash('sha256').update(value.replaceAll('\r\n', '\n')).digest('hex');
const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile();

const nodeStart = (node: Node): number => node.position?.start.offset ?? 0;
const nodeEnd = (node: Node): number => node.position?.end.offset ?? nodeStart(node);

const diagnosticFor = (document: string, node: Node, message: string): Diagnostic => ({
  column: node.position?.start.column ?? 1,
  document,
  line: node.position?.start.line ?? 1,
  message,
});

const readJson = <Value>(path: string): Value => JSON.parse(readFileSync(path, 'utf8')) as Value;

const readMigrationConfig = async (root: string): Promise<MigrationConfig> => {
  const typedPath = resolve(root, 'site/content/migration.ts');
  if (isFile(typedPath)) {
    const module = (await import(pathToFileURL(typedPath).href)) as { default?: unknown };
    if (!module.default || typeof module.default !== 'object') {
      throw new Error(`Typed migration metadata must export a default object: ${typedPath}`);
    }
    return module.default as MigrationConfig;
  }
  const jsonPath = resolve(root, 'site/content/migration.json');
  return isFile(jsonPath) ? readJson<MigrationConfig>(jsonPath) : {};
};

export const defineMigrationConfig = <Config extends MigrationConfig>(config: Config): Config =>
  config;

const configForDocument = (
  config: MigrationConfig,
  source: string,
): DocumentMigrationConfig | undefined => {
  const documents = config.documents ?? {};
  if (documents[source]) return documents[source];
  const stem = documentStem(source);
  return Object.entries(documents).find(([candidate]) => documentStem(candidate) === stem)?.[1];
};

const walk = (
  node: MdxNode,
  visitor: (node: MdxNode, parent: MdxNode | undefined) => void,
  parent?: MdxNode,
): void => {
  visitor(node, parent);
  for (const child of node.children ?? []) walk(child, visitor, node);
};

const textContent = (node: MdxNode): string => {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(textContent).join('');
};

const attributesFor = (node: MdxNode): Map<string, MdxAttribute[]> => {
  const attributes = new Map<string, MdxAttribute[]>();
  for (const attribute of node.attributes ?? []) {
    if (attribute.type !== 'mdxJsxAttribute' || typeof attribute.name !== 'string') continue;
    const values = attributes.get(attribute.name) ?? [];
    values.push(attribute);
    attributes.set(attribute.name, values);
  }
  return attributes;
};

const parseLegacyOpeningTag = (
  node: MdxNode,
  name: string,
): Map<string, MdxAttribute[]> | undefined => {
  if (node.type !== 'html' || typeof node.value !== 'string') return;
  const value = node.value.trim();
  if (!value.startsWith(`<${name}`)) return;
  const boundary = value[name.length + 1];
  if (boundary && !/[\s/>]/.test(boundary)) return;

  let index = name.length + 1;
  const attributes = new Map<string, MdxAttribute[]>();
  while (index < value.length) {
    while (/\s/.test(value[index] ?? '')) index += 1;
    if (value[index] === '>' || (value[index] === '/' && value[index + 1] === '>')) break;
    const nameStart = index;
    while (/[\w-]/.test(value[index] ?? '')) index += 1;
    const attributeName = value.slice(nameStart, index);
    if (!attributeName) return;
    while (/\s/.test(value[index] ?? '')) index += 1;

    let attributeValue: null | string = null;
    if (value[index] === '=') {
      index += 1;
      while (/\s/.test(value[index] ?? '')) index += 1;
      const quote = value[index] === '"' || value[index] === "'" ? value[index++] : undefined;
      const valueStart = index;
      if (quote) {
        while (index < value.length && value[index] !== quote) index += 1;
        if (value[index] !== quote) return;
        attributeValue = value.slice(valueStart, index);
        index += 1;
      } else {
        while (index < value.length && !/[\s>]/.test(value[index] ?? '')) index += 1;
        attributeValue = value.slice(valueStart, index);
      }
    }

    const attribute: MdxAttribute = {
      name: attributeName,
      position: node.position,
      type: 'mdxJsxAttribute',
      value: attributeValue,
    };
    const entries = attributes.get(attributeName) ?? [];
    entries.push(attribute);
    attributes.set(attributeName, entries);
  }
  return attributes;
};

const elementsNamed = (tree: MdxNode, name: string): ParsedElement[] => {
  const elements: ParsedElement[] = [];
  walk(tree, (node, parent) => {
    if (node.type === 'mdxJsxFlowElement' && node.name === name && parent?.type === 'root') {
      elements.push({ attributes: attributesFor(node), node });
      return;
    }
    if (node.type !== 'paragraph' || !parent) return;
    const children = node.children ?? [];
    const parsed: ParsedElement[] = [];
    let index = 0;
    while (index < children.length) {
      const opening = children[index];
      if (!opening) return;
      if (opening.type === 'text' && !opening.value?.trim()) {
        index += 1;
        continue;
      }
      const attributes = parseLegacyOpeningTag(opening, name);
      if (!attributes) return;
      const selfClosing = opening.value?.trim().endsWith('/>') ?? false;
      if (selfClosing) {
        parsed.push({ attributes, node: opening });
        index += 1;
        continue;
      }
      const closing = children[index + 1];
      if (closing?.type !== 'html' || closing.value?.trim() !== `</${name}>`) return;
      parsed.push({
        attributes,
        node: {
          position:
            opening.position && closing.position
              ? { end: closing.position.end, start: opening.position.start }
              : node.position,
          type: 'legacyElement',
        },
      });
      index += 2;
    }
    elements.push(...parsed);
  });
  return elements;
};

const stringAttribute = (attribute: MdxAttribute | undefined): string | undefined =>
  typeof attribute?.value === 'string' ? attribute.value : undefined;

const expressionAttribute = (attribute: MdxAttribute | undefined): string | undefined => {
  const value = attribute?.value;
  return value && typeof value === 'object' && typeof value.value === 'string'
    ? value.value.trim()
    : undefined;
};

const createDemoOptions = (attributes: Map<string, MdxAttribute[]>): DemoOptions => ({
  inline: attributes.has('inline'),
  isolated: attributes.has('iframe'),
  layout:
    attributes.has('nopadding') || attributes.has('noPadding')
      ? 'bare'
      : attributes.has('center')
        ? 'center'
        : 'default',
});

const readExistingDemoImports = (
  root: string,
  document: string,
  tree: MdxNode,
): ExistingDemoImport[] => {
  const imports: ExistingDemoImport[] = [];
  for (const node of tree.children ?? []) {
    if (node.type !== 'mdxjsEsm') continue;
    for (const statement of node.data?.estree?.body ?? []) {
      if (statement.type !== 'ImportDeclaration' || typeof statement.source?.value !== 'string')
        continue;
      const request = statement.source.value;
      if (!request.endsWith('?demo')) continue;
      const specifier = statement.specifiers?.find(({ type }) => type === 'ImportDefaultSpecifier');
      const identifier = specifier?.local?.name;
      if (!identifier) continue;
      const normalizedRequest = normalizePath(request.slice(0, -'?demo'.length));
      imports.push({
        identifier,
        source: normalizePath(relative(root, resolve(root, dirname(document), normalizedRequest))),
      });
    }
  }
  return imports;
};

const collectBindingName = (name: ts.BindingName, bindings: Set<string>): void => {
  if (ts.isIdentifier(name)) {
    bindings.add(name.text);
    return;
  }
  for (const element of name.elements) {
    if (ts.isBindingElement(element)) collectBindingName(element.name, bindings);
  }
};

const collectStatementBindings = (source: string, bindings: Set<string>): boolean => {
  const file = ts.createSourceFile(
    'mdx-esm.ts',
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );
  if (file.statements.length === 0) return false;
  for (const statement of file.statements) {
    if (ts.isImportDeclaration(statement)) {
      const clause = statement.importClause;
      if (clause?.name) bindings.add(clause.name.text);
      if (clause?.namedBindings) {
        if (ts.isNamespaceImport(clause.namedBindings))
          bindings.add(clause.namedBindings.name.text);
        else for (const element of clause.namedBindings.elements) bindings.add(element.name.text);
      }
    } else if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        collectBindingName(declaration.name, bindings);
      }
    } else if (
      (ts.isFunctionDeclaration(statement) ||
        ts.isClassDeclaration(statement) ||
        ts.isEnumDeclaration(statement)) &&
      statement.name
    ) {
      bindings.add(statement.name.text);
    } else if (ts.isExportDeclaration(statement) && statement.exportClause) {
      if (ts.isNamedExports(statement.exportClause)) {
        for (const element of statement.exportClause.elements) bindings.add(element.name.text);
      } else {
        bindings.add(statement.exportClause.name.text);
      }
    }
  }
  return true;
};

const authorBindings = (source: string, tree: MdxNode): Set<string> => {
  const bindings = new Set<string>();
  for (const child of tree.children ?? []) {
    if (child.type === 'mdxjsEsm' && typeof child.value === 'string') {
      collectStatementBindings(child.value, bindings);
      continue;
    }
    if (child.type !== 'paragraph') continue;
    const statement = source.slice(nodeStart(child), nodeEnd(child)).trim();
    if (
      /^(?:export\s+)?(?:async\s+)?(?:import|const|let|var|function|class|enum)\b/.test(statement)
    ) {
      collectStatementBindings(statement, bindings);
    }
  }
  return bindings;
};

const pascalCase = (value: string): string =>
  value
    .split(/[^A-Za-z\d]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('');

const importIdentifier = (source: string, used: Set<string>): string => {
  const base = basename(source, extname(source));
  const initial = `Demo${pascalCase(base) || 'Example'}`;
  let candidate = initial;
  let suffix = 2;
  while (used.has(candidate)) candidate = `${initial}${suffix++}`;
  used.add(candidate);
  return candidate;
};

const relativeImport = (document: string, source: string): string => {
  let request = normalizePath(relative(dirname(document), source));
  if (!request.startsWith('.')) request = `./${request}`;
  return request;
};

const demoMarkup = (identifier: string, options: DemoOptions): string => {
  const attributes = [`of={${identifier}}`];
  if (options.isolated) attributes.push('isolated');
  if (options.layout !== 'default') attributes.push(`layout="${options.layout}"`);
  return `<Demo ${attributes.join(' ')} />`;
};

const optionsMatch = (left: DemoOptions, right: DemoOptions, migrated: boolean): boolean =>
  left.isolated === right.isolated &&
  left.layout === right.layout &&
  (migrated || left.inline === right.inline);

const takeFrozenReference = (
  references: DemoReference[],
  used: Set<DemoReference>,
  source: string,
  options: DemoOptions,
  migrated: boolean,
): DemoReference | undefined => {
  const match = references.find(
    (reference) =>
      !used.has(reference) &&
      normalizePath(reference.source) === source &&
      optionsMatch(reference.options, options, migrated),
  );
  if (match) used.add(match);
  return match;
};

const applyEdits = (source: string, edits: TextEdit[]): string => {
  const sorted = [...edits].sort((left, right) => right.start - left.start || right.end - left.end);
  let output = source;
  let previousStart = source.length + 1;
  for (const edit of sorted) {
    if (edit.end > previousStart) throw new Error('Overlapping migration edits');
    output = `${output.slice(0, edit.start)}${edit.text}${output.slice(edit.end)}`;
    previousStart = edit.start;
  }
  return output;
};

const preserveLineEndings = (output: string, source: string): string =>
  source.includes('\r\n') ? output.replaceAll(/\r?\n/g, '\r\n') : output.replaceAll('\r\n', '\n');

const maskEscapedCodeTags = (source: string): string => {
  const characters = source.split('');
  let searchFrom = 0;
  while (searchFrom < source.length) {
    const start = source.indexOf('\\<code', searchFrom);
    if (start < 0) break;
    const closing = source.indexOf('</code>', start + 6);
    if (closing < 0) break;
    const end = closing + '</code>'.length;
    for (let index = start; index < end; index += 1) {
      if (characters[index] !== '\n' && characters[index] !== '\r') characters[index] = ' ';
    }
    searchFrom = end;
  }
  return characters.join('');
};

const apiMarkup = (targets: readonly ApiTarget[], migrationKeys?: readonly string[]): string =>
  targets
    .map(
      ({ from, name }, index) =>
        `<Api name=${JSON.stringify(name)}${from ? ` from=${JSON.stringify(from)}` : ''}${migrationKeys?.[index] ? ` migrationKey=${JSON.stringify(migrationKeys[index])}` : ''} />`,
    )
    .join('\n');

const apiSections = (tree: MdxNode, sourceLength: number): ApiSection[] => {
  const children = tree.children ?? [];
  const sections: ApiSection[] = [];
  for (const [index, child] of children.entries()) {
    if (
      child.type !== 'heading' ||
      child.depth !== 2 ||
      !/^apis?(?:\s+reference)?$/i.test(textContent(child).trim())
    ) {
      continue;
    }
    let endIndex = children.length;
    for (let candidate = index + 1; candidate < children.length; candidate += 1) {
      const next = children[candidate];
      if (next?.type === 'heading' && (next.depth ?? 7) <= 2) {
        endIndex = candidate;
        break;
      }
    }
    sections.push({
      bodyEnd: endIndex < children.length ? nodeStart(children[endIndex]) : sourceLength,
      bodyNodes: children.slice(index + 1, endIndex),
      bodyStart: nodeEnd(child),
      heading: child,
    });
  }
  return sections;
};

const removeNodeRanges = (source: string, start: number, end: number, nodes: MdxNode[]): string => {
  let body = source.slice(start, end);
  for (const node of [...nodes].sort((left, right) => nodeStart(right) - nodeStart(left))) {
    const localStart = nodeStart(node) - start;
    const localEnd = nodeEnd(node) - start;
    body = `${body.slice(0, localStart)}${body.slice(localEnd)}`;
  }
  return body;
};

const isApiComponent = (node: MdxNode): boolean =>
  node.type === 'mdxJsxFlowElement' && node.name === 'Api';

const apiComponentTarget = (node: MdxNode): MigratedApiTarget | undefined => {
  const attributes = attributesFor(node);
  if (
    (attributes.get('name')?.length ?? 0) !== 1 ||
    (attributes.get('from')?.length ?? 0) > 1 ||
    (attributes.get('migrationKey')?.length ?? 0) > 1
  ) {
    return;
  }
  const name = stringAttribute(attributes.get('name')?.[0]);
  const from = stringAttribute(attributes.get('from')?.[0]);
  const migrationKey = stringAttribute(attributes.get('migrationKey')?.[0]);
  if (!name) return;
  return {
    ...(from ? { from } : {}),
    ...(migrationKey ? { migrationKey } : {}),
    name,
  };
};

const apiTargetsMatch = (nodes: MdxNode[], targets: ApiTarget[]): boolean =>
  nodes.length === targets.length &&
  nodes.every((node, index) => {
    const actual = apiComponentTarget(node);
    const expected = targets[index];
    return actual?.name === expected?.name && actual?.from === expected?.from;
  });

const isRecognizedApiTable = (node: MdxNode): boolean => {
  if (node.type !== 'table') return false;
  const header = node.children?.[0];
  const columns = (header?.children ?? []).map((cell) => textContent(cell).trim().toLowerCase());
  const hasName = columns.some((column) =>
    ['attribute', 'name', 'prop', 'property'].includes(column),
  );
  return (
    hasName &&
    columns.includes('description') &&
    columns.some((column) => column === 'default' || column === 'type')
  );
};

const recognizedApiTables = (section: ApiSection): RecognizedApiTable[] => {
  const tables: RecognizedApiTable[] = [];
  const headingByDepth = new Map<number, string>();
  for (const node of section.bodyNodes) {
    if (node.type === 'heading' && (node.depth ?? 0) >= 3) {
      const depth = node.depth as number;
      for (const candidate of headingByDepth.keys()) {
        if (candidate >= depth) headingByDepth.delete(candidate);
      }
      const heading = textContent(node).trim();
      if (heading) headingByDepth.set(depth, heading);
      continue;
    }
    if (!isRecognizedApiTable(node)) continue;
    tables.push({
      headingPath: [...headingByDepth.entries()]
        .toSorted(([left], [right]) => left - right)
        .map(([, heading]) => heading),
      index: tables.length,
      node,
    });
  }
  return tables;
};

const sameHeadingPath = (left: readonly string[], right: readonly string[]): boolean =>
  left.length === right.length && left.every((heading, index) => heading === right[index]);

const migrationKeyForSelector = (
  selector: ApiTableSelector,
  diagnostics: string[],
): string | undefined => {
  const hasHeadingPath =
    Array.isArray(selector.headingPath) &&
    selector.headingPath.length > 0 &&
    selector.headingPath.every((heading) => typeof heading === 'string' && heading.trim());
  const hasUnheadedOccurrence = Number.isInteger(selector.unheadedOccurrence);
  if (hasHeadingPath === hasUnheadedOccurrence) {
    diagnostics.push(
      'Each API table selector must contain exactly one headingPath or unheadedOccurrence.',
    );
    return;
  }
  if (hasHeadingPath) {
    const headingPath = selector.headingPath?.map((heading) => heading.trim()) ?? [];
    const occurrence = selector.occurrence ?? 0;
    if (!Number.isInteger(occurrence) || occurrence < 0) {
      diagnostics.push('API table heading occurrence must be a non-negative integer.');
      return;
    }
    return `heading:${encodeURIComponent(JSON.stringify(headingPath))}:${occurrence}`;
  }
  const occurrence = selector.unheadedOccurrence as number;
  if (occurrence < 0) {
    diagnostics.push('API unheaded table occurrence must be a non-negative integer.');
    return;
  }
  return `unheaded:${occurrence}`;
};

const selectApiTables = (
  tables: RecognizedApiTable[],
  selectors: ApiTableSelector[] | undefined,
  targets: ApiTarget[],
  diagnostics: string[],
): SelectedApiTable[] => {
  if (!selectors) {
    if (tables.length !== 1 || targets.length !== 1) {
      diagnostics.push(
        `replace-tables found ${tables.length} recognized tables for ${targets.length} targets; multi-table or multi-target sections require explicit tableSelectors.`,
      );
      return [];
    }
    const table = tables[0];
    return table ? [{ table }] : [];
  }
  if (selectors.length !== targets.length) {
    diagnostics.push(
      `tableSelectors contains ${selectors.length} entries for ${targets.length} targets.`,
    );
  }

  const selected: SelectedApiTable[] = [];
  for (const selector of selectors) {
    const migrationKey = migrationKeyForSelector(selector, diagnostics);
    if (!migrationKey) continue;
    const hasHeadingPath = migrationKey.startsWith('heading:');

    let table: RecognizedApiTable | undefined;
    if (hasHeadingPath) {
      const headingPath = selector.headingPath?.map((heading) => heading.trim()) ?? [];
      const matches = tables.filter((candidate) =>
        sameHeadingPath(candidate.headingPath, headingPath),
      );
      const occurrence = selector.occurrence ?? 0;
      if (!Number.isInteger(occurrence) || occurrence < 0 || occurrence >= matches.length) {
        diagnostics.push(
          `API table heading path ${JSON.stringify(headingPath)} occurrence ${occurrence} is outside the matching table range.`,
        );
        continue;
      }
      if (matches.length > 1 && selector.occurrence === undefined) {
        diagnostics.push(
          `API table heading path ${JSON.stringify(headingPath)} matched ${matches.length} recognized tables; add an occurrence.`,
        );
        continue;
      }
      table = matches[occurrence];
    } else {
      const occurrence = selector.unheadedOccurrence as number;
      const matches = tables.filter(({ headingPath }) => headingPath.length === 0);
      if (occurrence < 0 || occurrence >= matches.length) {
        diagnostics.push(
          `API unheaded table occurrence ${occurrence} is outside the unheaded table range.`,
        );
        continue;
      }
      table = matches[occurrence];
    }

    if (selected.some((entry) => entry.table === table)) {
      diagnostics.push(`API table index ${table.index} was already selected by another target.`);
      continue;
    }
    selected.push({ migrationKey, table });
  }
  return selected;
};

const apiTargetsWithSelectorsMatch = (
  nodes: MdxNode[],
  targets: ApiTarget[],
  selectors: ApiTableSelector[],
  diagnostics: string[],
): boolean => {
  if (selectors.length !== targets.length) {
    diagnostics.push(
      `tableSelectors contains ${selectors.length} entries for ${targets.length} targets.`,
    );
    return false;
  }
  const expected = new Map<string, ApiTarget>();
  for (const [index, selector] of selectors.entries()) {
    const key = migrationKeyForSelector(selector, diagnostics);
    const target = targets[index];
    if (!key || !target) continue;
    if (expected.has(key)) {
      diagnostics.push(`API migration selector ${JSON.stringify(key)} is duplicated.`);
      continue;
    }
    expected.set(key, target);
  }
  if (nodes.length !== targets.length) {
    diagnostics.push(
      `Found ${nodes.length} generated Api components for ${targets.length} targets.`,
    );
  }
  for (const node of nodes) {
    const actual = apiComponentTarget(node);
    if (!actual?.migrationKey) {
      diagnostics.push('Generated Api component is missing its migrationKey provenance.');
      continue;
    }
    const target = expected.get(actual.migrationKey);
    if (!target || target.name !== actual.name || target.from !== actual.from) {
      diagnostics.push(
        `Generated Api migrationKey ${JSON.stringify(actual.migrationKey)} does not match its reviewed target.`,
      );
      continue;
    }
    expected.delete(actual.migrationKey);
  }
  if (expected.size > 0) {
    diagnostics.push(
      `${expected.size} reviewed API table selectors have no generated Api component.`,
    );
  }
  return diagnostics.length === 0;
};

const apiDisposition = (
  source: string,
  document: string,
  section: ApiSection,
  config: ApiMigrationConfig | undefined,
  edits: TextEdit[],
): ApiBodyDispositionRecord => {
  const tables = recognizedApiTables(section);
  const migratedApis = section.bodyNodes.filter(isApiComponent);
  const diagnostics: string[] = [];
  const original = source.slice(section.bodyStart, section.bodyEnd);
  const automatic = migratedApis.length > 0 && !config;
  const disposition = automatic ? 'preserve-all' : config?.disposition;
  const reason = automatic ? 'Already migrated to the generated Api component.' : config?.reason;
  const targets = config?.targets ?? [];
  const selectedTables =
    disposition === 'replace-tables' && migratedApis.length === 0
      ? selectApiTables(tables, config?.tableSelectors, targets, diagnostics)
      : [];
  const removableNodes = [...selectedTables.map(({ table }) => table.node), ...migratedApis];
  const preservedBody = removeNodeRanges(
    source,
    section.bodyStart,
    section.bodyEnd,
    removableNodes,
  ).trim();
  const frozenManualNodes = section.bodyNodes.filter(
    (node) => !tables.some((table) => table.node === node) && !migratedApis.includes(node),
  );
  const frozenManualBody = removeNodeRanges(source, section.bodyStart, section.bodyEnd, [
    ...tables.map(({ node }) => node),
    ...migratedApis,
  ]).trim();
  const originalSha = sha(original);
  const manualContent =
    Boolean(frozenManualBody) && frozenManualNodes.some(({ type }) => type !== 'heading');
  const preservedSha = sha(disposition === 'replace-tables' ? preservedBody : original);
  const invalidReason =
    (disposition === 'preserve-all' || disposition === 'replace-all') && !reason?.trim();
  const invalidTargets =
    (disposition === 'replace-all' || disposition === 'replace-tables') && targets.length === 0;
  const migratedTargetsMatch =
    migratedApis.length > 0 &&
    (config?.tableSelectors && disposition === 'replace-tables'
      ? apiTargetsWithSelectorsMatch(migratedApis, targets, config.tableSelectors, diagnostics)
      : apiTargetsMatch(migratedApis, targets));
  const invalidTables =
    disposition === 'replace-tables' &&
    (migratedApis.length > 0
      ? !migratedTargetsMatch
      : selectedTables.length !== targets.length || diagnostics.length > 0);
  const alreadyMigratedReplaceAll =
    disposition === 'replace-all' && migratedTargetsMatch && tables.length === 0 && !manualContent;
  const invalidSha =
    Boolean(config) && !alreadyMigratedReplaceAll && config?.bodySha !== preservedSha;

  if (!disposition) diagnostics.push('API body disposition is not reviewed.');
  if (invalidReason) diagnostics.push(`${disposition} requires an explicit reviewed reason.`);
  if (invalidTargets) diagnostics.push(`${disposition} requires at least one callable API target.`);
  if (invalidTables && diagnostics.length === 0) {
    diagnostics.push('Generated API targets do not match the selected legacy tables.');
  }
  if (invalidSha) diagnostics.push('Reviewed API body SHA does not match the preserved body.');

  if (disposition === 'replace-tables' && !invalidTargets && !invalidTables) {
    for (const [index, selected] of selectedTables.entries()) {
      const target = targets[index];
      if (target) {
        edits.push({
          end: nodeEnd(selected.table.node),
          start: nodeStart(selected.table.node),
          text: apiMarkup([target], selected.migrationKey ? [selected.migrationKey] : undefined),
        });
      }
    }
  }
  if (disposition === 'replace-all' && !invalidReason && !invalidTargets) {
    const trailingSpacing = section.bodyEnd === source.length ? '\n' : '\n\n';
    edits.push({
      end: section.bodyEnd,
      start: section.bodyStart,
      text: `\n\n${apiMarkup(targets)}${trailingSpacing}`,
    });
  }

  const accepted =
    disposition && !invalidReason && !invalidTargets && !invalidTables && !invalidSha;
  return {
    ...(diagnostics.length > 0 ? { diagnostics } : {}),
    disposition: accepted ? disposition : 'pending',
    document,
    manualContent,
    originalSha,
    preservedSha,
    ...(accepted && reason ? { reason } : {}),
  };
};

const frontmatterRecord = (tree: MdxNode): { node?: MdxNode; value: Record<string, unknown> } => {
  const node = (tree.children ?? []).find(({ type }) => type === 'yaml');
  if (!node || typeof node.value !== 'string') return { value: {} };
  const parsed = parseYaml(node.value);
  return {
    node,
    value: parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {},
  };
};

const stringValue = (value: unknown): string | undefined =>
  typeof value === 'string' && value.trim() ? value : undefined;

const structuredValue = (value: unknown): Record<string, unknown> | string | undefined =>
  typeof value === 'string' ||
  (value !== null && typeof value === 'object' && !Array.isArray(value))
    ? (value as Record<string, unknown> | string)
    : undefined;

const metadataFor = (
  source: string,
  frontmatter: Record<string, unknown>,
  config: DocumentMigrationConfig | undefined,
): DocumentMigrationMetadata => {
  const group = frontmatter.group;
  const groupRecord =
    group && typeof group === 'object' && !Array.isArray(group)
      ? (group as Record<string, unknown>)
      : undefined;
  const category =
    stringValue(config?.category) ??
    stringValue(frontmatter.category) ??
    stringValue(group) ??
    stringValue(groupRecord?.title);
  const legacyCategoryOrder =
    typeof groupRecord?.order === 'number' ? groupRecord.order : Number(groupRecord?.order);
  const categoryOrder = config?.categoryOrder ?? legacyCategoryOrder;
  const apiHeader = structuredValue(config?.apiHeader) ?? structuredValue(frontmatter.apiHeader);
  const atomId = stringValue(config?.atomId) ?? stringValue(frontmatter.atomId);
  const hero = structuredValue(config?.hero) ?? structuredValue(frontmatter.hero);
  const nav = structuredValue(config?.nav) ?? structuredValue(frontmatter.nav);
  const subType = stringValue(config?.subType) ?? stringValue(frontmatter.subType);
  return {
    ...(apiHeader ? { apiHeader } : {}),
    ...(atomId ? { atomId } : {}),
    ...(category ? { category } : {}),
    ...(Number.isFinite(categoryOrder) ? { categoryOrder } : {}),
    ...(hero ? { hero } : {}),
    ...(nav ? { nav } : {}),
    source,
    ...(subType ? { subType } : {}),
  };
};

const normalizedFrontmatter = (
  frontmatter: Record<string, unknown>,
  config: DocumentMigrationConfig | undefined,
): Record<string, unknown> => {
  const group = frontmatter.group;
  const groupRecord =
    group && typeof group === 'object' && !Array.isArray(group)
      ? (group as Record<string, unknown>)
      : undefined;
  const hero = frontmatter.hero;
  const heroRecord =
    hero && typeof hero === 'object' && !Array.isArray(hero)
      ? (hero as Record<string, unknown>)
      : undefined;
  const category =
    stringValue(config?.category) ??
    stringValue(frontmatter.category) ??
    stringValue(group) ??
    stringValue(groupRecord?.title);
  const title = stringValue(frontmatter.title) ?? stringValue(heroRecord?.title);
  const description =
    stringValue(frontmatter.description) ??
    config?.description ??
    stringValue(heroRecord?.description);
  const core: Record<string, unknown> = {};
  if (title) core.title = title;
  if (description) core.description = description;
  if (category) core.category = category;
  for (const key of ['order', 'status', 'since', 'route']) {
    if (frontmatter[key] !== undefined) core[key] = frontmatter[key];
  }
  const removed = new Set([
    'apiHeader',
    'atomId',
    'category',
    'description',
    'group',
    'hero',
    'nav',
    'order',
    'route',
    'since',
    'status',
    'subType',
    'title',
  ]);
  for (const [key, value] of Object.entries(frontmatter)) {
    if (!removed.has(key)) core[key] = value;
  }
  return core;
};

const hasLegacyFrontmatter = (frontmatter: Record<string, unknown>): boolean =>
  ['apiHeader', 'atomId', 'group', 'hero', 'nav', 'subType'].some(
    (key) => frontmatter[key] !== undefined,
  );

const migrationOnlyMetadataKeys = [
  'apiHeader',
  'atomId',
  'categoryOrder',
  'hero',
  'nav',
  'subType',
] as const satisfies readonly (keyof DocumentMigrationMetadata)[];

const validateMetadataPersistence = ({
  config,
  document,
  frontmatter,
  node,
  unpersistedMetadata,
}: {
  config: DocumentMigrationConfig | undefined;
  document: string;
  frontmatter: Record<string, unknown>;
  node: MdxNode;
  unpersistedMetadata: Diagnostic[];
}): void => {
  const extracted = metadataFor(document, frontmatter, undefined);
  const configured = metadataFor(document, {}, config);
  for (const key of migrationOnlyMetadataKeys) {
    if (extracted[key] === undefined || isDeepStrictEqual(extracted[key], configured[key]))
      continue;
    if (
      key === 'apiHeader' &&
      config?.reviewedApiHeaderOverride === true &&
      configured.apiHeader !== undefined
    ) {
      continue;
    }
    unpersistedMetadata.push(
      diagnosticFor(
        document,
        node,
        `Migration-only metadata "${key}" must be represented equivalently in reviewed config before removal.`,
      ),
    );
  }
};

const insertionEdit = (tree: MdxNode, imports: string[]): TextEdit | undefined => {
  if (imports.length === 0) return;
  const children = tree.children ?? [];
  const esm = children.filter(({ type }) => type === 'mdxjsEsm');
  const yaml = children.find(({ type }) => type === 'yaml');
  const anchor = esm.at(-1) ?? yaml;
  const start = anchor ? nodeEnd(anchor) : 0;
  return {
    end: start,
    start,
    text: `${start === 0 ? '' : '\n\n'}${imports.join('\n')}`,
  };
};

const transformChangelogEmbed = (tree: MdxNode, edits: TextEdit[], imports: string[]): void => {
  for (const element of elementsNamed(tree, 'embed')) {
    const source = stringAttribute(element.attributes.get('src')?.[0]);
    if (source !== '../CHANGELOG.md') continue;
    edits.push({
      end: nodeEnd(element.node),
      start: nodeStart(element.node),
      text: '<Changelog />',
    });
    imports.push("import Changelog from '../CHANGELOG.md';");
  }
};

const analyzeDocument = ({
  apiRecords,
  config,
  document,
  duplicateAttributes,
  frozenReferences,
  root,
  source,
  unknownAttributes,
  unpersistedMetadata,
  unresolvedSources,
  usedReferences,
}: {
  apiRecords: ApiBodyDispositionRecord[];
  config: DocumentMigrationConfig | undefined;
  document: string;
  duplicateAttributes: Diagnostic[];
  frozenReferences: DemoReference[];
  root: string;
  source: string;
  unknownAttributes: Diagnostic[];
  unpersistedMetadata: Diagnostic[];
  unresolvedSources: Diagnostic[];
  usedReferences: Set<DemoReference>;
}): DocumentAnalysis => {
  let tree: MdxNode;
  try {
    tree = (
      document.endsWith('.mdx')
        ? mdxProcessor.parse({ path: document, value: maskEscapedCodeTags(source) })
        : markdownProcessor.parse(source)
    ) as MdxNode;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${document}: ${message}`, { cause: error });
  }
  const edits: TextEdit[] = [];
  const newImports: string[] = [];
  const existingImports = readExistingDemoImports(root, document, tree);
  const importsBySource = new Map(existingImports.map((entry) => [entry.source, entry.identifier]));
  const usedIdentifiers = authorBindings(source, tree);
  for (const { identifier } of existingImports) usedIdentifiers.add(identifier);
  let legacyDemoTags = 0;
  let migratedDemoUses = 0;

  for (const element of elementsNamed(tree, 'code')) {
    const { attributes, node: child } = element;
    for (const [name, nodes] of attributes) {
      if (nodes.length > 1) {
        duplicateAttributes.push(
          diagnosticFor(document, nodes[1] ?? child, `Duplicate legacy demo attribute "${name}".`),
        );
      }
      if (supportedDemoAttributes.has(name)) continue;
      for (const node of nodes) {
        unknownAttributes.push(
          diagnosticFor(document, node, `Unknown legacy demo attribute "${name}".`),
        );
      }
    }
    const sourceAttribute = stringAttribute(attributes.get('src')?.[0]);
    if (!sourceAttribute) {
      unresolvedSources.push(
        diagnosticFor(document, child, 'Legacy demo tag is missing a string source attribute.'),
      );
      continue;
    }
    const normalizedRequest = normalizePath(sourceAttribute);
    const absoluteSource = resolve(root, dirname(document), normalizedRequest);
    const canonicalSource = normalizePath(relative(root, absoluteSource));
    const options = createDemoOptions(attributes);
    if (!isFile(absoluteSource)) {
      unresolvedSources.push(
        diagnosticFor(document, child, `Demo source "${sourceAttribute}" does not exist.`),
      );
    }
    const frozen = takeFrozenReference(
      frozenReferences,
      usedReferences,
      canonicalSource,
      options,
      false,
    );
    if (!frozen) {
      unresolvedSources.push(
        diagnosticFor(
          document,
          child,
          `Demo source "${sourceAttribute}" and its option contract are absent from the frozen inventory.`,
        ),
      );
    }
    let identifier = importsBySource.get(canonicalSource);
    if (!identifier) {
      identifier = importIdentifier(canonicalSource, usedIdentifiers);
      importsBySource.set(canonicalSource, identifier);
      newImports.push(
        `import ${identifier} from '${relativeImport(document, canonicalSource)}?demo';`,
      );
    }
    edits.push({
      end: nodeEnd(child),
      start: nodeStart(child),
      text: demoMarkup(identifier, options),
    });
    legacyDemoTags += 1;
  }

  for (const element of elementsNamed(tree, 'Demo')) {
    const { attributes, node: child } = element;
    const identifier = expressionAttribute(attributes.get('of')?.[0]);
    const imported = existingImports.find((entry) => entry.identifier === identifier);
    if (!identifier || !imported) {
      unresolvedSources.push(
        diagnosticFor(
          document,
          child,
          'Migrated Demo must reference a local ?demo default import.',
        ),
      );
      continue;
    }
    const layout = stringAttribute(attributes.get('layout')?.[0]);
    const options: DemoOptions = {
      inline: false,
      isolated: attributes.has('isolated'),
      layout: layout === 'bare' || layout === 'center' ? layout : 'default',
    };
    const frozen = takeFrozenReference(
      frozenReferences,
      usedReferences,
      imported.source,
      options,
      true,
    );
    if (!frozen) {
      unresolvedSources.push(
        diagnosticFor(
          document,
          child,
          `Migrated demo import "${imported.source}" is absent from the frozen inventory.`,
        ),
      );
      continue;
    }
    migratedDemoUses += 1;
  }

  if (document.endsWith('.md')) {
    walk(tree, (node) => {
      if (node.type !== 'link' || !node.url) return;
      const original = source.slice(nodeStart(node), nodeEnd(node));
      if (!original.startsWith('<') || !original.endsWith('>')) return;
      edits.push({
        end: nodeEnd(node),
        start: nodeStart(node),
        text: `[${textContent(node)}](${node.url})`,
      });
    });
  }

  const frontmatter = frontmatterRecord(tree);
  const metadata = metadataFor(document, frontmatter.value, config);
  if (frontmatter.node && (document.endsWith('.md') || hasLegacyFrontmatter(frontmatter.value))) {
    validateMetadataPersistence({
      config,
      document,
      frontmatter: frontmatter.value,
      node: frontmatter.node,
      unpersistedMetadata,
    });
  }
  const sections = apiSections(tree, source.length);
  let manualApiSections = 0;
  for (const section of sections) {
    const record = apiDisposition(source, document, section, config?.api, edits);
    apiRecords.push(record);
    if (record.manualContent) manualApiSections += 1;
  }

  if (frontmatter.node && (document.endsWith('.md') || hasLegacyFrontmatter(frontmatter.value))) {
    const normalized = normalizedFrontmatter(frontmatter.value, config);
    edits.push({
      end: nodeEnd(frontmatter.node),
      start: nodeStart(frontmatter.node),
      text: `---\n${stringifyYaml(normalized, { lineWidth: 0 }).trimEnd()}\n---`,
    });
  }

  transformChangelogEmbed(tree, edits, newImports);
  const importEdit = insertionEdit(tree, newImports);
  if (importEdit) edits.push(importEdit);

  return {
    apiSections: sections.length,
    demoImports: existingImports,
    legacyDemoTags,
    manualApiSections,
    metadata,
    migratedDemoUses,
    output: preserveLineEndings(applyEdits(source, edits), source),
  };
};

const reportHasBlockers = (report: MigrationReport): boolean =>
  report.apiBodyDispositions.missing.length > 0 ||
  report.destinationConflicts.length > 0 ||
  report.duplicateAttributes.length > 0 ||
  report.invariantDiagnostics.length > 0 ||
  report.missingDescriptions.length > 0 ||
  report.pendingApiOmissions.length > 0 ||
  report.unknownAttributes.length > 0 ||
  report.unpersistedMetadata.length > 0 ||
  report.unresolvedSources.length > 0;

export class MigrationBlockedError extends Error {
  readonly report: MigrationReport;

  constructor(report: MigrationReport) {
    super('Dumi documentation migration is blocked; inspect the attached discovery report.');
    this.name = 'MigrationBlockedError';
    this.report = report;
  }
}

const snapshot = (path: string): FileSnapshot =>
  isFile(path) ? { contents: readFileSync(path, 'utf8'), existed: true } : { existed: false };

const restoreSnapshot = (path: string, previous: FileSnapshot): void => {
  if (previous.existed) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, previous.contents ?? '');
  } else if (isFile(path)) {
    unlinkSync(path);
  }
};

const promoteMigration = ({
  deletes,
  fileOperations,
  writes,
}: {
  deletes: string[];
  fileOperations: Partial<MigrationFileOperations> | undefined;
  writes: PlannedWrite[];
}): void => {
  const operations: MigrationFileOperations = {
    unlink: fileOperations?.unlink ?? ((path) => unlinkSync(path)),
    writeFile:
      fileOperations?.writeFile ?? ((path, contents) => writeFileSync(path, contents, 'utf8')),
  };
  const writeSnapshots = new Map(writes.map(({ path }) => [path, snapshot(path)]));
  const deleteSnapshots = new Map(deletes.map((path) => [path, snapshot(path)]));

  try {
    // Complete every potentially failing output write before removing any legacy source.
    for (const write of writes) {
      if (write.requireAbsent && existsSync(write.path)) {
        throw new Error(`Refusing to overwrite migration destination: ${write.path}`);
      }
      mkdirSync(dirname(write.path), { recursive: true });
      operations.writeFile(write.path, write.contents);
    }
    for (const path of deletes) operations.unlink(path);
  } catch (error) {
    // Rollback deliberately uses the trusted filesystem primitives so an injected
    // promotion failure cannot also suppress restoration.
    for (const [path, previous] of deleteSnapshots) restoreSnapshot(path, previous);
    for (const [path, previous] of writeSnapshots) restoreSnapshot(path, previous);
    throw error;
  }
};

export async function migrateDumiDocs(options: MigrateDumiDocsOptions): Promise<MigrationReport> {
  const root = resolve(options.root);
  const compatibilityPath = resolve(root, 'site/content/compatibility.json');
  const compatibility = readJson<CompatibilityManifest>(compatibilityPath);
  const config = await readMigrationConfig(root);
  const unknownAttributes: Diagnostic[] = [];
  const duplicateAttributes: Diagnostic[] = [];
  const destinationConflicts: Diagnostic[] = [];
  const unpersistedMetadata: Diagnostic[] = [];
  const unresolvedSources: Diagnostic[] = [];
  const invariantDiagnostics: Diagnostic[] = [];
  const apiRecords: ApiBodyDispositionRecord[] = [];
  const metadata: DocumentMigrationMetadata[] = [];
  const missingDescriptions: string[] = [];
  const pendingApiOmissions: string[] = [];
  const usedReferences = new Set<DemoReference>();
  const planned: PlannedDocument[] = [];
  let legacyDocuments = 0;
  let migratedDocuments = 0;
  let legacyDemoTags = 0;
  let migratedDemoUses = 0;
  let apiSectionsCount = 0;
  let manualApiSections = 0;
  let discoveryManualApiSections = 0;
  let discoveryMissingDescriptions = 0;
  let deliberateApiOmissions = 0;

  for (const record of compatibility.documents) {
    const sourcePath = resolve(root, record.source);
    const source = readFileSync(sourcePath, 'utf8');
    const documentConfig = configForDocument(config, record.source);
    if (record.source.endsWith('.mdx')) migratedDocuments += 1;
    else legacyDocuments += 1;
    if (!record.description) discoveryMissingDescriptions += 1;
    if (!record.description && !documentConfig?.description)
      missingDescriptions.push(record.source);

    const frozenReferences = compatibility.demoReferences.filter(
      (reference) => documentStem(reference.document) === documentStem(record.source),
    );
    const analysis = analyzeDocument({
      apiRecords,
      config: documentConfig,
      document: record.source,
      duplicateAttributes,
      frozenReferences,
      root,
      source,
      unknownAttributes,
      unpersistedMetadata,
      unresolvedSources,
      usedReferences,
    });
    metadata.push(analysis.metadata);
    legacyDemoTags += analysis.legacyDemoTags;
    migratedDemoUses += analysis.migratedDemoUses;
    apiSectionsCount += analysis.apiSections;
    manualApiSections += analysis.manualApiSections;
    if (record.source.endsWith('.md')) discoveryManualApiSections += analysis.manualApiSections;

    if (record.source.startsWith('src/') && analysis.apiSections === 0) {
      deliberateApiOmissions += 1;
      const omission = documentConfig?.deliberateApiOmission;
      if (
        !omission ||
        typeof omission !== 'object' ||
        typeof omission.reason !== 'string' ||
        !omission.reason.trim()
      ) {
        pendingApiOmissions.push(record.source);
      }
    }

    const nextSource = record.source.replace(/\.md$/, '.mdx');
    if (nextSource !== record.source && existsSync(resolve(root, nextSource))) {
      destinationConflicts.push({
        column: 1,
        document: record.source,
        line: 1,
        message: `Migration destination "${nextSource}" already exists and is not an owned migrated input.`,
      });
    }
    planned.push({
      nextSource,
      originalSource: record.source,
      output: analysis.output,
    });
  }

  const acknowledgedIds = new Set(config.acknowledgedStandaloneOnly ?? []);
  let acknowledgedStandaloneOnly = 0;
  for (const reference of compatibility.demoReferences) {
    if (usedReferences.has(reference)) continue;
    const isFrozenHomepageOnly =
      documentStem(reference.document) === 'docs/index' &&
      normalizePath(reference.source) === 'docs/index.tsx';
    if (acknowledgedIds.has(reference.legacyId) || isFrozenHomepageOnly) {
      acknowledgedStandaloneOnly += 1;
      usedReferences.add(reference);
      continue;
    }
    unresolvedSources.push({
      column: 1,
      document: reference.document,
      line: 1,
      message: `Frozen demo "${reference.legacyId}" has no legacy tag, migrated Demo use, or standalone-only acknowledgment.`,
    });
  }

  const apiMissing = apiRecords
    .filter(({ disposition }) => disposition === 'pending')
    .map(({ document }) => document)
    .filter((document, index, entries) => entries.indexOf(document) === index)
    .sort();
  const wouldChange = planned
    .filter(
      ({ nextSource, originalSource, output }) =>
        nextSource !== originalSource ||
        output !== readFileSync(resolve(root, originalSource), 'utf8'),
    )
    .map(({ originalSource }) => originalSource);

  const report: MigrationReport = {
    acknowledgedStandaloneOnly,
    apiBodyDispositions: {
      manualSections: manualApiSections,
      missing: apiMissing,
      records: apiRecords,
    },
    apiSections: apiSectionsCount,
    apiSourceOverrides: metadata.filter(({ apiHeader }) => apiHeader !== undefined).length,
    deliberateApiOmissions,
    destinationConflicts,
    duplicateAttributes,
    invariantDiagnostics,
    isolatedDemos: compatibility.demoReferences.filter(({ options: demo }) => demo.isolated).length,
    legacyDemoTags,
    legacyDocuments,
    metadata,
    migratedDemoUses,
    migratedDocuments,
    missingDescriptions: missingDescriptions.sort(),
    pendingApiOmissions: pendingApiOmissions.sort(),
    phase: legacyDocuments > 0 ? 'discovery' : 'post-migration',
    unknownAttributes,
    unpersistedMetadata,
    unresolvedSources,
    wouldChange,
  };

  const componentDocuments = compatibility.documents.filter(({ source }) =>
    source.startsWith('src/'),
  ).length;
  const invariant = (actual: number, expected: number, message: string): void => {
    if (actual === expected) return;
    invariantDiagnostics.push({ column: 1, document: compatibilityPath, line: 1, message });
  };
  invariant(
    legacyDocuments + migratedDocuments,
    compatibility.documents.length,
    'Document buckets do not cover the frozen inventory.',
  );
  invariant(
    legacyDemoTags + migratedDemoUses + acknowledgedStandaloneOnly,
    compatibility.demoReferences.length,
    'Demo buckets do not cover the frozen inventory.',
  );
  invariant(
    apiSectionsCount + deliberateApiOmissions,
    componentDocuments,
    'API sections and deliberate omissions do not cover component documents.',
  );
  const frozenInventory = config.frozenInventory ?? defaultFrozenInventory;
  invariant(
    legacyDocuments + migratedDocuments,
    frozenInventory.documents,
    `Expected ${frozenInventory.documents} frozen public documents.`,
  );
  invariant(
    legacyDemoTags + migratedDemoUses + acknowledgedStandaloneOnly,
    frozenInventory.demoReferences,
    `Expected ${frozenInventory.demoReferences} frozen demo references.`,
  );
  invariant(
    apiSectionsCount + deliberateApiOmissions,
    frozenInventory.componentApiDecisions,
    `Expected ${frozenInventory.componentApiDecisions} component API decisions.`,
  );
  invariant(
    report.isolatedDemos,
    frozenInventory.isolatedDemos,
    `Expected ${frozenInventory.isolatedDemos} isolated demo decisions.`,
  );
  if (report.phase === 'discovery') {
    invariant(
      report.apiSourceOverrides,
      frozenInventory.apiSourceOverrides,
      `Expected ${frozenInventory.apiSourceOverrides} API/source-link overrides.`,
    );
    invariant(
      discoveryManualApiSections,
      frozenInventory.legacyManualApiSections,
      `Expected ${frozenInventory.legacyManualApiSections} legacy API sections with manual prose, notes, examples, or code.`,
    );
    invariant(
      discoveryMissingDescriptions,
      frozenInventory.initiallyMissingDescriptions,
      `Expected ${frozenInventory.initiallyMissingDescriptions} initially missing descriptions in the frozen inventory.`,
    );
  }

  if (options.write) {
    if (reportHasBlockers(report)) throw new MigrationBlockedError(report);
    const writes: PlannedWrite[] = [];
    const deletes: string[] = [];
    for (const document of planned) {
      const sourcePath = resolve(root, document.originalSource);
      const outputPath = resolve(root, document.nextSource);
      if (document.output !== readFileSync(sourcePath, 'utf8') || outputPath !== sourcePath) {
        writes.push({
          contents: document.output,
          path: outputPath,
          requireAbsent: outputPath !== sourcePath,
        });
      }
      if (outputPath !== sourcePath && isFile(sourcePath)) deletes.push(sourcePath);
    }
    const migratedCompatibility: CompatibilityManifest = {
      ...compatibility,
      demoReferences: compatibility.demoReferences.map((reference) => ({
        ...reference,
        document: reference.document.replace(/\.md$/, '.mdx'),
      })),
      documents: compatibility.documents.map((document) => ({
        ...document,
        source: document.source.replace(/\.md$/, '.mdx'),
      })),
    };
    const compatibilityOutput = `${JSON.stringify(migratedCompatibility, null, 2)}\n`;
    if (readFileSync(compatibilityPath, 'utf8') !== compatibilityOutput) {
      writes.push({ contents: compatibilityOutput, path: compatibilityPath });
    }
    promoteMigration({ deletes, fileOperations: options.fileOperations, writes });
  }

  return report;
}

const runCli = async (): Promise<void> => {
  const arguments_ = process.argv.slice(2);
  const rootIndex = arguments_.indexOf('--root');
  const root =
    rootIndex >= 0 && arguments_[rootIndex + 1]
      ? resolve(arguments_[rootIndex + 1])
      : resolve(import.meta.dirname, '..');
  const write = arguments_.includes('--write');
  const check = arguments_.includes('--check') || !write;
  try {
    const report = await migrateDumiDocs({ check, root, write });
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    if (
      reportHasBlockers(report) ||
      (check && report.phase === 'post-migration' && report.wouldChange.length > 0)
    ) {
      process.exitCode = 1;
    }
  } catch (error) {
    if (error instanceof MigrationBlockedError) {
      process.stdout.write(`${JSON.stringify(error.report, null, 2)}\n`);
      process.exitCode = 1;
      return;
    }
    throw error;
  }
};

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  void runCli().catch((error: unknown) => {
    const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
    process.stderr.write(`${message}\n`);
    process.exitCode = 1;
  });
}
