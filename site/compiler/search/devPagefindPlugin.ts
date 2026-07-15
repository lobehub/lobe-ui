import path from 'node:path';

import { load } from 'cheerio';
import type { PagefindIndex } from 'pagefind';
import type { Plugin, ViteDevServer } from 'vite';

import { PAGEFIND_HMR_EVENT } from '../../search/types';
import { createContentManifest } from '../content/createManifest';
import { PAGEFIND_ROOT_SELECTOR } from './buildPagefind';

export type DevPagefindNodeApi = Pick<typeof import('pagefind'), 'close' | 'createIndex'>;

interface BuildDevPagefindFilesOptions {
  api: DevPagefindNodeApi;
  documents: string[];
  renderHtml: (pathname: string) => Promise<string>;
}

const describeError = (error: unknown): string =>
  error instanceof Error ? error.message : String(error);

const appendErrors = (diagnostics: string[], stage: string, errors: string[]): void => {
  for (const error of errors) diagnostics.push(`${stage}: ${error}`);
};

export async function buildDevPagefindFiles({
  api,
  documents,
  renderHtml,
}: BuildDevPagefindFilesOptions): Promise<Map<string, Uint8Array>> {
  const diagnostics: string[] = [];
  let index: PagefindIndex | undefined;
  let files = new Map<string, Uint8Array>();

  try {
    try {
      const response = await api.createIndex({
        forceLanguage: 'en',
        rootSelector: PAGEFIND_ROOT_SELECTOR,
        writePlayground: false,
      });
      index = response.index;
      appendErrors(diagnostics, 'createIndex', response.errors);
      if (!index) diagnostics.push('createIndex: Pagefind did not return an index');
    } catch (error) {
      diagnostics.push(`createIndex: ${describeError(error)}`);
    }

    if (index) {
      for (const pathname of documents) {
        try {
          const content = await renderHtml(pathname);
          const bodyCount = load(content)(PAGEFIND_ROOT_SELECTOR).length;
          if (bodyCount !== 1) {
            diagnostics.push(
              `renderHtml(${pathname}): expected exactly one ${PAGEFIND_ROOT_SELECTOR}; received ${bodyCount}`,
            );
            continue;
          }
          const response = await index.addHTMLFile({ content, url: pathname });
          appendErrors(diagnostics, `addHTMLFile(${pathname})`, response.errors);
        } catch (error) {
          diagnostics.push(`addHTMLFile(${pathname}): ${describeError(error)}`);
        }
      }

      try {
        const response = await index.getFiles();
        appendErrors(diagnostics, 'getFiles', response.errors);
        files = new Map(response.files.map((file) => [file.path, file.content]));
      } catch (error) {
        diagnostics.push(`getFiles: ${describeError(error)}`);
      }
    }
  } finally {
    if (index) {
      try {
        await index.deleteIndex();
      } catch (error) {
        diagnostics.push(`deleteIndex: ${describeError(error)}`);
      }
    }
  }

  if (diagnostics.length > 0) {
    throw new Error(`Development Pagefind build failed:\n- ${diagnostics.join('\n- ')}`);
  }
  return files;
}

interface DevIndexControllerOptions {
  build: () => Promise<Map<string, Uint8Array>>;
  debounceMs: number;
  disposeService?: () => Promise<void>;
  onError?: (error: unknown) => void;
  onSwap?: (files: ReadonlyMap<string, Uint8Array>) => void;
}

export interface DevIndexController {
  dispose: () => Promise<void>;
  files: () => ReadonlyMap<string, Uint8Array>;
  rebuildNow: () => Promise<void>;
  schedule: () => void;
}

export function createDevIndexController({
  build,
  debounceMs,
  disposeService,
  onError,
  onSwap,
}: DevIndexControllerOptions): DevIndexController {
  let currentFiles: ReadonlyMap<string, Uint8Array> = new Map();
  let disposed = false;
  let inFlight: Promise<void> | undefined;
  let rerun = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const rebuildNow = async (): Promise<void> => {
    if (disposed) return;
    if (inFlight) {
      rerun = true;
      await inFlight;
      return;
    }

    inFlight = (async () => {
      do {
        rerun = false;
        try {
          const nextFiles = await build();
          if (!disposed) {
            currentFiles = nextFiles;
            onSwap?.(currentFiles);
          }
        } catch (error) {
          onError?.(error);
        }
      } while (rerun && !disposed);
    })();
    try {
      await inFlight;
    } finally {
      inFlight = undefined;
    }
  };

  return {
    async dispose() {
      if (disposed) return;
      disposed = true;
      if (timer) clearTimeout(timer);
      timer = undefined;
      await inFlight;
      await disposeService?.();
    },
    files: () => currentFiles,
    rebuildNow,
    schedule() {
      if (disposed) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = undefined;
        void rebuildNow();
      }, debounceMs);
    },
  };
}

interface DevPagefindAssetResponse {
  body?: Uint8Array;
  headers: Record<string, string>;
  status: number;
}

const contentTypeFor = (file: string): string => {
  if (file.endsWith('.js')) return 'text/javascript; charset=utf-8';
  if (file.endsWith('.wasm')) return 'application/wasm';
  if (file.endsWith('.json')) return 'application/json; charset=utf-8';
  if (file.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'application/octet-stream';
};

export function readDevPagefindAsset(
  rawUrl: string,
  files: ReadonlyMap<string, Uint8Array>,
): DevPagefindAssetResponse {
  const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'text/plain; charset=utf-8' };
  const rawPathname = rawUrl.split('?', 1)[0];
  if (!rawPathname.startsWith('/pagefind/')) return { headers, status: 404 };

  let file: string;
  try {
    file = decodeURIComponent(rawPathname.slice('/pagefind/'.length));
  } catch {
    return { headers, status: 400 };
  }
  if (
    !file ||
    file.includes('\\') ||
    file.includes('\0') ||
    file.split('/').some((segment) => segment === '.' || segment === '..')
  ) {
    return { headers, status: 400 };
  }

  const body = files.get(file);
  if (!body) return { headers, status: 404 };
  return {
    body,
    headers: { 'Cache-Control': 'no-store', 'Content-Type': contentTypeFor(file) },
    status: 200,
  };
}

const devServerOrigin = (server: ViteDevServer): string | undefined => {
  const resolvedUrl = server.resolvedUrls?.local[0];
  if (resolvedUrl) return resolvedUrl;
  const address = server.httpServer?.address();
  if (!address || typeof address === 'string') return;
  return `http://127.0.0.1:${address.port}`;
};

const isSearchSource = (root: string, file: string): boolean => {
  const relative = path.relative(root, file).replaceAll(path.sep, '/');
  if (relative.startsWith('..')) return false;
  if (/^(docs\/(?:index|changelog)|src\/.+\/index)\.mdx$/i.test(relative)) return true;
  return relative.startsWith('src/') && /\.[cm]?[jt]sx?$/i.test(relative);
};

const renderDocumentHtml = async (origin: string, pathname: string): Promise<string> => {
  const response = await fetch(new URL(pathname, origin), {
    headers: { Accept: 'text/html' },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} while rendering ${pathname}`);
  }
  return response.text();
};

interface DevPagefindPluginOptions {
  debounceMs?: number;
  getDocuments?: () => string[];
  loadPagefind?: () => Promise<DevPagefindNodeApi>;
  renderHtml?: (pathname: string) => Promise<string>;
  root?: string;
}

export function devPagefindPlugin(options: DevPagefindPluginOptions = {}): Plugin {
  const root = path.resolve(options.root ?? process.cwd());
  const debounceMs = options.debounceMs ?? 200;

  return {
    apply: 'serve',
    configureServer(server) {
      let apiPromise: Promise<DevPagefindNodeApi> | undefined;
      const getApi = () => (apiPromise ??= options.loadPagefind?.() ?? import('pagefind'));
      const controller = createDevIndexController({
        build: async () => {
          const origin = devServerOrigin(server);
          if (!origin) throw new Error('Vite development server has no listening origin');
          const documents =
            options.getDocuments?.() ??
            createContentManifest(root).documents.map(({ pathname }) => pathname);
          return buildDevPagefindFiles({
            api: await getApi(),
            documents,
            renderHtml: options.renderHtml ?? ((pathname) => renderDocumentHtml(origin, pathname)),
          });
        },
        debounceMs,
        disposeService: async () => {
          if (!apiPromise) return;
          await (await apiPromise).close();
        },
        onError: (error) => server.config.logger.error(describeError(error)),
        onSwap: () => {
          server.ws.send({ event: PAGEFIND_HMR_EVENT, type: 'custom' });
        },
      });

      server.middlewares.use((request, response, next) => {
        if (!request.url?.split('?', 1)[0].startsWith('/pagefind/')) return next();
        const asset = readDevPagefindAsset(request.url, controller.files());
        response.statusCode = asset.status;
        for (const [name, value] of Object.entries(asset.headers)) response.setHeader(name, value);
        response.end(asset.body);
      });

      const handleSourceChange = (file: string) => {
        if (isSearchSource(root, file)) controller.schedule();
      };
      server.watcher.on('add', handleSourceChange);
      server.watcher.on('change', handleSourceChange);
      server.watcher.on('unlink', handleSourceChange);

      const start = () => controller.schedule();
      if (server.httpServer?.listening) start();
      else server.httpServer?.once('listening', start);

      server.httpServer?.once('close', () => {
        server.watcher.off('add', handleSourceChange);
        server.watcher.off('change', handleSourceChange);
        server.watcher.off('unlink', handleSourceChange);
        void controller
          .dispose()
          .catch((error) => server.config.logger.error(describeError(error)));
      });
    },
    name: 'lobe-docs:dev-pagefind',
  };
}
