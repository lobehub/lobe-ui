import { existsSync, readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

import type { Plugin } from 'vite';

import type { DocumentationInventory } from '../types';
import { analyzeDemo, type DemoAnalysis, type DemoScopeImport } from './demoAnalysis';

const descriptorPrefix = '\0lobe-docs:demo-descriptor:';
const scopePrefix = '\0lobe-docs:demo-scope:';
const publicScopePrefix = 'virtual:lobe-docs/demo-scope:';

export interface DemoPluginOptions {
  compatibilityPath?: string;
  root?: string;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const parseDemoRequest = (source: string): string | undefined => {
  const queryIndex = source.indexOf('?');
  if (queryIndex < 0) return;
  const query = new URLSearchParams(source.slice(queryIndex + 1));
  return query.has('demo') ? source.slice(0, queryIndex) : undefined;
};

const withoutQuery = (id: string): string => id.split('?')[0];

const encodeVirtualPath = (path: string): string => encodeURIComponent(path);
const decodeVirtualPath = (path: string): string => decodeURIComponent(path);

const sourcePathFromRoot = (root: string, absolutePath: string): string => {
  const path = normalizePath(relative(root, absolutePath));
  return path.startsWith('../') ? normalizePath(absolutePath) : path;
};

const createCanonicalId = (sourcePath: string): string =>
  sourcePath
    .replace(/\.[^.]+$/, '')
    .replaceAll(/([a-z\d])([A-Z])/g, '$1-$2')
    .replaceAll(/[^A-Za-z\d]+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase();

const readCompatibility = (path: string): DocumentationInventory => {
  if (!existsSync(path)) return { demoReferences: [], documents: [] };
  const value = JSON.parse(readFileSync(path, 'utf8')) as DocumentationInventory;
  if (!Array.isArray(value.demoReferences) || !Array.isArray(value.documents)) {
    throw new Error(`Invalid compatibility manifest: ${path}`);
  }
  return value;
};

const createScopeModule = (imports: DemoScopeImport[]): string => {
  const statements: string[] = [];
  const entries: string[] = [];

  for (const [index, scopeImport] of imports.entries()) {
    const moduleName = `__demo_scope_${index}`;
    if (scopeImport.sideEffect) {
      statements.push(`import ${JSON.stringify(scopeImport.resolvedSource)};`);
      continue;
    }

    statements.push(
      `import * as ${moduleName} from ${JSON.stringify(scopeImport.resolvedSource)};`,
    );
    for (const binding of scopeImport.bindings) {
      const value =
        binding.imported === '*'
          ? moduleName
          : `${moduleName}[${JSON.stringify(binding.imported)}]`;
      entries.push(`${JSON.stringify(binding.local)}: ${value}`);
    }
  }

  statements.push(`export default {${entries.join(',')}};`);
  return statements.join('\n');
};

const createDescriptorModule = (
  root: string,
  sourcePath: string,
  compatibility: DocumentationInventory,
): string => {
  const relativeSourcePath = sourcePathFromRoot(root, sourcePath);
  const references = compatibility.demoReferences.filter(
    (reference) => normalizePath(reference.source) === relativeSourcePath,
  );
  const scopeId = `${publicScopePrefix}${encodeVirtualPath(sourcePath)}`;
  const source = readFileSync(sourcePath, 'utf8');
  const id = createCanonicalId(relativeSourcePath);

  return `const descriptor = {
  editable: true,
  id: ${JSON.stringify(id)},
  legacyIds: ${JSON.stringify(references.map(({ legacyId }) => legacyId))},
  load: () => import(${JSON.stringify(sourcePath)}).then((module) => module.default),
  loadScope: () => import(${JSON.stringify(scopeId)}).then((module) => module.default),
  routeId: ${JSON.stringify(references[0]?.legacyRouteId ?? '')},
  source: ${JSON.stringify(source)},
  sourcePath: ${JSON.stringify(relativeSourcePath)},
};
export default descriptor;`;
};

const formatDiagnostic = (analysis: DemoAnalysis): string[] =>
  analysis.diagnostics.map(
    ({ column, line, message, sourcePath }) => `${sourcePath}:${line}:${column} ${message}`,
  );

export function demoPlugin(options: DemoPluginOptions = {}): Plugin {
  let root = resolve(options.root ?? process.cwd());
  let compatibilityPath = resolve(
    options.compatibilityPath ?? root,
    options.compatibilityPath ? '' : 'site/content/compatibility.json',
  );
  let compatibility: DocumentationInventory | undefined;
  const analysisCache = new Map<string, DemoAnalysis>();
  const reportedDiagnostics = new Set<string>();

  const getCompatibility = () => (compatibility ??= readCompatibility(compatibilityPath));
  const getAnalysis = (sourcePath: string) => {
    const absolutePath = resolve(sourcePath);
    let analysis = analysisCache.get(absolutePath);
    if (!analysis) {
      analysis = analyzeDemo(absolutePath);
      analysisCache.set(absolutePath, analysis);
    }
    return analysis;
  };

  return {
    configResolved(config) {
      if (options.root) return;
      root = resolve(config.root);
      compatibilityPath = resolve(
        options.compatibilityPath ?? root,
        options.compatibilityPath ? '' : 'site/content/compatibility.json',
      );
      compatibility = undefined;
    },
    enforce: 'pre',
    load(id) {
      if (id.startsWith(descriptorPrefix)) {
        const sourcePath = decodeVirtualPath(id.slice(descriptorPrefix.length));
        const analysis = getAnalysis(sourcePath);
        for (const diagnostic of formatDiagnostic(analysis)) {
          if (reportedDiagnostics.has(diagnostic)) continue;
          reportedDiagnostics.add(diagnostic);
          this.warn(diagnostic);
        }
        return createDescriptorModule(root, sourcePath, getCompatibility());
      }
      if (id.startsWith(scopePrefix)) {
        const sourcePath = decodeVirtualPath(id.slice(scopePrefix.length));
        return createScopeModule(getAnalysis(sourcePath).imports);
      }
    },
    name: 'lobe-docs-demo',
    async resolveId(source, importer) {
      if (source.startsWith(publicScopePrefix)) {
        return `${scopePrefix}${source.slice(publicScopePrefix.length)}`;
      }

      const request = parseDemoRequest(source);
      if (!request) return;
      const resolvedRequest = await this.resolve(request, importer, { skipSelf: true });
      if (!resolvedRequest) {
        throw new Error(`Unable to resolve demo source "${request}" from ${importer ?? root}`);
      }
      return `${descriptorPrefix}${encodeVirtualPath(withoutQuery(resolvedRequest.id))}`;
    },
  };
}
