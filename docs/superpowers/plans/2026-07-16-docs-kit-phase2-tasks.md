# Docs Kit — Phase 2 Task Breakdown

Spec: `docs/superpowers/specs/2026-07-16-docs-kit-extraction-design.md` (Phase 2: editor-required capabilities). Phase 1 ledger and constraints: `.superpowers/sdd/progress.md`, memory of key limits in `packages/docs-kit/README.md` and `.superpowers/sdd/task-3-report.md`.

## Global Constraints

- Branch: `feat/docs-kit` (Task 7 works on `feat/docs-kit-hardening` in an isolated worktree, branched from `feat/docs-kit`). Never push. No AI co-authorship.
- Gitmoji commit style; English for all artifacts; zero code comments/JSDoc except genuine workaround notes.
- lobe-ui output parity remains the gate for kit changes: prerendered path set identical to `.superpowers/sdd/baseline-prerender-paths.json`; rendered pages unchanged except where a task explicitly wires a previously-inert config field carrying identical values.
- Tolerated pre-existing vitest failures: `migration.test.ts`, `i18nDynamicImport.test.ts`, plus `cutoverAudit.test.ts` only when its sole finding is the untracked local `.dumi/` dir.
- Scoped lint (`npx eslint --fix <files>`); full `npx vitest run` + `npm run type-check` before each task's final commit.

## Task 5 — Multi-atomDirs end-to-end

Goal: a consumer whose `docs.config.ts` declares multiple `atomDirs` (the lobe-editor shape: `[{ dir: 'src/react', subType: 'react' }, { dir: 'src/plugins', subType: 'plugins' }, { dir: 'src/renderer', subType: 'renderer' }]`) gets working discovery, routing, navigation grouping, and prerendering. lobe-ui (single `{ dir: 'src' }`) must be byte-identical to today.

Known blockers to solve (from Phase 1 findings):

1. `packages/docs-kit/site/app/content/registry.ts` uses `import.meta.glob('/src/**/index.mdx')` — a static literal that cannot express config-driven roots. Replace with a kit-generated virtual module (e.g. `virtual:lobedocs/document-modules`) emitted by the `lobeDocs()` vite plugin: it enumerates the mdx module map from the loaded config's `atomDirs` (plus the existing `docs/` tree if registry currently globs it — read registry.ts first and preserve every current source). Dev-server behavior matters: new/deleted mdx files should be picked up (wire the plugin's `configureServer`/watcher invalidation for the virtual module; follow the invalidation pattern the plugin already uses for its manifest modules if one exists — investigate before inventing).
2. `packages/docs-kit/site/compiler/content/createManifest.ts` `derivePathname` still has a residual hardcoded `'src/'` fallback; `inventory.ts`'s `deriveDocumentLocation` throws on no-match instead. Align both on atomDirs-driven derivation with a throw on no-match.
3. Navigation grouping per `subType`: study how `navSections` currently groups documents (site/content/navigation.ts, navSections config shape) and extend so documents from different atomDirs can land in different sections (dumi parity: subType became part of the route, e.g. `/components/react/editor`, `/components/plugins/common`). Route shape decision: preserve dumi's `/components/<subType>/<slug>` for multi-atomDir consumers while single-atomDir consumers keep `/components/<slug>`. Encode the rule in one place with tests.

Testing:

- Unit/manifest-level tests with a fixture consumer under `tests/fixtures/` (or the existing fixture root pattern): two atomDirs with distinct subTypes, at least one doc + one demo each; assert inventory, manifest pathnames, navigation sections, prerender path list.
- Parity: lobe-ui prerender paths identical to baseline; full suite; type-check.
- A full `lobedocs build` of the fixture consumer is NOT required if the manifest/prerender-path level proves the routing (report what you covered).

## Task 6 — themeConfig activation + changelog genericity (AFTER Task 5)

Goal: the declared-but-inert `DocsConfig` fields render, and the changelog story works for a consumer without lobe-ui's docs tree.

1. Inert fields to wire into the app shell (each currently accepted by `DocsConfig` but unused — verify each with grep before/after): `themeConfig.navItems` (top nav incl. external `override` links), `themeConfig.actions`, `themeConfig.socialLinks`, `themeConfig.apiHeader` (doc/source URL templates on API sections), `themeConfig.prefersColor` (default color scheme + whether the switch shows), `favicons` (document head links). Follow where the app shell currently hardcodes the equivalents (Header/Footer/pageChrome per Task 2 review notes) and replace those hardcodes with config, defaulting to current lobe-ui values in `docs.config.ts` so rendered output stays identical.
2. Giscus: confirm end-to-end that `themeConfig.giscus` drives the existing PageEndActions/Giscus component (it appears wired; prove it with a test or trace and say so).
3. Changelog: lobe-ui serves `/changelog` via `docs/changelog.mdx`. Decide and implement the generic story for a consumer with only a root `CHANGELOG.md` (options: kit-provided fallback route rendering `CHANGELOG.md` when no `docs/changelog.mdx` exists, or a `lobedocs migrate`-style generation step). Prefer the smallest mechanism; document it in the kit README.
4. README: update the config reference so previously "reserved" fields are accurate; add the "restart dev after docs.config.ts changes" note if Task 7 has not already.

Parity: lobe-ui rendered pages unchanged (fields carry identical values); full suite; type-check.

## Task 7 — Pre-Phase-3 hardening (parallel-safe; isolated worktree, branch `feat/docs-kit-hardening`)

Goal: close the robustness gaps flagged by reviews before lobe-editor becomes consumer #2. Keep every edit surgical — Task 5 runs concurrently in the main tree and `vitePlugin.ts`/`config.ts` are shared territory; minimize hunks there.

1. Subprocess config loader stdout hardening (`packages/docs-kit/src/config.ts`): a consumer `docs.config.ts` that prints to stdout (or pulls in a dep that does) currently corrupts the JSON. Have the child write JSON to a temp file passed via argv (or fd), keep stdout/stderr passthrough for diagnostics; add a test with a config file that `console.log`s garbage.
2. `packages/docs-kit/bin/lobedocs.mjs` `KNOWN_COMMANDS` duplicates the command list `src/cli/main.ts` derives from `commands`; drop bin-side validation (main.ts already rejects unknown commands) so main.ts is the single authority — verify the unknown-command UX still prints the usage line and exits non-zero (test exists? extend).
3. Single-source the client site-config type: export the client-visible config type from `src/config.ts`; use it in `site/types/demo-imports.d.ts` and for `vitePlugin.ts`'s `clientConfig` construction so drift is a type error.
4. `site/app/routes/document.tsx` not-found meta hardcodes `'Documentation not found - Lobe UI'` — derive from `siteConfig.title`.
5. Dedupe the `{ demoReferences: [], documents: [] }` legacyRedirects fallback (3 sites: `vitePlugin.ts`, `manifests.ts`, `finalizeBuild.ts`) into one exported constant in `src/config.ts`.
6. `src/config.test.ts` `__dirname` → `import.meta.dirname`.
7. Unit test for `src/cli/commands.ts` signal-flag wiring: dev passes `treatSignalsAsSuccess: true`, build/typegen don't (mock runProcess).
8. README: add "restart `lobedocs dev` after editing docs.config.ts (config is cached per process)" note.

Testing: focused tests per item; full suite + type-check in the worktree before final commit; parity untouched areas only — no route or rendered-output changes expected at all from this task.
