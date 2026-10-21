---
name: lobe-ui-v6-migration
description: >
  Upgrade an app from @lobehub/ui 5.x to 6.x: remove antd and antd-style, replace ThemeProvider
  with theme.css + data-theme attributes, move @lobehub/ui/base-ui imports to @lobehub/ui, and fix
  the component prop changes, driven by the @lobehub/ui-codemod report. Trigger on: upgrade or
  migrate @lobehub/ui to v6, lobe-ui v6 / 6.0 beta, remove antd from a lobe-ui app,
  "ThemeProvider is not exported", "Cannot find module '@lobehub/ui/base-ui'", antd-style
  removal, 升级 lobe-ui 6, 迁移 lobe-ui.
---

# lobe-ui v6 migration

v6 has no antd, no `antd-style`, no `ThemeProvider` and no `@lobehub/ui/base-ui` subpath. The codemod does the mechanical part; this skill covers the rest. The human guide is https://ui.lobehub.com/migration-v6 — every codemod report item links to a section of it.

## Workflow

Work in order. Type-check after each step; do not batch several steps into one unverified change.

1. **Inventory.** Read `package.json` (and workspace packages in a monorepo). Find the app entry points (`main.tsx`, `app/layout.tsx`, `_app.tsx`), SSR shells, and every place that renders `ThemeProvider`, `StyleProvider`, antd `App` or antd `ConfigProvider`. Note the package manager.
2. **Dependencies.** Install `@lobehub/ui@^6`, `@lobehub/icons@^6`, `@lobehub/fluent-emoji@^5` and `motion@^14` (13 also works; keep `motion@^13` if the app uses `@lobehub/editor`, whose peer range is `^13`), plus `@lobehub/charts@^6` / `@lobehub/editor@^5` / `@lobehub/tts@^6` if used. All of them are on the `latest` tag; do not install `@beta`. Use `--registry=https://registry.npmjs.org` and verify the resolved UI version in every consuming workspace (`pnpm -r list @lobehub/ui --depth 0` for pnpm workspaces). Remove `antd`, `antd-style`, `@ant-design/*` and `rc-*` unless code outside lobe-ui still needs them (then keep them and say so in your summary). Check mirror synchronization, pnpm `minimumReleaseAge` and stale Vite optimization separately from source failures.
3. **Codemod.** Run from the repository root (`.` also reaches build config and test mocks), then the project formatter:

   ```bash
   npx --registry=https://registry.npmjs.org @lobehub/ui-codemod@latest v6 . --dry
   ```

   The CLI prints a summary, next action and paths to Markdown / JSON reports and a preview patch in a fresh `.lobe-ui-codemod/v6-*/` directory. Review the patch and rerun without `--dry`. Reports are always saved; `--report <file.md>` changes their paths, and existing output files are never overwritten. Use `--json` only when stdout must be JSON.

   Start with JSON `schemaVersion`, `codemodVersion`, `mode`, `scope`, `summary` and `nextAction`, then inspect task IDs, messages and occurrence counts before loading one task's locations. Resolve finding paths against `scope.root`; reports may live outside the project. Tasks group repeated instructions with stable IDs and retain every location; handle `manual-fix` before `review`, and do not interpret review hints as confirmed bugs. `changed` lists proposed files in dry-run and rewritten files in write mode. `items` preserves raw findings, `errors` lists parse failures, and `nextSteps` lists manual verification. Line numbers refer to transformed source even in dry-run. Exit code 0 does not mean migration success, and zero findings still requires `nextSteps`. IDs are not completion tracking; verify fixes against source on rerun.

4. **Theming (R1, R2, R3).** Replace `ThemeProvider` with the stylesheets and attributes, delete `StyleProvider` and static-css wiring. Templates per setup in [references/theming.md](references/theming.md).
5. **Imports and components (R4, R5, R6, R10, R11, R12).** Replace removed exports and antd components, then check props of every changed component. Mappings in [references/components.md](references/components.md). R5 includes both specific prop findings and general review hints: inspect the task kind, open its locations and fix what changed. R10 / R11 / R12 name each removed `Video` / `Table` / `ProTable` / `DatePicker` prop with its replacement.
6. **Styling leftovers (R6 antd-style, R8, R9).** `createStyles`, `themeMode` / `setThemeMode`, `.ant-*` selectors and `--ant-*` variables. The codemod scans JS/TS strings and CSS / Less / Sass without rewriting stylesheets, and gives verified slot / token hints where known. Search other file types, dynamically built selectors and ignored consumed sources manually. See [references/styling.md](references/styling.md).
7. **Forms.** Grep submit paths that use `@lobehub/ui/form` (`getValues()`, `onSubmit`, `onValuesChange`). They receive the whole store, not only mounted fields; pick the fields you send explicitly. Do this even when type-check is clean — it is a silent behavior change.
8. **Tests and verification (R13).** Compare relevant tests with a pre-upgrade baseline. Wrap motion consumers in `MotionProvider motion={motion}` / the app's `ConfigProvider`; keep real exports in partial mocks; query InputNumber by role instead of input order. Follow https://ui.lobehub.com/migration-v6#test-migration. Type-check and lint to zero errors. Re-run the codemod: it must rewrite nothing except merging `@lobehub/ui` imports you added, and every remaining item must be resolved or explained. Then compare light/dark × desktop/mobile, one popup, one form submit, accessible names, app-owned neutral scales and one page per changed component family. On 6.0.1 and later, check Switch aria attributes and InputPassword toggle localization explicitly. Remove temporary overrides only after verifying the replacement.

## Rules

- Never re-add antd or antd-style to silence an error. If a component has no counterpart, rebuild it from `@lobehub/ui` parts or ask the user.
- Never target generated class names (StyleX hashes) or `.ant-*`. Customize through `className`, `style`, `classNames` / `styles` slots and documented `data-*` attributes.
- Never pass `ThemeProvider` props to `ConfigProvider`; only `customFonts`, `enableCustomFonts`, `direction`, `config`, `locale`, `resources` and `motion` exist there.
- Keep behavior, not markup: when a v6 component renders different DOM, fix the app's CSS that depended on the old DOM instead of forcing the old structure.
- Unlayered global CSS in the app now beats component styles. If buttons or inputs look reset after the upgrade, move the app's resets into a layer (see references/styling.md).
- Report what you could not migrate, with file and reason, instead of leaving a silent TODO.

## Done when

- No import from `antd`, `antd-style`, `@ant-design/*`, `rc-*` or `@lobehub/ui/base-ui` remains.
- `theme.css` and `style.css` are imported once at the app root; `data-theme` is set before first paint on server-rendered pages.
- Type-check, lint and tests pass; the codemod re-run rewrites nothing.
- You listed every manual decision (removed component replaced, prop semantics changed, form submit narrowed) in your summary to the user.
