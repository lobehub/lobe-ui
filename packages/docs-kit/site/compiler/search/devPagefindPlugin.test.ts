import { EventEmitter } from 'node:events';

import type { Plugin, ViteDevServer } from 'vite';

import { PAGEFIND_HMR_EVENT } from '../../search/types';
import {
  buildDevPagefindFiles,
  createDevIndexController,
  type DevPagefindNodeApi,
  devPagefindPlugin,
  readDevPagefindAsset,
} from './devPagefindPlugin';

const bytes = (value: string) => new TextEncoder().encode(value);

const configurePlugin = (plugin: Plugin, server: ViteDevServer): void => {
  const hook = plugin.configureServer;
  const handler = typeof hook === 'function' ? hook : hook?.handler;

  (handler as ((server: ViteDevServer) => void) | undefined)?.(server);
};

it('indexes actual rendered HTML and returns Pagefind files in memory', async () => {
  const added: Array<{ content: string; url?: string }> = [];
  const index = {
    addHTMLFile: vi.fn(async (file) => {
      added.push(file);
      return { errors: [], file: {} };
    }),
    deleteIndex: vi.fn(async () => null),
    getFiles: vi.fn(async () => ({
      errors: [],
      files: [{ content: bytes('export const search = true'), path: 'pagefind.js' }],
    })),
  };
  const api = {
    close: vi.fn(async () => null),
    createIndex: vi.fn(async () => ({ errors: [], index })),
  } as unknown as DevPagefindNodeApi;

  const files = await buildDevPagefindFiles({
    api,
    documents: ['/components/button'],
    renderHtml: async (pathname) =>
      `<html><body><article data-pagefind-body>${pathname}</article></body></html>`,
  });

  expect(added).toEqual([
    {
      content: '<html><body><article data-pagefind-body>/components/button</article></body></html>',
      url: '/components/button',
    },
  ]);
  expect(new TextDecoder().decode(files.get('pagefind.js'))).toContain('search = true');
  expect(index.deleteIndex).toHaveBeenCalledOnce();
});

it.each([
  ['missing', '<html><body>SPA fallback</body></html>', 0],
  [
    'duplicate',
    '<html><body><main data-pagefind-body>one</main><aside data-pagefind-body>two</aside></body></html>',
    2,
  ],
] as const)(
  'rejects a rendered document with a %s Pagefind body before replacing the index',
  async (_, html, count) => {
    const index = {
      addHTMLFile: vi.fn(async () => ({ errors: [], file: {} })),
      deleteIndex: vi.fn(async () => null),
      getFiles: vi.fn(async () => ({ errors: [], files: [] })),
    };
    const api = {
      close: vi.fn(async () => null),
      createIndex: vi.fn(async () => ({ errors: [], index })),
    } as unknown as DevPagefindNodeApi;

    await expect(
      buildDevPagefindFiles({
        api,
        documents: ['/components/button'],
        renderHtml: async () => html,
      }),
    ).rejects.toThrow(new RegExp(`components/button.*exactly one.*received ${count}`, 'i'));
    expect(index.addHTMLFile).not.toHaveBeenCalled();
    expect(index.deleteIndex).toHaveBeenCalledOnce();
  },
);

it('fails on addHTMLFile and getFiles errors instead of publishing a partial index', async () => {
  const index = {
    addHTMLFile: vi.fn(async () => ({ errors: ['broken document'], file: {} })),
    deleteIndex: vi.fn(async () => null),
    getFiles: vi.fn(async () => ({ errors: ['incomplete files'], files: [] })),
  };
  const api = {
    close: vi.fn(async () => null),
    createIndex: vi.fn(async () => ({ errors: [], index })),
  } as unknown as DevPagefindNodeApi;

  await expect(
    buildDevPagefindFiles({
      api,
      documents: ['/components/button'],
      renderHtml: async () => '<html><article data-pagefind-body>Button</article></html>',
    }),
  ).rejects.toThrow(/addHTMLFile.*broken document[\s\S]*getFiles.*incomplete files/i);
  expect(index.deleteIndex).toHaveBeenCalledOnce();
});

it('reports createIndex and deleteIndex failures together', async () => {
  const index = {
    addHTMLFile: vi.fn(async () => ({ errors: [], file: {} })),
    deleteIndex: vi.fn(async () => {
      throw new Error('delete failed');
    }),
    getFiles: vi.fn(async () => ({ errors: [], files: [] })),
  };
  const api = {
    close: vi.fn(async () => null),
    createIndex: vi.fn(async () => ({ errors: ['create warning'], index })),
  } as unknown as DevPagefindNodeApi;

  await expect(
    buildDevPagefindFiles({ api, documents: [], renderHtml: async () => '<html></html>' }),
  ).rejects.toThrow(/createIndex.*create warning[\s\S]*deleteIndex.*delete failed/i);
});

it('atomically swaps only a successful debounced rebuild and retains the last good files', async () => {
  vi.useFakeTimers();
  const builds = [
    () => Promise.resolve(new Map([['pagefind.js', bytes('first')]])),
    () => Promise.reject(new Error('rebuild failed')),
  ];
  const swaps: string[] = [];
  const errors: string[] = [];
  const controller = createDevIndexController({
    build: vi.fn(() => builds.shift()!()),
    debounceMs: 25,
    onError: (error) => errors.push(String(error)),
    onSwap: (files) => swaps.push(new TextDecoder().decode(files.get('pagefind.js'))),
  });

  controller.schedule();
  controller.schedule();
  await vi.advanceTimersByTimeAsync(25);
  expect(new TextDecoder().decode(controller.files().get('pagefind.js'))).toBe('first');

  controller.schedule();
  await vi.advanceTimersByTimeAsync(25);
  expect(new TextDecoder().decode(controller.files().get('pagefind.js'))).toBe('first');
  expect(swaps).toEqual(['first']);
  expect(errors).toEqual([expect.stringContaining('rebuild failed')]);
  await controller.dispose();
  vi.useRealTimers();
});

it('serves exact MIME types without caching and rejects encoded traversal', () => {
  const files = new Map([
    ['pagefind.js', bytes('js')],
    ['pagefind.wasm', bytes('wasm')],
    ['index.pf_index', bytes('index')],
  ]);

  expect(readDevPagefindAsset('/pagefind/pagefind.js', files)).toMatchObject({
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/javascript; charset=utf-8',
    },
    status: 200,
  });
  expect(readDevPagefindAsset('/pagefind/pagefind.wasm', files).headers['Content-Type']).toBe(
    'application/wasm',
  );
  expect(readDevPagefindAsset('/pagefind/index.pf_index', files).headers['Content-Type']).toBe(
    'application/octet-stream',
  );
  expect(readDevPagefindAsset('/pagefind/%2e%2e/secret', files)).toMatchObject({ status: 400 });
});

it('disposes pending work and the Pagefind service exactly once', async () => {
  vi.useFakeTimers();
  const close = vi.fn(async () => undefined);
  const build = vi.fn(async () => new Map<string, Uint8Array>());
  const controller = createDevIndexController({ build, debounceMs: 50, disposeService: close });

  controller.schedule();
  await controller.dispose();
  await vi.advanceTimersByTimeAsync(100);

  expect(build).not.toHaveBeenCalled();
  expect(close).toHaveBeenCalledOnce();
  vi.useRealTimers();
});

it('wires successful rebuilds through Vite middleware and closes the service on server shutdown', async () => {
  vi.useFakeTimers();
  const events = new EventEmitter();
  Object.assign(events, { address: () => ({ address: '127.0.0.1', family: 'IPv4', port: 4173 }) });
  const middleware = vi.fn();
  const watcher = new EventEmitter();
  const wsSend = vi.fn();
  const close = vi.fn(async () => null);
  const index = {
    addHTMLFile: vi.fn(async () => ({ errors: [], file: {} })),
    deleteIndex: vi.fn(async () => null),
    getFiles: vi.fn(async () => ({
      errors: [],
      files: [{ content: bytes('pagefind dev asset'), path: 'pagefind.js' }],
    })),
  };
  const api = {
    close,
    createIndex: vi.fn(async () => ({ errors: [], index })),
  } as unknown as DevPagefindNodeApi;
  const server = {
    config: { logger: { error: vi.fn() } },
    httpServer: events,
    middlewares: { use: (handler: unknown) => middleware.mockImplementation(handler as never) },
    resolvedUrls: { local: ['http://127.0.0.1:4173/'] },
    watcher,
    ws: { send: wsSend },
  };
  const plugin = devPagefindPlugin({
    debounceMs: 5,
    getDocuments: () => ['/components/button'],
    loadPagefind: async () => api,
    renderHtml: async (pathname) =>
      `<html><body><article data-pagefind-body>${pathname}</article></body></html>`,
  });

  configurePlugin(plugin, server as never);
  events.emit('listening');
  await vi.advanceTimersByTimeAsync(50);
  expect(wsSend).not.toHaveBeenCalled();

  const pendingResponse = {
    end: vi.fn(),
    setHeader: vi.fn(),
    statusCode: 0,
  };
  middleware({ url: '/pagefind/pagefind.js' }, pendingResponse, vi.fn());
  expect(pendingResponse.statusCode).toBe(404);
  await vi.waitFor(() =>
    expect(wsSend).toHaveBeenCalledWith({
      event: PAGEFIND_HMR_EVENT,
      type: 'custom',
    }),
  );

  const response = {
    end: vi.fn(),
    setHeader: vi.fn(),
    statusCode: 0,
  };
  middleware({ url: '/pagefind/pagefind.js' }, response, vi.fn());
  expect(response.statusCode).toBe(200);
  expect(response.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store');
  expect(new TextDecoder().decode(response.end.mock.calls[0]?.[0])).toBe('pagefind dev asset');

  events.emit('close');
  await vi.waitFor(() => expect(close).toHaveBeenCalledOnce());
  expect(watcher.listenerCount('change')).toBe(0);
  vi.useRealTimers();
});

it('reports Pagefind service close failures through the Vite logger', async () => {
  vi.useFakeTimers();
  const events = new EventEmitter();
  const logger = { error: vi.fn() };
  const api = {
    close: vi.fn(async () => {
      throw new Error('close failed');
    }),
    createIndex: vi.fn(async () => ({
      errors: [],
      index: {
        addHTMLFile: vi.fn(async () => ({ errors: [], file: {} })),
        deleteIndex: vi.fn(async () => null),
        getFiles: vi.fn(async () => ({ errors: [], files: [] })),
      },
    })),
  } as unknown as DevPagefindNodeApi;
  const middleware = vi.fn();
  const server = {
    config: { logger },
    httpServer: events,
    middlewares: { use: (handler: unknown) => middleware.mockImplementation(handler as never) },
    resolvedUrls: { local: ['http://127.0.0.1:4173/'] },
    watcher: new EventEmitter(),
    ws: { send: vi.fn() },
  };
  const plugin = devPagefindPlugin({
    debounceMs: 1,
    getDocuments: () => [],
    loadPagefind: async () => api,
    renderHtml: async () => '<html></html>',
  });

  configurePlugin(plugin, server as never);
  events.emit('listening');
  middleware(
    { url: '/pagefind/pagefind.js' },
    { end: vi.fn(), setHeader: vi.fn(), statusCode: 0 },
    vi.fn(),
  );
  await vi.advanceTimersByTimeAsync(1);
  events.emit('close');
  await vi.waitFor(() => expect(logger.error).toHaveBeenCalledWith('close failed'));
  vi.useRealTimers();
});
