// `--config` lets Vite load `vite.config.ts` from the kit, but
// `@react-router/dev`'s CLI also passes its resolved root straight through as
// Vite's inline `root` (see `build-*.js`/`dev-*.js`/`hasReactRouterRscPlugin`
// in `@react-router/dev`), which becomes the base for every root-absolute
// `import.meta.glob` in the consumer's app code (e.g. `/docs/*.mdx`) — and,
// once `--config` is passed, the CLI's own root-resolution fallback becomes
// `dirname(configFile)` (the kit), not `cwd`. Passing `cwd` as the explicit
// positional project directory pins root resolution to the consumer repo
// regardless of `--config`. The CLI supplies the kit-owned React Router config
// separately when the consumer has not provided an explicit override.
export const buildReactRouterArgs = (
  subcommand: string,
  cwd: string,
  viteConfigPath: string,
  extraArgs: string[],
): string[] => [subcommand, cwd, '--config', viteConfigPath, ...extraArgs];
