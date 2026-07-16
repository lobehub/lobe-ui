import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { packageNamespaces } from '../config/packageNamespaces';
import { createLegacyDemoId } from '../packages/docs-kit/site/compiler/legacyDumiIds';
import type {
  DemoReference,
  DocumentationInventory,
} from '../packages/docs-kit/site/compiler/types';

const { basename, dirname, extname, relative, resolve } = path;

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const compatibilityPath = resolve(root, 'packages/docs-kit/site/content/compatibility.json');

const DEMO_LANGS = new Set(['tsx', 'jsx', 'ts', 'js', 'typescript', 'javascript']);
const FENCE_RE = /^```([^\n]*)\n([\s\S]*?)```/gm;

const SKIP_DOCUMENTS = new Set(['docs/index.mdx', 'src/mdx/mdxComponents/index.mdx']);

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const isFile = (path: string): boolean => existsSync(path) && statSync(path).isFile();

const pascalCase = (value: string): string =>
  value
    .split(/[^A-Za-z\d]+/)
    .filter(Boolean)
    .map((part) => `${part[0]?.toUpperCase() ?? ''}${part.slice(1)}`)
    .join('');

const camelToKebabFile = (value: string): string =>
  value
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/[^A-Za-z\d]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();

const parseFenceInfo = (info: string): { lang: string; pure: boolean } => {
  const parts = info
    .trim()
    .split('|')
    .map((part) => part.trim());
  const lang = (parts[0]?.split(/\s+/)[0] ?? '').toLowerCase();
  const pure = parts.some((part) => part.split(/\s+/).includes('pure'));
  return { lang, pure };
};

const isDemoFence = (info: string, body: string): boolean => {
  const { lang, pure } = parseFenceInfo(info);
  if (pure || !DEMO_LANGS.has(lang)) return false;
  return /\bexport\s+default\b/.test(body);
};

const deriveAtomId = (document: string): string | undefined => {
  const documentDirectory = dirname(resolve(root, document));
  const atomFile = ['index.tsx', 'index.jsx']
    .map((filename) => resolve(documentDirectory, filename))
    .find(isFile);
  if (!atomFile) return undefined;

  const atomDirectories = [
    resolve(root, 'src'),
    ...packageNamespaces.map((namespace) => resolve(root, 'src', namespace)),
  ];

  for (const directory of atomDirectories) {
    const relativePath = normalizePath(relative(directory, atomFile));
    if (relativePath.startsWith('..') || relativePath.includes('/')) continue;
    return basename(relativePath, extname(relativePath));
  }

  for (const directory of atomDirectories) {
    const relativePath = normalizePath(relative(directory, atomFile));
    if (relativePath.startsWith('..')) continue;
    const segments = relativePath.split('/');
    if (segments.length === 2 && segments[1].startsWith('index.')) return segments[0];
  }

  return undefined;
};

const existingDemoBasenames = (document: string): Set<string> => {
  const demosDir = resolve(root, dirname(document), 'demos');
  if (!existsSync(demosDir) || !statSync(demosDir).isDirectory()) return new Set();
  return new Set(
    readdirSync(demosDir)
      .filter((name) => /\.(t|j)sx?$/.test(name))
      .map((name) => basename(name, extname(name)).toLowerCase()),
  );
};

const suggestBaseName = (body: string, used: Set<string>): string => {
  const colorMatch = body.match(/<(?:ColorScales|CssVar)\s+name=["']([A-Za-z][\w]*)["']/);
  if (colorMatch) return allocateName(colorMatch[1], used);

  const componentMatch = body.match(/export\s+default\s*\(\s*\)\s*=>\s*(?:\(|\s)*<([A-Z][\w.]*)/);
  if (componentMatch) {
    const name = componentMatch[1].split('.').at(-1) ?? componentMatch[1];
    return allocateName(name, used);
  }

  const importMatch = body.match(/import\s*\{([^}]+)\}/);
  if (importMatch) {
    const first = importMatch[1]
      .split(',')
      .map((part) =>
        part
          .trim()
          .split(/\s+as\s+/)
          .at(-1)
          ?.trim(),
      )
      .find((part) => part && /^[A-Z]/.test(part));
    if (first) return allocateName(first, used);
  }

  const hash = createHash('sha1').update(body).digest('hex').slice(0, 8);
  return allocateName(`inline-${hash}`, used);
};

const allocateName = (raw: string, used: Set<string>): string => {
  const base = camelToKebabFile(raw) || 'inline';
  let candidate = base;
  let suffix = 2;
  while (used.has(candidate.toLowerCase())) {
    candidate = `${base}-${suffix++}`;
  }
  used.add(candidate.toLowerCase());
  return candidate;
};

const importIdentifier = (fileBase: string, used: Set<string>): string => {
  const initial = `Demo${pascalCase(fileBase) || 'Example'}`;
  let candidate = initial;
  let suffix = 2;
  while (used.has(candidate)) candidate = `${initial}${suffix++}`;
  used.add(candidate);
  return candidate;
};

const existingImportIdentifiers = (source: string): Set<string> => {
  const used = new Set<string>();
  for (const match of source.matchAll(
    /^import\s+([A-Za-z_$][\w$]*)\s+from\s+['"][^'"]+\?demo['"]\s*;?\s*$/gm,
  )) {
    used.add(match[1]);
  }
  return used;
};

const insertImports = (source: string, imports: string[]): string => {
  if (imports.length === 0) return source;
  const block = `${imports.join('\n')}\n`;
  const existingDemoImport = source.match(
    /^import\s+[A-Za-z_$][\w$]*\s+from\s+['"][^'"]+\?demo['"]\s*;?\s*$/m,
  );
  if (existingDemoImport?.index !== undefined) {
    const index = existingDemoImport.index;
    return `${source.slice(0, index)}${block}${source.slice(index)}`;
  }

  const frontmatter = source.match(/^---\n[\s\S]*?\n---\n/);
  if (frontmatter) {
    const end = frontmatter[0].length;
    const rest = source.slice(end);
    const trimmed = rest.replace(/^\n*/, '\n');
    return `${source.slice(0, end)}\n${block}${trimmed.startsWith('\n') ? trimmed.slice(1) : trimmed}`;
  }

  return `${block}\n${source}`;
};

const collectDocuments = (): string[] => {
  const documents: string[] = [];
  const walk = (directory: string) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolute = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'node_modules' || entry.name === 'superpowers') continue;
        walk(absolute);
        continue;
      }
      if (entry.isFile() && entry.name.endsWith('.mdx')) {
        documents.push(normalizePath(relative(root, absolute)));
      }
    }
  };
  walk(resolve(root, 'src'));
  walk(resolve(root, 'docs'));
  return documents.sort();
};

interface ExtractedDemo {
  body: string;
  document: string;
  fileBase: string;
  identifier: string;
  relativeSource: string;
  sourcePath: string;
}

const main = (): void => {
  const inventory = JSON.parse(readFileSync(compatibilityPath, 'utf8')) as DocumentationInventory;
  const documentsBySource = new Map(
    inventory.documents.map((document) => [document.source, document]),
  );
  const existingLegacyIds = new Set(inventory.demoReferences.map(({ legacyId }) => legacyId));
  const newReferences: DemoReference[] = [];
  const extracted: ExtractedDemo[] = [];
  let pureMarked = 0;

  for (const document of collectDocuments()) {
    const absoluteDocument = resolve(root, document);
    let text = readFileSync(absoluteDocument, 'utf8');
    const usedNames = existingDemoBasenames(document);
    const usedIdentifiers = existingImportIdentifiers(text);
    const imports: string[] = [];
    let changed = false;
    let demoIndex = 0;

    const replacements: { end: number; start: number; text: string }[] = [];

    for (const match of text.matchAll(FENCE_RE)) {
      const info = match[1] ?? '';
      const body = match[2] ?? '';
      const full = match[0];
      const start = match.index ?? 0;
      const end = start + full.length;

      if (SKIP_DOCUMENTS.has(document)) {
        if (isDemoFence(info, body) && !parseFenceInfo(info).pure) {
          const lang = parseFenceInfo(info).lang || 'tsx';
          replacements.push({ end, start, text: `\`\`\`${lang} | pure\n${body}\`\`\`` });
          pureMarked += 1;
          changed = true;
        }
        continue;
      }

      if (!isDemoFence(info, body)) continue;

      const fileBase = suggestBaseName(body, usedNames);
      const fileName = `${fileBase}.tsx`;
      const sourcePath = normalizePath(`${dirname(document)}/demos/${fileName}`);
      const relativeSource = `./demos/${fileName}`;
      const identifier = importIdentifier(fileBase, usedIdentifiers);
      const demosDir = resolve(root, dirname(document), 'demos');
      mkdirSync(demosDir, { recursive: true });
      writeFileSync(resolve(root, sourcePath), body.endsWith('\n') ? body : `${body}\n`, 'utf8');

      imports.push(`import ${identifier} from '${relativeSource}?demo';`);
      replacements.push({ end, start, text: `<Demo of={${identifier}} />` });

      const record = documentsBySource.get(document);
      if (!record) {
        throw new Error(`Document missing from compatibility inventory: ${document}`);
      }

      const atomId = deriveAtomId(document);
      let legacyId = createLegacyDemoId({
        atomId,
        document,
        source: relativeSource,
      });
      if (existingLegacyIds.has(legacyId)) {
        legacyId = createLegacyDemoId({
          atomId,
          document,
          explicitId: `${fileBase}-${demoIndex}`,
          source: relativeSource,
        });
      }
      if (existingLegacyIds.has(legacyId)) {
        throw new Error(`Unable to allocate unique legacy demo id for ${sourcePath}`);
      }
      existingLegacyIds.add(legacyId);

      newReferences.push({
        document,
        legacyId,
        legacyRouteId: record.legacyRouteId,
        options: { inline: false, isolated: false, layout: 'default' },
        pathname: record.pathname,
        source: sourcePath,
      });
      extracted.push({
        body,
        document,
        fileBase,
        identifier,
        relativeSource,
        sourcePath,
      });
      demoIndex += 1;
      changed = true;
    }

    if (!changed) continue;

    replacements.sort((left, right) => right.start - left.start);
    for (const replacement of replacements) {
      text = `${text.slice(0, replacement.start)}${replacement.text}${text.slice(replacement.end)}`;
    }
    text = insertImports(text, imports);
    text = text.replaceAll(/(from '(?:\.\/)?demos\/[^']+\?demo';)\n(##|<)/g, '$1\n\n$2');
    writeFileSync(absoluteDocument, text, 'utf8');
  }

  inventory.demoReferences = [...inventory.demoReferences, ...newReferences].sort((left, right) => {
    const byDocument = left.document.localeCompare(right.document, 'en');
    if (byDocument !== 0) return byDocument;
    return left.legacyId.localeCompare(right.legacyId, 'en');
  });

  writeFileSync(compatibilityPath, `${JSON.stringify(inventory, null, 2)}\n`, 'utf8');

  console.log(
    JSON.stringify(
      {
        extracted: extracted.length,
        pureMarked,
        totalDemos: inventory.demoReferences.length,
        byDocument: extracted.reduce<Record<string, number>>((acc, item) => {
          acc[item.document] = (acc[item.document] ?? 0) + 1;
          return acc;
        }, {}),
      },
      null,
      2,
    ),
  );
};

main();
