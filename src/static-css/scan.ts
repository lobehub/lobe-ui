import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

export interface ScanAntdUsageOptions {
  cwd?: string;
  exclude?: RegExp[];
  extensions?: string[];
  roots?: string[];
}

export interface AntdUsageScanResult {
  /** PascalCase antd export names found in value imports */
  components: string[];
  importsLobeUi: boolean;
  scannedFiles: number;
  /** a namespace/default antd import was found — usage is not statically enumerable */
  wildcard: boolean;
}

const DEFAULT_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx', 'mjs', 'mts', 'cjs', 'cts'];
const DEFAULT_EXCLUDE = [/node_modules/, /\.test\./, /\.spec\./, /\.d\.[cm]?ts$/, /__tests__/];

// clause alternatives ({named} / Default / Default, {named} / * as ns) deliberately
// exclude statement-crossing text so one match never spans two imports
const NAMED_IMPORT_RE =
  /import\s+(type\s+)?((?:[\w$]+\s*,\s*)?\{[^}]*\}|[\w$]+|\*\s+as\s+[\w$]+)\s+from\s+['"]antd['"]/g;
// type-only deep imports are included too — over-approximation is harmless here
const DEEP_IMPORT_RE = /from\s+['"]antd\/(?:es|lib)\/([\w-]+)/g;
const LOBE_UI_RE = /from\s+['"]@lobehub\/ui(?:['"]|\/)/;

const kebabToPascal = (name: string) =>
  name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const parseImportClause = (clause: string, components: Set<string>): boolean => {
  const braceStart = clause.indexOf('{');

  const bare = (braceStart === -1 ? clause : clause.slice(0, braceStart)).trim();
  const wildcard = bare.length > 0;

  if (braceStart === -1) return wildcard;

  const inner = clause.slice(braceStart + 1, clause.lastIndexOf('}'));
  for (const rawSpecifier of inner.split(',')) {
    const specifier = rawSpecifier.trim();
    if (!specifier || specifier.startsWith('type ')) continue;
    const name = specifier.split(/\s+as\s+/)[0]!.trim();
    if (/^[A-Za-z_$][\w$]*$/.test(name)) components.add(name);
  }

  return wildcard;
};

const listFiles = (root: string, extensions: Set<string>, exclude: RegExp[]): string[] => {
  let entries: string[];
  try {
    entries = readdirSync(root, { recursive: true }) as string[];
  } catch {
    return [];
  }

  return entries
    .map((entry) => path.join(root, entry))
    .filter((path) => {
      if (exclude.some((pattern) => pattern.test(path))) return false;
      const extension = path.split('.').pop();
      if (!extension || !extensions.has(extension)) return false;
      try {
        return statSync(path).isFile();
      } catch {
        return false;
      }
    });
};

export const scanAntdUsage = (options: ScanAntdUsageOptions = {}): AntdUsageScanResult => {
  const {
    cwd = process.cwd(),
    roots = ['src'],
    extensions = DEFAULT_EXTENSIONS,
    exclude = DEFAULT_EXCLUDE,
  } = options;

  const components = new Set<string>();
  let importsLobeUi = false;
  let wildcard = false;
  let scannedFiles = 0;

  for (const root of roots) {
    for (const file of listFiles(path.resolve(cwd, root), new Set(extensions), exclude)) {
      let source: string;
      try {
        source = readFileSync(file, 'utf8');
      } catch {
        continue;
      }
      scannedFiles += 1;

      if (!importsLobeUi && LOBE_UI_RE.test(source)) importsLobeUi = true;

      for (const match of source.matchAll(NAMED_IMPORT_RE)) {
        if (match[1]) continue;
        if (parseImportClause(match[2]!, components)) wildcard = true;
      }

      for (const match of source.matchAll(DEEP_IMPORT_RE)) {
        components.add(kebabToPascal(match[1]!));
      }
    }
  }

  return { components: [...components].sort(), importsLobeUi, scannedFiles, wildcard };
};
