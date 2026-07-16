# Docs Kit Extraction — Phase 1 Task Breakdown

Spec: `docs/superpowers/specs/2026-07-16-docs-kit-extraction-design.md` (Phase 1: extract `site/` into `packages/docs-kit` with lobe-ui as first consumer).

## Global Constraints

- Branch: `feat/docs-kit`. Never push. Never add AI co-authorship to commits.
- Commit messages follow repo convention, e.g. `✨ feat(docs-kit): ...` / `♻️ refactor(docs-kit): ...` (see `git log --oneline` for style).
- Zero code comments and zero JSDoc in new/edited code, except notes on genuinely unexpected behavior (workarounds, footguns). Never section headers or what-comments.
- All code, docs, and commit messages in English.
- Package manager is pnpm. Node scripts run via `tsx`.
- Route parity is the phase gate: the set of prerendered paths from `getPrerenderPaths()` and the built HTML route set must be identical before and after each task. Task 1 records the baseline.
- Do not run repo-wide lint/format. Lint/typecheck only what you touched: `npx eslint --fix <files>` and `npm run type-check` (typecheck is repo-wide by nature; that is acceptable).
- Tests: `npx vitest run <paths>` scoped to affected areas; the full `npx vitest run` must pass before each task's final commit.

## Task 1 — Relocate site/ into packages/docs-kit (pure move, no behavior change)

Goal: `site/` moves to `packages/docs-kit/site/`; everything still works from the repo root exactly as before. No parameterization yet.

Steps:

1. Record the baseline BEFORE moving (commit nothing yet):
   - `npx tsx -e "import('./site/compiler/manifests').then(async m => console.log(JSON.stringify(await m.getPrerenderPaths(), null, 2)))" > .superpowers/sdd/baseline-prerender-paths.json` (create dir if needed; this file is git-ignored scratch — do not commit it).
2. Add `packages:\n  - packages/*` to `pnpm-workspace.yaml` (keep existing keys).
3. Create `packages/docs-kit/package.json`:
   - name `@lobehub/docs-kit`, `"private": true` for now, `"type": "module"`, version `0.0.0`.
   - No dependencies yet — the kit code continues to resolve deps from the root package during Phase 1 (workspace hoisting). Note this as acceptable interim state.
4. `git mv site packages/docs-kit/site`.
5. Fix every reference to the old `site/` path:
   - `react-router.config.ts`: `appDirectory: 'packages/docs-kit/site'`, import of `getPrerenderPaths` from the new path.
   - `vite.config.ts`: imports of `remarkApi`, `rehypeHeadingIds`, `devPagefindPlugin`, `lobeDocs`; `optimizeDeps.entries` globs (`site/app/**` → `packages/docs-kit/site/app/**`, same for `site/components/**`); mdx `providerImportSource` (`/site/app/mdx-components` → new absolute-from-root path `/packages/docs-kit/site/app/mdx-components`).
   - `package.json` scripts: `docs:build` path to `finalizeBuild.ts`.
   - `tsconfig.json` / any tsconfig include/paths mentioning `site`.
   - `vitest.config.ts` / eslint / stylelint / prettier ignore configs mentioning `site/`.
   - Search the whole repo for remaining literal `site/` references (`rg -l "['\"/]site/" --glob '!package*.json' --glob '!.git'` and review each hit; also check `.gitignore`, `.prettierignore`, `.eslintignore` equivalents, CI workflow files under `.github/`).
   - Inside the moved tree, check for self-references assuming repo-root-relative `site/...` paths (e.g. `providerImportSource`, path resolution in `compiler/` using `process.cwd()` or `import.meta.dirname` — `import.meta.dirname` based paths survive the move only if their relative hops are updated; verify `compiler/inventory.ts`, `compiler/search/*`, `compiler/seo/*`, `compiler/finalizeBuild.ts`, `content/*` for path math).
6. Run `pnpm install` so the workspace picks up the new package.
7. Verify:
   - `npx vitest run` fully green.
   - `npm run type-check` green.
   - Prerender paths identical to baseline (same extraction command, diff against the baseline file).
   - `npm run docs:build` succeeds; spot-check `.react-router/build` output exists with the same route directories as before.
   - `npm run docs:dev` boots and serves `/` and one component page (curl 200 within a reasonable wait, then kill).
8. Commit as a move: keep the `git mv` rename detection intact (stage moves and edits together is fine; verify `git show --stat` displays renames, not delete+add pairs).

## Task 2 — Config surface: defineDocsConfig + docs.config.ts + parameterize hardcoded points

Goal: consumer-specific data leaves the kit. lobe-ui root gains `docs.config.ts`; the kit reads it via a loader and exposes it to app code via a vite virtual module. Route parity preserved.

Design:

1. New module `packages/docs-kit/src/config.ts` exporting:
   - `interface DocsConfig` — fields per the spec: `title`, `description`, `siteUrl` (sitemap hostname), `favicons`, `atomDirs: { dir: string; type?: string; subType?: string }[]`, `alias?: Record<string, string>`, `themeConfig` (nav items incl. external links, actions, socialLinks, giscus?, analytics?.plausible?, apiHeader?, prefersColor?, metadata/openGraph), `navSections` (the shape currently in `packages/docs-kit/site/content/navigationSections.json`), `legacyRedirects?` (shape currently in `compatibility.json`).
   - `defineDocsConfig(config: DocsConfig): DocsConfig` — identity helper.
   - `loadDocsConfig(root: string): Promise<DocsConfig>` — loads `<root>/docs.config.ts` (use vite-node/`jiti`/`tsx` import — pick the lightest already-available mechanism; `tsx` is a dependency, so a plain dynamic `import()` works when running under tsx, but the vite plugin runs inside vite's node process — prefer `jiti` if adding a dep is needed, otherwise use vite's `loadConfigFromFile`-style approach via `createServer`+`ssrLoadModule` only if simpler options fail. Simplest robust option: bundle-load with `esbuild` `build --format=esm --bundle --external:node_modules` to a temp file and import it. Choose ONE and keep it small.)
2. Virtual module: extend the existing `lobeDocs()` vite plugin (`compiler/vitePlugin.ts`) to also serve `virtual:lobedocs/site-config` returning the serializable subset of the loaded config (everything except `alias`/`atomDirs` which are build-time-only). App code imports config from there.
3. Replace hardcoded consumer data in the kit, wiring each through the config:
   - `site/content/siteMetadata.ts` → values from config (`title`, `description`, `siteUrl`, OG image).
   - `site/content/navigationSections.json` → `navSections` from config (delete the JSON from the kit; move its content into lobe-ui's `docs.config.ts`).
   - `site/content/compatibility.json` → `legacyRedirects`; the file is 251KB, so keep it as a JSON file in the CONSUMER repo (`docs.config.ts` imports it with a JSON import assertion or `createRequire`) — the config field carries the parsed data.
   - `compiler/inventory.ts` hardcoded `src/` prefix and special-case (`src/i18n/index`) → derive scan roots from `atomDirs`; the i18n special case moves into lobe-ui's `navSections`/config as an override entry (add a minimal `navigationOverrides` config field if the existing navSections shape cannot express it — prefer expressing it in existing shapes).
   - `vite.config.ts` root aliases (`@`, `@lobehub/ui` → `src`) → from config `alias`.
   - Sitemap hostname in `compiler/seo/*` → `siteUrl`.
4. Create `/Users/innei/git/work/lobe-ui/docs.config.ts` carrying ALL current values verbatim (metadata, navSections content, legacyRedirects import, atomDirs `[{ dir: 'src' }]`, aliases).
5. Root `vite.config.ts` / `react-router.config.ts` now call kit factories that consume the loaded config (e.g. `createDocsVitePlugins(config)`), shrinking root files toward thin shells — full CLI takeover is Task 3; here they may still exist but must contain no consumer data other than importing `docs.config.ts`.
6. Tests: update/extend existing compiler/content tests for the parameterized paths (inventory scan roots, navigation from config, siteMetadata from config). Add a unit test for `loadDocsConfig` with a fixture config file.
7. Verify: full vitest green, type-check green, prerender paths identical to the Task 1 baseline, `docs:build` succeeds.

## Task 3 — lobedocs CLI: kit owns vite/react-router config; root shells removed

Goal: `package.json` scripts become `lobedocs dev` / `lobedocs build`; root `vite.config.ts` and `react-router.config.ts` disappear into the kit.

Design:

1. `packages/docs-kit/bin/lobedocs.mjs` — argv dispatch (`dev`, `build`), no CLI framework. Registers `bin: { lobedocs: "bin/lobedocs.mjs" }` in the kit package.json; root package depends on `@lobehub/docs-kit` via `workspace:*` so the bin lands on PATH after `pnpm install`.
2. The CLI must run react-router with kit-owned config while the CWD is the consumer repo:
   - react-router CLI reads `react-router.config.ts` and `vite.config.ts` from project root. Investigate the cleanest override: `react-router dev/build --config <path>` flag support in react-router 8.2 (check `npx react-router build --help`); if the config-file path cannot be overridden, have the CLI WRITE nothing to the consumer repo — instead invoke the underlying `@react-router/dev` programmatic API (`import('@react-router/dev/...')`) or spawn `react-router` with `cwd` set to a kit-internal synthetic root that re-exports the consumer paths. Prefer the simplest mechanism that keeps zero config files in the consumer repo; if react-router 8.2 genuinely requires a root `react-router.config.ts`, fall back to: kit ships both files as 2-line re-exports and `lobedocs init` generates them — but exhaust the flag/programmatic options first and document the finding in the task report.
3. `lobedocs build` = react-router build + `finalizeBuild` (fold the current two-step `docs:build` script into the CLI).
4. Root cleanup: remove `vite.config.ts` + `react-router.config.ts` from repo root if (2) allows; `docs:dev`/`docs:build`/`dev` scripts call `lobedocs`. Keep `docs:build-analyze` working (`ANALYZE=1 lobedocs build`).
5. Make sure vitest, `type-check`, and eslint still work without the root vite config (vitest has its own config; check nothing else imported the root vite config).
6. Verify: full vitest green, type-check green, `lobedocs build` output routes identical to Task 1 baseline, `lobedocs dev` serves `/` and one component page.

## Task 4 — Parity audit, kit README, phase gate

Goal: prove Phase 1 changed nothing observable and document the kit.

1. Run the existing cutover audit tooling (`packages/docs-kit/site/compiler/cutoverAudit.ts` — read it first; if it audits against the live dumi site rather than a local baseline, instead do a route-set + sampled-HTML diff between a fresh `lobedocs build` and the `master` branch's `docs:build` output built in a temp worktree: `git worktree add <scratch>/master-baseline master && (cd <scratch>/master-baseline && pnpm install && npm run docs:build)` then compare route directory sets and a sample of 10 pages' rendered text content, ignoring hashed asset names).
2. Write `packages/docs-kit/README.md`: what it is, consumer surface (`docs.config.ts` + `lobedocs dev|build`), config field reference (concise table), Phase 2+ roadmap pointer to the spec.
3. Fix anything the audit surfaces; re-run until clean.
4. Final: full vitest, type-check, `lobedocs build` all green; commit.
