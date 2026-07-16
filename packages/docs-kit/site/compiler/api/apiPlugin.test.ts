// @vitest-environment node

import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

import { createServer, type ViteDevServer } from 'vite';

import type { ApiComponent } from '../../types/api';
import { apiPlugin, createApiVirtualModuleId } from './apiPlugin';

let root: string;
let server: ViteDevServer | undefined;

const write = (path: string, contents: string) => {
  const absolutePath = resolve(root, path);
  mkdirSync(dirname(absolutePath), { recursive: true });
  writeFileSync(absolutePath, contents);
  return absolutePath;
};

const waitForChange = async (path: string, contents: string) => {
  const observed = new Promise<void>((resolveObserved, rejectObserved) => {
    const timeout = setTimeout(
      () => rejectObserved(new Error(`Watcher timed out: ${path}`)),
      10_000,
    );
    const onChange = (changedPath: string) => {
      if (resolve(changedPath) !== resolve(path)) return;
      clearTimeout(timeout);
      server!.watcher.off('change', onChange);
      resolveObserved();
    };
    server!.watcher.on('change', onChange);
  });
  writeFileSync(path, contents);
  server!.watcher.emit('change', path);
  await observed;
};

const loadApi = async (): Promise<ApiComponent> => {
  const id = createApiVirtualModuleId({
    documentPath: resolve(root, 'src/Button/index.mdx'),
    name: 'Button',
    tsconfigPath: resolve(root, 'tsconfig.json'),
  });
  const module = await server!.ssrLoadModule(id);
  return module.default as ApiComponent;
};

beforeEach(async () => {
  root = mkdtempSync(join(tmpdir(), 'lobe-api-plugin-'));
  write(
    'tsconfig.json',
    JSON.stringify({
      compilerOptions: { module: 'esnext', moduleResolution: 'bundler', strict: true },
      include: ['src'],
    }),
  );
  write('src/Button/index.mdx', '<Api name="Button" />');
  write('src/Button/index.ts', "export { Button } from './Button';\n");
  write('src/Button/props.ts', 'export interface ButtonProps { first?: boolean }\n');
  write(
    'src/Button/Button.ts',
    "import type { ButtonProps } from './props';\nexport const Button = (props: ButtonProps) => props.first;\n",
  );
  server = await createServer({
    configFile: false,
    logLevel: 'silent',
    plugins: [apiPlugin({ root, tsconfigPath: resolve(root, 'tsconfig.json') })],
    root,
    server: { middlewareMode: true },
  });
});

afterEach(async () => {
  await server?.close();
  server = undefined;
  rmSync(root, { force: true, recursive: true });
});

it('invalidates virtual modules and generation caches after props and target changes', async () => {
  expect((await loadApi()).properties.map(({ name }) => name)).toEqual(['first']);

  const propsPath = resolve(root, 'src/Button/props.ts');
  await waitForChange(propsPath, 'export interface ButtonProps { second?: string }\n');

  expect((await loadApi()).properties.map(({ name }) => name)).toEqual(['second']);

  const targetPath = resolve(root, 'src/Button/Button.ts');
  await waitForChange(
    targetPath,
    'export const Button = (props: { target?: number }) => props.target;\n',
  );

  expect((await loadApi()).properties.map(({ name }) => name)).toEqual(['target']);
}, 15_000);

it('evicts rejected generations so a repaired barrel can load', async () => {
  const barrelPath = resolve(root, 'src/Button/index.ts');
  await expect(loadApi()).resolves.toMatchObject({ name: 'Button' });
  await waitForChange(barrelPath, "export { Missing as Button } from './missing';\n");
  await expect(loadApi()).rejects.toThrow(/Button[\s\S]*could not be resolved|Missing/);

  await waitForChange(barrelPath, "export { Button } from './Button';\n");

  await expect(loadApi()).resolves.toMatchObject({ name: 'Button' });
});

it('invalidates after tsconfig changes', async () => {
  expect((await loadApi()).properties).toHaveLength(1);
  const tsconfig = resolve(root, 'tsconfig.json');
  await waitForChange(
    tsconfig,
    JSON.stringify({
      compilerOptions: { module: 'esnext', moduleResolution: 'bundler', strict: true },
      include: ['src/Other'],
    }),
  );

  await expect(loadApi()).rejects.toThrow(/Invalid TypeScript config[\s\S]*No inputs/);
  await waitForChange(
    tsconfig,
    JSON.stringify({
      compilerOptions: { module: 'esnext', moduleResolution: 'bundler', strict: true },
      include: ['src'],
    }),
  );

  await expect(loadApi()).resolves.toMatchObject({ name: 'Button' });
});

it('normalizes absolute request paths out of virtual IDs and serialized browser data', async () => {
  const publicId = createApiVirtualModuleId({
    documentPath: resolve(root, 'src/Button/index.mdx'),
    name: 'Button',
    tsconfigPath: resolve(root, 'tsconfig.json'),
  });
  const resolvedId = await server!.pluginContainer.resolveId(publicId);
  const transformed = await server!.transformRequest(publicId, { ssr: true });
  const component = await loadApi();

  expect(resolvedId?.id).not.toContain(encodeURIComponent(root));
  expect(JSON.stringify(component)).not.toContain(root);
  expect(transformed?.code).not.toMatch(/typescript|node:fs|site\/compiler\/api|%2FUsers/i);
});

it('releases the TypeScript generation at buildEnd before a subsequent environment build', async () => {
  const plugin = apiPlugin({ root, tsconfigPath: resolve(root, 'tsconfig.json') });
  const publicId = createApiVirtualModuleId({
    documentPath: resolve(root, 'src/Button/index.mdx'),
    name: 'Button',
  });
  const resolveId =
    typeof plugin.resolveId === 'function' ? plugin.resolveId : plugin.resolveId?.handler;
  const load = typeof plugin.load === 'function' ? plugin.load : plugin.load?.handler;
  const buildEnd =
    typeof plugin.buildEnd === 'function' ? plugin.buildEnd : plugin.buildEnd?.handler;
  const context = { addWatchFile: () => undefined };
  const internalId = await resolveId?.call(context as never, publicId, undefined, {
    attributes: {},
    isEntry: false,
  });
  const initial = await load?.call(context as never, String(internalId));

  expect(String(initial)).toContain('"first"');
  expect(buildEnd).toBeTypeOf('function');

  await buildEnd?.call(context as never);
  writeFileSync(
    resolve(root, 'src/Button/Button.ts'),
    'export const Button = (props: { afterBuild?: string }) => props.afterBuild;\n',
  );
  const rebuilt = await load?.call(context as never, String(internalId));

  expect(String(rebuilt)).toContain('"afterBuild"');
  expect(String(rebuilt)).not.toContain('"first"');
});
