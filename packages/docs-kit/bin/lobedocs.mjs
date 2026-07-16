#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const kitRoot = fileURLToPath(new URL('..', import.meta.url));
const viteConfigPath = path.join(kitRoot, 'vite.config.ts');
const finalizeBuildPath = path.join(kitRoot, 'site/compiler/finalizeBuild.ts');

const cwd = process.cwd();
const consumerRequire = createRequire(pathToFileURL(path.join(cwd, 'package.json')).href);

// `@react-router/dev`'s `exports` map does not expose `./bin.cjs`, so it
// cannot be `require.resolve`d directly — derive it from the package's own
// `bin` field instead, which its `package.json` subpath does expose.
const resolveBin = (packageName) => {
  const packageJsonPath = consumerRequire.resolve(`${packageName}/package.json`);
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const binEntry =
    typeof packageJson.bin === 'string' ? packageJson.bin : Object.values(packageJson.bin)[0];
  return path.join(path.dirname(packageJsonPath), binEntry);
};

const reactRouterBinPath = resolveBin('@react-router/dev');
const tsxLoaderUrl = pathToFileURL(consumerRequire.resolve('tsx')).href;

const run = (command, args, options = {}) =>
  new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { cwd, stdio: 'inherit', ...options });
    child.on('error', reject);
    child.on('exit', (code, signal) => {
      if (signal) {
        reject(new Error(`${command} ${args.join(' ')} exited via signal ${signal}`));
        return;
      }
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
        return;
      }
      resolvePromise();
    });
  });

// `--config` lets Vite load `vite.config.ts` from the kit, but
// `@react-router/dev`'s CLI also passes its resolved root straight through as
// Vite's inline `root` (see `build-*.js`/`dev-*.js`/`hasReactRouterRscPlugin`
// in `@react-router/dev`), which becomes the base for every root-absolute
// `import.meta.glob` in the consumer's app code (e.g. `/docs/*.mdx`) — and,
// once `--config` is passed, the CLI's own root-resolution fallback becomes
// `dirname(configFile)` (the kit), not `cwd`. Passing `cwd` as the explicit
// positional project directory pins root resolution to the consumer repo
// regardless of `--config`, so a 2-line `react-router.config.ts` shell stays
// required at the consumer root for `react-router.config` discovery.
const runReactRouter = (subcommand, extraArgs) =>
  run(process.execPath, [
    reactRouterBinPath,
    subcommand,
    cwd,
    '--config',
    viteConfigPath,
    ...extraArgs,
  ]);

const runFinalizeBuild = () => run(process.execPath, ['--import', tsxLoaderUrl, finalizeBuildPath]);

const commands = {
  build: async (args) => {
    await runReactRouter('build', args);
    await runFinalizeBuild();
  },
  dev: async (args) => {
    await runReactRouter('dev', args);
  },
  typegen: async (args) => {
    await runReactRouter('typegen', args);
  },
};

const [command, ...args] = process.argv.slice(2);
const handler = commands[command];

if (!handler) {
  console.error(`Unknown lobedocs command: ${command ?? '<none>'}`);
  console.error(`Usage: lobedocs <${Object.keys(commands).join('|')}> [...args]`);
  process.exit(1);
}

try {
  await handler(args);
} catch (error) {
  console.error(error);
  process.exit(1);
}
