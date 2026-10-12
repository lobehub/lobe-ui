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
2. **Dependencies.** Install `@lobehub/ui@beta`, `@lobehub/icons@beta`, `@lobehub/fluent-emoji@beta`, `motion@^13`, plus `@lobehub/charts@beta` / `@lobehub/editor@beta` / `@lobehub/tts@beta` if used. Remove `antd`, `antd-style`, `@ant-design/*` and `rc-*` unless code outside lobe-ui still needs them (then keep them and say so in your summary).
3. **Codemod.** Run from the repository root (`.` also reaches build config and test mocks), then the project formatter:

   ```bash
   npx @lobehub/ui-codemod@beta v6 . --json > lobe-ui-v6-report.json
   ```

   Read the JSON: `changed` lists rewritten files, `items` the work left (`rule`, `file`, `line`, `message`, `anchor`), `errors` files that failed to parse (migrate those by hand).

4. **Theming (R1, R2, R3).** Replace `ThemeProvider` with the stylesheets and attributes, delete `StyleProvider` and static-css wiring. Templates per setup in [references/theming.md](references/theming.md).
5. **Imports and components (R4, R5, R6).** Replace removed exports and antd components, then check props of every changed component. Mappings in [references/components.md](references/components.md). R5 items are info: open each file, compare the props used against the table, fix what changed.
6. **Styling leftovers (R6 antd-style, R8, R9).** `createStyles`, `themeMode` / `setThemeMode`, `.ant-*` selectors and `--ant-*` variables. See [references/styling.md](references/styling.md).
7. **Forms.** Grep submit paths that use `@lobehub/ui/form` (`getValues()`, `onSubmit`, `onValuesChange`). They receive the whole store, not only mounted fields; pick the fields you send explicitly. Do this even when type-check is clean — it is a silent behavior change.
8. **Verify.** Type-check and lint to zero errors. Re-run the codemod: it must rewrite nothing except merging `@lobehub/ui` imports you added, and every remaining item must be resolved or explained. Then run the app and check light and dark mode, one popup (Modal / DropdownMenu / Tooltip), one form submit, and one page per component family you changed.

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
