import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { buildReactRouterArgs } from './reactRouterArgs';
import { resolveBin } from './resolveBin';
import { runProcess } from './runProcess';

export interface CliContext {
  cwd: string;
  finalizeBuildPath: string;
  viteConfigPath: string;
}

export const createCliContext = (kitRoot: string, cwd: string): CliContext => ({
  cwd,
  finalizeBuildPath: path.join(kitRoot, 'site/compiler/finalizeBuild.ts'),
  viteConfigPath: path.join(kitRoot, 'vite.config.ts'),
});

const runReactRouter = (
  context: CliContext,
  subcommand: string,
  extraArgs: string[],
  options: { treatSignalsAsSuccess?: boolean } = {},
) => {
  const consumerRequire = createRequire(pathToFileURL(path.join(context.cwd, 'package.json')).href);
  const reactRouterBinPath = resolveBin(
    '@react-router/dev',
    'react-router',
    consumerRequire.resolve,
  );

  return runProcess(
    process.execPath,
    [
      reactRouterBinPath,
      ...buildReactRouterArgs(subcommand, context.cwd, context.viteConfigPath, extraArgs),
    ],
    { cwd: context.cwd, ...options },
  );
};

const runFinalizeBuild = (context: CliContext) => {
  const consumerRequire = createRequire(pathToFileURL(path.join(context.cwd, 'package.json')).href);
  const tsxLoaderUrl = pathToFileURL(consumerRequire.resolve('tsx')).href;

  return runProcess(process.execPath, ['--import', tsxLoaderUrl, context.finalizeBuildPath], {
    cwd: context.cwd,
  });
};

export const commands = {
  build: async (context: CliContext, args: string[]) => {
    await runReactRouter(context, 'build', args);
    await runFinalizeBuild(context);
  },
  dev: async (context: CliContext, args: string[]) => {
    await runReactRouter(context, 'dev', args, { treatSignalsAsSuccess: true });
  },
  typegen: async (context: CliContext, args: string[]) => {
    await runReactRouter(context, 'typegen', args);
  },
};

export type CliCommand = keyof typeof commands;
