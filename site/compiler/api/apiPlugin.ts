import { basename, relative, resolve } from 'node:path';

import type { Plugin } from 'vite';

import type { ApiRequest } from '../../types/api';
import { validateApiRequest } from './diagnostics';
import { ApiExtractor } from './extractComponent';
import {
  apiVirtualModulePrefix as publicPrefix,
  createApiVirtualModuleId as createRemarkApiVirtualModuleId,
  decodeApiVirtualRequest,
  encodeApiVirtualRequest,
} from './remarkApi';

const internalPrefix = '\0lobe-docs:api:';

export interface ApiPluginOptions {
  root?: string;
  tsconfigPath?: string;
}

const normalizePath = (path: string): string => resolve(path).replaceAll('\\', '/');

const stableRequest = (request: ApiRequest): ApiRequest => ({
  documentPath: normalizePath(request.documentPath),
  ...(request.from === undefined ? {} : { from: request.from }),
  name: request.name,
  ...(request.tsconfigPath === undefined
    ? {}
    : { tsconfigPath: normalizePath(request.tsconfigPath) }),
});

export const createApiVirtualModuleId = (request: ApiRequest): string =>
  createRemarkApiVirtualModuleId(request);

const isRelevantSource = (root: string, path: string, dependencies: Set<string>): boolean => {
  const normalized = normalizePath(path);
  if (dependencies.has(normalized)) return true;
  const relativePath = relative(root, normalized).replaceAll('\\', '/');
  if (/^tsconfig(?:\.[^/]+)?\.json$/.test(basename(normalized))) return true;
  return relativePath.startsWith('src/') && /\.[cm]?tsx?$/.test(relativePath);
};

export function apiPlugin(options: ApiPluginOptions = {}): Plugin {
  let root = normalizePath(options.root ?? process.cwd());
  let tsconfigPath = normalizePath(options.tsconfigPath ?? resolve(root, 'tsconfig.json'));
  let extractor: ApiExtractor | undefined;
  const dependencies = new Set<string>();
  const virtualModuleIds = new Set<string>();

  const releaseCompiler = (): void => {
    extractor?.invalidate();
    extractor = undefined;
    dependencies.clear();
  };

  const requestFor = (encoded: string): ApiRequest => {
    const request = decodeApiVirtualRequest(encoded);
    return stableRequest({
      ...request,
      documentPath: resolve(root, request.documentPath),
      tsconfigPath,
    });
  };

  const internalIdFor = (source: string): string => {
    const request = decodeApiVirtualRequest(source.slice(publicPrefix.length));
    const documentPath = normalizePath(request.documentPath);
    const relativeDocumentPath = relative(root, documentPath).replaceAll('\\', '/');
    if (relativeDocumentPath === '..' || relativeDocumentPath.startsWith('../')) {
      throw new Error(
        `API document ${documentPath} is outside the documentation root ${root}; move it inside the repository.`,
      );
    }
    return `${internalPrefix}${encodeApiVirtualRequest({
      documentPath: relativeDocumentPath,
      ...(request.from === undefined ? {} : { from: request.from }),
      name: request.name,
    })}`;
  };

  return {
    buildEnd() {
      releaseCompiler();
      virtualModuleIds.clear();
    },
    configResolved(config) {
      if (options.root) return;
      root = normalizePath(config.root);
      tsconfigPath = normalizePath(options.tsconfigPath ?? resolve(root, 'tsconfig.json'));
      releaseCompiler();
    },
    enforce: 'pre',
    hotUpdate(update) {
      if (!isRelevantSource(root, update.file, dependencies)) return;
      extractor?.invalidate();
      dependencies.clear();
      const modules = new Set(update.modules);
      for (const id of virtualModuleIds) {
        const module = this.environment.moduleGraph.getModuleById(id);
        if (!module) continue;
        this.environment.moduleGraph.invalidateModule(module);
        modules.add(module);
      }
      return [...modules];
    },
    load(id) {
      if (!id.startsWith(internalPrefix)) return;
      const request = requestFor(id.slice(internalPrefix.length));
      validateApiRequest(request);
      extractor ??= new ApiExtractor(request);
      const result = extractor.extract(request);
      this.addWatchFile(request.documentPath);
      for (const dependency of result.dependencies) {
        const path = normalizePath(dependency);
        dependencies.add(path);
        this.addWatchFile(path);
      }
      return `export default ${JSON.stringify(result.component)};`;
    },
    name: 'lobe-docs-api',
    resolveId(source) {
      if (!source.startsWith(publicPrefix)) return;
      const id = internalIdFor(source);
      virtualModuleIds.add(id);
      return id;
    },
  };
}
