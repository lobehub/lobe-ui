import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';

import remarkFrontmatter from 'remark-frontmatter';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import type { Node, Parent } from 'unist';

import { packageNamespaces } from '../../config/packageNamespaces';
import { createLegacyDemoId } from './legacyDumiIds';
import type { DemoOptions, DemoReference, DocumentationInventory, DocumentRecord } from './types';

interface FrontmatterRecord {
  [key: string]: FrontmatterRecord | string;
}

interface ParsedCodeTag {
  attributes: Map<string, string | true>;
}

const publicDocumentationFiles = ['docs/index.md', 'docs/changelog.md'] as const;
const packageSectionLabels: Record<(typeof packageNamespaces)[number], string> = {
  'awesome': 'Awesome',
  'base-ui': 'Base UI',
  'brand': 'Brand',
  'chat': 'Chat',
  'color': 'Color',
  'icons': 'Icons',
  'mdx': 'Mdx',
  'mobile': 'Mobile',
  'storybook': 'StoryBook',
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

const sortStrings = (left: string, right: string): number =>
  left === right ? 0 : left < right ? -1 : 1;

const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile();

const collectSourceDocuments = (directory: string): string[] => {
  if (!existsSync(directory) || !statSync(directory).isDirectory()) {
    throw new Error(`Missing documentation source directory: ${directory}`);
  }

  const documents: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((left, right) =>
    sortStrings(left.name, right.name),
  )) {
    const absolutePath = resolve(directory, entry.name);
    if (entry.isDirectory()) documents.push(...collectSourceDocuments(absolutePath));
    if (entry.isFile() && entry.name === 'index.md') documents.push(absolutePath);
  }

  return documents;
};

const parseScalar = (value: string): string => {
  const trimmed = value.trim();
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) {
    return trimmed.slice(1, -1).replaceAll("''", "'");
  }
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed) as string;
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
};

const parseFrontmatter = (value: string): FrontmatterRecord => {
  const frontmatter: FrontmatterRecord = {};
  let nestedKey: string | undefined;

  for (const line of value.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue;

    const match = line.match(/^(\s*)([\w-]+):(?:\s*(.*))?$/);
    if (!match) continue;

    const [, indentation, key, rawValue = ''] = match;
    if (!indentation) {
      if (rawValue) {
        frontmatter[key] = parseScalar(rawValue);
        nestedKey = undefined;
      } else {
        frontmatter[key] = {};
        nestedKey = key;
      }
      continue;
    }

    const nestedRecord = nestedKey ? frontmatter[nestedKey] : undefined;
    if (nestedRecord && typeof nestedRecord === 'object') {
      nestedRecord[key] = parseScalar(rawValue);
    }
  }

  return frontmatter;
};

const getString = (frontmatter: FrontmatterRecord, key: string): string | undefined => {
  const value = frontmatter[key];
  return typeof value === 'string' && value ? value : undefined;
};

const getNestedString = (
  frontmatter: FrontmatterRecord,
  key: string,
  nestedKey: string,
): string | undefined => {
  const value = frontmatter[key];
  if (!value || typeof value === 'string') return undefined;
  const nestedValue = value[nestedKey];
  return typeof nestedValue === 'string' && nestedValue ? nestedValue : undefined;
};

const findNodes = (node: Node, type: string, matches: Node[] = []): Node[] => {
  if (node.type === type) matches.push(node);
  if ('children' in node) {
    for (const child of (node as Parent).children) findNodes(child, type, matches);
  }
  return matches;
};

const parseCodeTag = (value: string, document: string): ParsedCodeTag | undefined => {
  const tagMatch = value.match(/^<code\b([^>]*)>$/);
  if (!tagMatch) return undefined;

  let attributeSource = tagMatch[1].trim();
  if (attributeSource.endsWith('/')) attributeSource = attributeSource.slice(0, -1).trimEnd();

  const attributes = new Map<string, string | true>();
  const attributePattern = /^([A-Za-z][\w-]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/;

  while (attributeSource) {
    const match = attributeSource.match(attributePattern);
    if (!match) throw new Error(`Invalid demo attributes in ${document}: ${attributeSource}`);

    const [, name, doubleQuoted, singleQuoted, unquoted] = match;
    if (!supportedDemoAttributes.has(name)) {
      throw new Error(`Unknown demo attribute "${name}" in ${document}`);
    }

    const value = doubleQuoted ?? singleQuoted ?? unquoted ?? true;
    attributes.set(name, value);
    attributeSource = attributeSource.slice(match[0].length).trimStart();
  }

  return { attributes };
};

const kebabRouteSegment = (value: string): string =>
  value
    .replaceAll(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/[’']/g, '')
    .replaceAll(/[^A-Za-z\d]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();

const deriveDocumentLocation = (
  source: string,
): Pick<DocumentRecord, 'legacyRouteId' | 'pathname'> => {
  if (source === 'docs/index.md') return { legacyRouteId: 'docs/index', pathname: '/' };
  if (source === 'docs/changelog.md') {
    return { legacyRouteId: 'docs/changelog', pathname: '/changelog' };
  }

  const componentPath = source.slice('src/'.length, -'/index.md'.length);
  const pathname = `/components/${componentPath.split('/').map(kebabRouteSegment).join('/')}`;
  return {
    legacyRouteId: `components/${componentPath}/index`,
    pathname,
  };
};

const deriveDocumentSection = (source: string): string => {
  if (source === 'docs/index.md') return 'Home';
  if (source === 'docs/changelog.md') return 'Changelog';
  if (source === 'src/i18n/index.md') return 'Hooks & Providers';

  const namespace = source.split('/')[1] as (typeof packageNamespaces)[number];
  return packageSectionLabels[namespace] ?? 'Components';
};

export const deriveAtomIdFromPaths = (
  atomDirectories: readonly string[],
  atomFile: string,
): string | undefined => {
  const normalizedAtomFile = normalizePath(atomFile);
  const atomDirectory = atomDirectories
    .map((directory) => normalizePath(directory).replace(/\/+$/, ''))
    .sort((left, right) => right.split('/').length - left.split('/').length)
    .find(
      (directory) =>
        normalizedAtomFile === directory || normalizedAtomFile.startsWith(`${directory}/`),
    );
  if (!atomDirectory) return undefined;

  return normalizedAtomFile
    .slice(atomDirectory.length)
    .replace(/^\/+/, '')
    .replace(/((^|\/)index)?\.\w+$/, '');
};

const inferAtomId = (root: string, document: string): string | undefined => {
  const documentDirectory = dirname(resolve(root, document));
  const atomFile = ['index.tsx', 'index.jsx']
    .map((filename) => resolve(documentDirectory, filename))
    .find(isFile);
  if (!atomFile) return undefined;

  const atomDirectories = [
    resolve(root, 'src'),
    ...packageNamespaces.map((namespace) => resolve(root, 'src', namespace)),
  ];

  return deriveAtomIdFromPaths(atomDirectories, atomFile);
};

const createDemoOptions = (attributes: Map<string, string | true>): DemoOptions => ({
  inline: attributes.has('inline'),
  isolated: attributes.has('iframe'),
  layout:
    attributes.has('nopadding') || attributes.has('noPadding')
      ? 'bare'
      : attributes.has('center')
        ? 'center'
        : 'default',
});

const createDocumentRecord = (source: string, frontmatter: FrontmatterRecord): DocumentRecord => {
  const location = deriveDocumentLocation(source);
  const category =
    getString(frontmatter, 'group') ?? getNestedString(frontmatter, 'group', 'title');
  const description =
    getString(frontmatter, 'description') ?? getNestedString(frontmatter, 'hero', 'description');
  const section = deriveDocumentSection(source);
  const title = getString(frontmatter, 'title');

  return {
    ...(category ? { category } : {}),
    ...(description ? { description } : {}),
    ...location,
    section,
    source,
    ...(title ? { title } : {}),
  };
};

const createDemoReferences = (
  root: string,
  document: DocumentRecord,
  frontmatter: FrontmatterRecord,
  tree: Node,
): DemoReference[] => {
  const references: DemoReference[] = [];
  const atomId = getString(frontmatter, 'atomId') ?? inferAtomId(root, document.source);

  for (const node of findNodes(tree, 'html')) {
    const value = 'value' in node && typeof node.value === 'string' ? node.value : '';
    const parsed = parseCodeTag(value, document.source);
    if (!parsed) continue;

    const sourceAttribute = parsed.attributes.get('src');
    if (typeof sourceAttribute !== 'string' || !sourceAttribute) {
      throw new Error(`Missing demo source attribute in ${document.source}`);
    }

    const absoluteSource = resolve(root, dirname(document.source), sourceAttribute);
    if (!isFile(absoluteSource)) {
      throw new Error(`Missing demo source "${sourceAttribute}" referenced by ${document.source}`);
    }

    const source = normalizePath(relative(root, absoluteSource));
    const explicitId = parsed.attributes.get('id');
    if (explicitId === true) throw new Error(`Demo id must have a value in ${document.source}`);

    const legacyId = createLegacyDemoId({
      atomId,
      document: document.source,
      explicitId,
      source: sourceAttribute,
    });

    references.push({
      document: document.source,
      legacyId,
      legacyRouteId: document.legacyRouteId,
      options: createDemoOptions(parsed.attributes),
      pathname: document.pathname,
      source,
    });
  }

  return references;
};

export function buildDocumentationInventory(root: string): DocumentationInventory {
  const absoluteRoot = resolve(root);
  const sources = [
    ...collectSourceDocuments(resolve(absoluteRoot, 'src')).map((path) =>
      normalizePath(relative(absoluteRoot, path)),
    ),
    ...publicDocumentationFiles,
  ].sort(sortStrings);

  const documents: DocumentRecord[] = [];
  const demoReferences: DemoReference[] = [];
  const pathnames = new Map<string, string>();
  const legacyIds = new Map<string, string>();

  for (const source of sources) {
    const absolutePath = resolve(absoluteRoot, source);
    if (!isFile(absolutePath)) throw new Error(`Missing public documentation file: ${source}`);

    const tree = unified()
      .use(remarkParse)
      .use(remarkFrontmatter, ['yaml'])
      .parse(readFileSync(absolutePath, 'utf8'));
    const yamlNode = findNodes(tree, 'yaml')[0];
    const frontmatter =
      yamlNode && 'value' in yamlNode && typeof yamlNode.value === 'string'
        ? parseFrontmatter(yamlNode.value)
        : {};
    const document = createDocumentRecord(source, frontmatter);

    const previousDocument = pathnames.get(document.pathname);
    if (previousDocument) {
      throw new Error(
        `Duplicate documentation pathname "${document.pathname}" for ${previousDocument} and ${source}`,
      );
    }
    pathnames.set(document.pathname, source);
    documents.push(document);

    for (const reference of createDemoReferences(absoluteRoot, document, frontmatter, tree)) {
      const previousReference = legacyIds.get(reference.legacyId);
      if (previousReference) {
        throw new Error(
          `Duplicate legacy demo ID "${reference.legacyId}" for ${previousReference} and ${source}`,
        );
      }
      legacyIds.set(reference.legacyId, `${source}:${reference.source}`);
      demoReferences.push(reference);
    }
  }

  return { demoReferences, documents };
}

export function writeCompatibilityManifest(root: string, inventory: DocumentationInventory): void {
  const outputPath = resolve(root, 'site/content/compatibility.json');
  const output = `${JSON.stringify(inventory, null, 2)}\n`;
  if (existsSync(outputPath) && readFileSync(outputPath, 'utf8') === output) return;

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, output);
}
