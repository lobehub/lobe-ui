// @vitest-environment node

import { mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { clearDocsConfigCache } from '../../src/config';
import { lobeDocsSiteConfigPlugin } from './vitePlugin';

const temporaryRoots: string[] = [];

const createFixtureConsumerRoot = (docsConfigExtra = ''): string => {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'lobedocs-stylex-')));
  temporaryRoots.push(root);
  writeFileSync(
    join(root, 'docs.config.ts'),
    `export default {
      atomDirs: [{ dir: 'src' }],
      description: 'Fixture consumer.',
      navSections: {},
      siteUrl: 'https://fixture.example.test',
      title: 'Fixture Docs',${docsConfigExtra}
    };\n`,
  );
  writeFileSync(join(root, 'package.json'), '{ "name": "fixture", "type": "module" }\n');
  return root;
};

const installUi = (root: string): string => {
  const uiRoot = join(root, 'node_modules/@lobehub/ui');
  mkdirSync(join(uiRoot, 'es'), { recursive: true });
  writeFileSync(
    join(uiRoot, 'package.json'),
    JSON.stringify({ exports: { './style.css': './es/style.css' }, name: '@lobehub/ui' }),
  );
  writeFileSync(join(uiRoot, 'es/style.css'), '@layer lobe-ui {}\n');
  return join(uiRoot, 'es/style.css');
};

const resolveUiStyle = async (root: string) => {
  const plugin = lobeDocsSiteConfigPlugin(root);
  const resolveId =
    typeof plugin.resolveId === 'function' ? plugin.resolveId : plugin.resolveId?.handler;
  const resolved = await resolveId?.call(
    {} as never,
    'virtual:lobedocs/ui-style.css',
    undefined,
    {} as never,
  );
  const load = typeof plugin.load === 'function' ? plugin.load : plugin.load?.handler;
  const emptyCode =
    typeof resolved === 'string' && resolved.startsWith('\0')
      ? await load?.call({} as never, resolved)
      : undefined;
  return { emptyCode, resolved };
};

const loadStylexModule = async (root: string, command: 'build' | 'serve' = 'build') => {
  const plugin = lobeDocsSiteConfigPlugin(root);
  const configResolved =
    typeof plugin.configResolved === 'function'
      ? plugin.configResolved
      : plugin.configResolved?.handler;
  await configResolved?.call({} as never, { command } as never);
  const load = typeof plugin.load === 'function' ? plugin.load : plugin.load?.handler;
  const result = await load?.call({} as never, '\0virtual:lobedocs/stylex');
  return typeof result === 'string' ? result : result?.code;
};

afterEach(() => {
  clearDocsConfigCache();
  for (const root of temporaryRoots.splice(0)) rmSync(root, { force: true, recursive: true });
});

it('resolves the consumer @lobehub/ui style.css to the real file when StyleX is not configured', async () => {
  const root = createFixtureConsumerRoot();
  const styleCss = installUi(root);

  await expect(resolveUiStyle(root)).resolves.toEqual({ emptyCode: undefined, resolved: styleCss });
});

it('never hides the @lobehub/ui import inside the virtual stylex module', async () => {
  // React Router's dev critical-CSS walk cannot see CSS imported from a virtual module, so the
  // SSR first paint lost every @lobehub/ui rule until the client bundle injected it.
  const root = createFixtureConsumerRoot();
  installUi(root);

  await expect(loadStylexModule(root)).resolves.not.toContain('node_modules/@lobehub/ui');
  await expect(loadStylexModule(root, 'serve')).resolves.not.toContain('node_modules/@lobehub/ui');
});

it('resolves to an empty stylesheet when the consumer has no style.css', async () => {
  const root = createFixtureConsumerRoot();

  await expect(resolveUiStyle(root)).resolves.toEqual({
    emptyCode: '',
    resolved: '\0virtual:lobedocs/ui-style.css',
  });
});

it('always emits the docs-kit StyleX stylesheet and dev runtime', async () => {
  const root = createFixtureConsumerRoot();
  installUi(root);

  await expect(loadStylexModule(root)).resolves.toContain('styles/stylex.css');
  await expect(loadStylexModule(root, 'serve')).resolves.toContain('virtual:stylex:runtime');
});

it('resolves to an empty stylesheet when StyleX compiles @lobehub/ui from source', async () => {
  const root = createFixtureConsumerRoot(`\n      stylex: {},`);
  installUi(root);

  await expect(resolveUiStyle(root)).resolves.toEqual({
    emptyCode: '',
    resolved: '\0virtual:lobedocs/ui-style.css',
  });
  await expect(loadStylexModule(root)).resolves.toContain('styles/stylex.css');
});
