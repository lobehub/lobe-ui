import { existsSync, readFileSync, realpathSync } from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';

import type { Plugin } from 'vite';

import type { DocumentationInventory } from '../types';
import { analyzeDemo, type DemoAnalysis, type DemoScopeImport } from './demoAnalysis';
import { createCanonicalDemoId } from './readLegacyMap';

const descriptorPrefix = '\0lobe-docs:demo-descriptor:';
const scopePrefix = '\0lobe-docs:demo-scope:';
const publicScopePrefix = 'virtual:lobe-docs/demo-scope:';

export interface DemoPluginOptions {
  compatibilityPath?: string;
  root?: string;
}

interface DemoDescriptorRequest {
  documentPath?: string;
  sourcePath: string;
}

interface CompilerInvalidation {
  compatibility: boolean;
  sources: Set<string>;
}

const normalizePath = (path: string): string => path.replaceAll('\\', '/');

const canonicalPath = (path: string): string => {
  const absolutePath = resolve(path);
  try {
    return normalizePath(realpathSync.native(absolutePath));
  } catch {
    try {
      return normalizePath(
        resolve(realpathSync.native(dirname(absolutePath)), basename(absolutePath)),
      );
    } catch {
      return normalizePath(absolutePath);
    }
  }
};

const parseDemoRequest = (source: string): string | undefined => {
  const queryIndex = source.indexOf('?');
  if (queryIndex < 0) return;
  const query = new URLSearchParams(source.slice(queryIndex + 1));
  return query.has('demo') ? source.slice(0, queryIndex) : undefined;
};

const withoutQuery = (id: string): string => id.split('?')[0];

const encodeVirtualPath = (path: string): string => encodeURIComponent(path);
const decodeVirtualPath = (path: string): string => decodeURIComponent(path);
const scopeModuleId = (sourcePath: string): string =>
  `${scopePrefix}${encodeVirtualPath(sourcePath)}`;

const readRepositoryPackageName = (root: string): string | undefined => {
  const packagePath = resolve(root, 'package.json');
  if (!existsSync(packagePath)) return;

  try {
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8')) as { name?: unknown };
    return typeof packageJson.name === 'string' ? packageJson.name : undefined;
  } catch {
    return;
  }
};

const resolveRepositoryAlias = (
  root: string,
  packageName: string | undefined,
  source: string,
): string | undefined => {
  if (source.startsWith('@/')) return resolve(root, 'src', source.slice(2));
  if (!packageName) return;
  if (source === packageName) return resolve(root, 'src');
  if (source.startsWith(`${packageName}/`)) {
    return resolve(root, 'src', source.slice(packageName.length + 1));
  }
};

const encodeDescriptorRequest = (request: DemoDescriptorRequest): string =>
  encodeURIComponent(JSON.stringify(request));

const decodeDescriptorRequest = (request: string): DemoDescriptorRequest =>
  JSON.parse(decodeURIComponent(request)) as DemoDescriptorRequest;

const sourcePathFromRoot = (root: string, absolutePath: string): string => {
  const path = normalizePath(relative(root, absolutePath));
  return path.startsWith('../') ? normalizePath(absolutePath) : path;
};

const documentStem = (path: string): string => normalizePath(path).replace(/\.mdx?$/, '');

const documentPathFromImporter = (root: string, importer?: string): string | undefined => {
  if (!importer) return;
  const importerPath = withoutQuery(importer);
  if (!/\.mdx?$/.test(importerPath)) return;
  return sourcePathFromRoot(root, importerPath);
};

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
  request: DemoDescriptorRequest,
  compatibility: DocumentationInventory,
): string => {
  const { documentPath, sourcePath } = request;
  const relativeSourcePath = sourcePathFromRoot(root, sourcePath);
  const references = compatibility.demoReferences.filter(
    (reference) => normalizePath(reference.source) === relativeSourcePath,
  );
  const contextualReference = documentPath
    ? references.find(
        (reference) => documentStem(reference.document) === documentStem(documentPath),
      )
    : undefined;
  const routeIds = new Set(references.map(({ legacyRouteId }) => legacyRouteId));
  const routeId =
    contextualReference?.legacyRouteId ?? (routeIds.size === 1 ? [...routeIds][0] : '');
  const scopeId = `${publicScopePrefix}${encodeVirtualPath(sourcePath)}`;
  const source = readFileSync(sourcePath, 'utf8');
  const id = createCanonicalDemoId(relativeSourcePath);

  return `const descriptor = {
  editable: true,
  id: ${JSON.stringify(id)},
  legacyIds: ${JSON.stringify(references.map(({ legacyId }) => legacyId))},
  load: () => import(${JSON.stringify(sourcePath)}).then((module) => module.default),
  loadScope: () => import(${JSON.stringify(scopeId)}).then((module) => module.default),
  routeId: ${JSON.stringify(routeId)},
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
  let root = canonicalPath(options.root ?? process.cwd());
  let packageName = readRepositoryPackageName(root);
  const resolveCompatibilityPath = () =>
    options.compatibilityPath
      ? canonicalPath(resolve(root, options.compatibilityPath))
      : canonicalPath(resolve(root, 'compatibility.json'));
  let compatibilityPath = resolveCompatibilityPath();
  let compatibility: DocumentationInventory | undefined;
  const analysisCache = new Map<string, DemoAnalysis>();
  const dependenciesBySource = new Map<string, Set<string>>();
  const descriptorIdsBySource = new Map<string, Set<string>>();
  const knownSources = new Set<string>();
  const reportedDiagnostics = new Map<string, Set<string>>();
  const sourcesByDependency = new Map<string, Set<string>>();

  const normalizeFilePath = canonicalPath;

  const updateDependencyOwnership = (sourcePath: string, dependencyPaths: string[]) => {
    const previousDependencies = dependenciesBySource.get(sourcePath);
    for (const dependencyPath of previousDependencies ?? []) {
      const owners = sourcesByDependency.get(dependencyPath);
      owners?.delete(sourcePath);
      if (owners?.size === 0) sourcesByDependency.delete(dependencyPath);
    }

    const nextDependencies = new Set(dependencyPaths.map(normalizeFilePath));
    dependenciesBySource.set(sourcePath, nextDependencies);
    for (const dependencyPath of nextDependencies) {
      const owners = sourcesByDependency.get(dependencyPath) ?? new Set<string>();
      owners.add(sourcePath);
      sourcesByDependency.set(dependencyPath, owners);
    }
  };

  const invalidateCompilerState = (changedPath: string): CompilerInvalidation => {
    const filePath = normalizeFilePath(changedPath);
    const compatibilityChanged = filePath === normalizeFilePath(compatibilityPath);
    const sources = compatibilityChanged
      ? new Set(knownSources)
      : new Set([
          ...(knownSources.has(filePath) ? [filePath] : []),
          ...(sourcesByDependency.get(filePath) ?? []),
        ]);

    if (compatibilityChanged) {
      compatibility = undefined;
    } else {
      for (const sourcePath of sources) {
        analysisCache.delete(sourcePath);
        reportedDiagnostics.delete(sourcePath);
      }
    }
    return { compatibility: compatibilityChanged, sources };
  };

  const getCompatibility = () => (compatibility ??= readCompatibility(compatibilityPath));
  const getAnalysis = (sourcePath: string) => {
    const absolutePath = normalizeFilePath(sourcePath);
    knownSources.add(absolutePath);
    let analysis = analysisCache.get(absolutePath);
    if (!analysis) {
      analysis = analyzeDemo(absolutePath);
      analysisCache.set(absolutePath, analysis);
      updateDependencyOwnership(absolutePath, analysis.dependencyPaths);
    }
    return analysis;
  };

  return {
    configResolved(config) {
      if (options.root) return;
      root = canonicalPath(config.root);
      packageName = readRepositoryPackageName(root);
      compatibilityPath = resolveCompatibilityPath();
      compatibility = undefined;
    },
    enforce: 'pre',
    hotUpdate(options) {
      const invalidation = invalidateCompilerState(options.file);
      const modules = new Set(options.modules);

      for (const sourcePath of invalidation.sources) {
        const virtualIds = new Set(descriptorIdsBySource.get(sourcePath) ?? []);
        if (!invalidation.compatibility) virtualIds.add(scopeModuleId(sourcePath));

        for (const id of virtualIds) {
          const module = this.environment.moduleGraph.getModuleById(id);
          if (!module) continue;
          this.environment.moduleGraph.invalidateModule(module);
          modules.add(module);
        }
      }

      return [...modules];
    },
    load(id) {
      if (id.startsWith(descriptorPrefix)) {
        const request = decodeDescriptorRequest(id.slice(descriptorPrefix.length));
        const sourcePath = normalizeFilePath(request.sourcePath);
        request.sourcePath = sourcePath;
        const analysis = getAnalysis(sourcePath);
        this.addWatchFile(compatibilityPath);
        this.addWatchFile(sourcePath);
        for (const dependencyPath of analysis.dependencyPaths) this.addWatchFile(dependencyPath);

        const reported = reportedDiagnostics.get(sourcePath) ?? new Set<string>();
        for (const diagnostic of formatDiagnostic(analysis)) {
          if (reported.has(diagnostic)) continue;
          reported.add(diagnostic);
          this.warn(diagnostic);
        }
        reportedDiagnostics.set(sourcePath, reported);
        return createDescriptorModule(root, request, getCompatibility());
      }
      if (id.startsWith(scopePrefix)) {
        const sourcePath = normalizeFilePath(decodeVirtualPath(id.slice(scopePrefix.length)));
        const analysis = getAnalysis(sourcePath);
        this.addWatchFile(sourcePath);
        for (const dependencyPath of analysis.dependencyPaths) this.addWatchFile(dependencyPath);
        return createScopeModule(analysis.imports);
      }
    },
    name: 'lobe-docs-demo',
    async resolveId(source, importer) {
      if (importer?.startsWith(scopePrefix)) {
        const aliasPath = resolveRepositoryAlias(root, packageName, source);
        if (aliasPath) {
          return (await this.resolve(aliasPath, undefined, { skipSelf: true }))?.id ?? aliasPath;
        }
      }

      if (source.startsWith(publicScopePrefix)) {
        const sourcePath = normalizeFilePath(
          decodeVirtualPath(source.slice(publicScopePrefix.length)),
        );
        knownSources.add(sourcePath);
        return scopeModuleId(sourcePath);
      }

      const request = parseDemoRequest(source);
      if (!request) return;
      const resolvedRequest = await this.resolve(request, importer, { skipSelf: true });
      if (!resolvedRequest) {
        throw new Error(`Unable to resolve demo source "${request}" from ${importer ?? root}`);
      }
      const sourcePath = normalizeFilePath(withoutQuery(resolvedRequest.id));
      knownSources.add(sourcePath);
      const descriptorId = `${descriptorPrefix}${encodeDescriptorRequest({
        documentPath: documentPathFromImporter(root, importer),
        sourcePath,
      })}`;
      const descriptorIds = descriptorIdsBySource.get(sourcePath) ?? new Set<string>();
      descriptorIds.add(descriptorId);
      descriptorIdsBySource.set(sourcePath, descriptorIds);
      return descriptorId;
    },
    watchChange(id) {
      invalidateCompilerState(id);
    },
  };
}
