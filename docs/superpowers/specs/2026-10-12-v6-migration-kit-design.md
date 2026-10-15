# v6 migration kit: guide, codemod, AI skill

Date: 2026-10-12
Branch: `feat/v6-migration` (from `v6`, lands in #706 before 6.0.0 stable)

## Goal

Downstream apps move from `@lobehub/ui` 5.x to 6.x with three tools, used in this order:

1. **`@lobehub/ui-codemod`** rewrites what is mechanical and reports everything else with file, line and fix.
2. **`docs/migration-v6.mdx`** explains every breaking change for humans.
3. **`lobe-ui-v6-migration` skill** lets a coding agent work through the codemod report to a clean type-check.

Success: running the three on a fresh `origin/canary` checkout of lobe-chat (not the already-migrated `lobe-chat-next` worktree) leaves no `antd-style` or `@lobehub/ui/base-ui` import, and the report lists every remaining break that the trial in #20503 had to fix by hand.

## 1. `@lobehub/ui-codemod` (`packages/codemod`)

### Package

- Name `@lobehub/ui-codemod` (free on npm), `type: module`, Node >= 22, `bin: { "lobe-ui-codemod": "dist/cli.mjs" }`, `files: ["dist"]`.
- Source in TS under `packages/codemod/src`, built by tsdown to `dist/` in `prepack`.
- Runtime deps: `@babel/parser` (plugins `typescript`, `jsx`), `magic-string`, `tinyglobby`. No `@babel/traverse`: the transforms only visit top-level `ImportDeclaration` / `ExportNamedDeclaration` / `ExportAllDeclaration` and `Identifier` references of imported bindings, which a small walker covers.

### CLI

```
npx @lobehub/ui-codemod v6 [paths...] [--dry] [--report <file>] [--json]
```

- `v6` is the transform set; future majors add sets.
- `paths` default `src`. Globs `**/*.{ts,tsx,js,jsx,mts,cts,mjs,cjs}`; ignores `node_modules`, `dist`, `es`, `build`, `.next`, `.git`.
- `--dry` prints a unified diff per file instead of writing.
- Report goes to stdout (grouped by rule, then file:line); `--report` also writes it as Markdown; `--json` prints machine-readable output for the skill.
- Exit code 0 even with report items; 1 only on parse failure (the file is listed and skipped, the run continues).
- Also reads the nearest `package.json` from cwd for dependency checks (§ report rules R7–R8).

### Auto transforms

Each is one module `src/transforms/v6/<name>.ts` exporting `(file: SourceFile) => void`, applied in this order:

| ID  | Transform | Example |
| --- | --- | --- |
| T1 | `base-ui-subpath`: `@lobehub/ui/base-ui` → `@lobehub/ui`; `@lobehub/ui/base-ui/form` → `@lobehub/ui/form` (imports, re-exports, dynamic `import()`, `vi.mock` / `jest.mock` string args) | same mapping as `src/eslint/noBaseUiSubpath.ts` |
| T2 | `antd-style`: named imports in the supported set move to `@lobehub/ui`: `createStaticStyles`, `cssVar`, `cx`, `css`, `keyframes`, `injectGlobal`, `responsive`, `createGlobalStyle`, `useTheme`, `useThemeMode`, `useResponsive`, `extractStaticStyle` | `import { cx, useTheme } from 'antd-style'` → `from '@lobehub/ui'` |
| T3 | `theme-type`: `Theme` imported from `antd-style` becomes `LobeTheme` from `@lobehub/ui`, references renamed | `(t: Theme)` → `(t: LobeTheme)` |
| T4 | `merge-imports`: after T1–T3, merge value imports from the same source into one declaration, and type-only imports into one `import type`; keep the first declaration's position | two `from '@lobehub/ui'` lines → one |

Rules that keep the output safe:

- Names T2 does not support (`StyleProvider`, `ThemeProvider`, `createStyles`, `createInstance`, `setupStyled`, …) stay in an `antd-style` import and produce a report item; a declaration is removed only when empty.
- Aliases (`import { cx as clsx }`) and `import type` are preserved.
- Namespace or default imports of `antd-style` are never rewritten; they produce a report item.
- A transform that would introduce a binding name that already exists in the file skips that specifier and reports it.
- Formatting outside the edited ranges is untouched (magic-string); the user's formatter runs afterwards.

### Report rules

Each item: rule ID, file:line:col, the matched code, one-line fix, docs anchor (`https://ui.lobehub.com/migration-v6#<anchor>`).

| ID  | Matches | Fix text |
| --- | --- | --- |
| R1 | `ThemeProvider` imported from `@lobehub/ui` or `antd-style` | import `@lobehub/ui/theme.css` (+ `global.css`, `style.css`), drive `data-theme` via `setLobeTheme` / `LobeThemeScript`, `ThemeScope` for islands; fonts and portal host move to `ConfigProvider` |
| R2 | `StyleProvider` (antd-style / `@ant-design/cssinjs`) | delete; it only carried the antd SSR cache |
| R3 | `@lobehub/ui/static-css*` imports; `lobeCustomToken`, `lobeCustomStylish`, `lobeStaticStylish`, `createLobeAntdTheme` | `theme.css` replaces static-css; stylish helpers become plain `css` on `cssVar` |
| R4 | Names imported from `@lobehub/ui` (any subpath) that v6 no longer exports | from the removed-export table (below): replacement or "removed, no successor" |
| R5 | Names from `@lobehub/ui` whose implementation changed in v6 (antd wrapper → base-ui) | info level: "props changed, see component page `#migrating-from-antd-*`" |
| R6 | Any `antd`, `antd/*`, `@ant-design/*`, `rc-*`, `@rc-component/*` import | per-name hint from the antd map (below); otherwise "remove antd: find the @lobehub/ui equivalent" |
| R7 | `package.json`: `motion` range below 13; `antd`, `antd-style`, `@ant-design/*` still listed; `@lobehub/icons` < 6, `@lobehub/fluent-emoji` < 5 | bump / remove |
| R8 | `useThemeMode()` results destructuring `themeMode` or `setThemeMode`; `useTheme()` reading `stylish` / `prefixCls` | use `setLobeTheme` / next-themes; drop |
| R9 | String literals containing `.ant-` or `--ant-` (selectors, `getPopupContainer` lookups, CSS vars) | `.ant-app` → `#LOBE_THEME_APP_ID`; `--ant-*` → `cssVar` / `--lobe-*` |

### Data tables (`src/transforms/v6/data/`)

- `removed-exports.json`: names exported by `@lobehub/ui@5.57.3` (all subpaths) and missing from v6, with replacement. Generated once by `scripts/diffExports.ts` (in the codemod package) from the two published `es/**/*.d.mts`, then hand-annotated with replacements (`Footer`/`Toc`/`ThemeSwitch`/`SliderWithInput` → none; `Dropdown` → `DropdownMenu`; `Collapse` → `Accordion` / `Collapsible`; `InputOPT` → `InputOTP`; `ModalProps` → `ModalRootProps` etc.). Checked in; a vitest test fails if v6 starts exporting a listed name again.
- `changed-components.json`: names exported by both majors whose v5 source was an antd wrapper (Button, Select, Modal, Tabs, Tag, Input family, Avatar, Alert, …). Derived from the #699 deletion list.
- `antd-map.json`: antd export → `@lobehub/ui` replacement and anchor. Seeded from `.agents/skills/lobe-design/references/components.md` C-01/C-05 (Card → Block, Typography → Text, message/notification → toast, Menu → Menu/ConsoleNav, Collapse → Accordion, Dropdown → DropdownMenu, pro-components → Table, …).

### Tests

- `packages/codemod/src/**/*.test.ts`, vitest (the root config has no include filter, so `pnpm vitest run packages/codemod` works).
- Fixture pairs `__fixtures__/<transform>/<case>.input.tsx` / `.output.tsx` per transform, including aliases, type imports, mixed supported/unsupported specifiers, name collisions, dynamic import, `vi.mock`.
- Report snapshots for R1–R9 on one fixture project.
- An idempotency test: running v6 twice equals running it once.

### Release

- Scope `codemod`, tag `codemod@${version}`, `packages/codemod/release.config.mjs` = `createReleaseConfig({ scopes: ['codemod'], tagFormat: 'codemod@${version}' })`.
- Root `release.config.mjs` adds `codemod` to `exclude`.
- `.github/workflows/release-codemod.yml` copies `release-docs-kit.yml` (build + `npm pack --dry-run` + semantic-release in `packages/codemod`); `release.yml` calls it after `docs-kit`.
- First version: `package.json` `version: 0.0.0`, first `✨ feat(codemod): ...` commit publishes 1.0.0 on master; on the `beta` branch it publishes `1.0.0-beta.1`, which is what the guide and skill tell beta users to run (`npx @lobehub/ui-codemod@beta v6`).

## 2. Migration guide (`docs/migration-v6.mdx`)

Standalone docs page (front matter `title: Migrating to v6`, `order: 1`; the index page is `order: 0`), English like the rest of the site. Each section has a stable heading id used by the codemod anchors.

1. **Before you start**: what changed in one paragraph (no antd, StyleX-compiled styles, attribute theming, one component set); requirements (React 19, motion 13, icons 6 / fluent-emoji 5 betas).
2. **Upgrade steps**: bump deps and remove `antd` / `antd-style`; `npx @lobehub/ui-codemod v6 src`; work through the report (or hand it to the agent with the skill); type-check, lint, smoke test.
3. **Theming** (`#theming`): before/after for a Vite SPA and a Next.js app; CSS entry points (`theme.css` required, `global.css` opt-in resets, `style.css` component styles); `setLobeTheme`, `LobeThemeScript`, `ThemeScope`; `ConfigProvider` props that came from ThemeProvider (`customFonts`, `enableCustomFonts`, portal host, `direction`); props that are gone (`customTheme`, `customToken`, `customStylish`, `theme`, `appearance`, `themeMode`).
4. **Styling API** (`#styling`): antd-style → `@lobehub/ui` compat table (from the drop-antd spec §3), `cssVar` now `var(--lobe-*)`, `Theme` → `LobeTheme`, `createGlobalStyle` restriction, `extractStaticStyle` without antd, `StyleProvider` removed.
5. **CSS cascade** (`#cascade`): layer order `lobe-base, lobe-popup, lobe-ui`; unlayered app styles and resets now beat components; Tailwind placement (link to the existing index section); customize via `className` / `classNames` / `styles` / `data-*`, never generated class names.
6. **Components** (`#components`): table of v5 name → v6 name → link to that page's "Migrating from antd …" section; removed components with no successor; antd-only components and their replacements (same data as `antd-map.json`).
7. **Subpaths and removed APIs** (`#removed`): `base-ui`, `base-ui/form` → `form`; `static-css*`; `lobeCustomToken` & co.; `controlOutline` token; `generateColorPalette` return types; antd type re-exports replaced by React types.
8. **Behavior changes** (`#behavior`): Form `getValues` / `onSubmit` return the whole store; `DropdownItem` union and `onClick` typing (annotate `MenuInfo`); `.ant-app` portal lookups → `#LOBE_THEME_APP_ID`; antd `reset.css` now in `global.css`.
9. **Known issues in the beta** (`#known-issues`): `@lobehub/icons` / `@lobehub/fluent-emoji` peers (until beta.2); docs-kit still on v5.

### Stale content fixed in the same PR

- `docs/index.mdx`, `README.md`: remove "based on Ant Design / antd-style recommended" and the "remaining components still inject runtime styles" caveat (#705 finished StyleX); link the guide.
- `AGENTS.md`: peer deps line, component anatomy (`style.ts` antd-style → StyleX), "`base-ui/` components…" paragraph, styling section.
- `.agents/skills/lobe-design/references/components.md`: drop the root-vs-`base-ui` split, the `static-css` row, "下个大版本删除" notes that already happened; keep the antd ban lists (still true via the eslint preset).
- Per-component "Migrating from …" sections: replace `@lobehub/ui/base-ui` imports and "the root X" wording; `src/Burger/index.mdx` "Migrating from the root Burger" becomes "from v5 Burger".

## 3. AI skill (`.agents/skills/lobe-ui-v6-migration/`)

English (downstream users are not all Chinese readers). Picked up by `npx skills add lobehub/lobe-ui` and `/skills.md` with no extra wiring; add a `.claude/skills` symlink like the other repo skills.

- `SKILL.md` (< 200 lines): trigger description (upgrade / migrate @lobehub/ui to v6, remove antd / antd-style, ThemeProvider removed errors); workflow:
  1. Inventory: read `package.json`, find app entry points and SSR shells.
  2. Bump deps, remove antd / antd-style, install.
  3. `npx @lobehub/ui-codemod@beta v6 <src dirs> --json > migration-report.json`.
  4. Theming refactor per `references/theming.md` (R1–R3).
  5. Work through R4–R6, R8–R9 per `references/components.md` / `references/styling.md`, one rule at a time, type-check after each.
  6. Grep form submit paths for whole-store leaks.
  7. Type-check and lint to zero; re-run the codemod to confirm an empty auto-transform diff.
  8. Smoke-check light/dark and one page per changed component in the browser.
  Rules: never re-add antd to silence errors; never target generated class names; keep the app's own layout CSS unlayered-aware.
- `references/theming.md`: concrete before/after for Vite SPA, Next.js app router (with next-themes), SSR shells; portal host; fonts.
- `references/components.md`: per-component prop mapping for the R5 set (Button `type` → `variant`, Modal, Select options, Tabs items, Dropdown `menu.items` → `items`, Input family, Tag, Avatar, Alert, Segmented, Collapse → Accordion, Drawer, Form antd → `@lobehub/ui/form`), each linking the component page; lobe-chat trial pitfalls.
- `references/styling.md`: antd-style compat table, StyleProvider/SSR, `createGlobalStyle`, cascade and resets, `--ant-*` → `--lobe-*`.

## Verification

1. `pnpm vitest run packages/codemod` green; eslint/type-check on changed files.
2. `npm pack --dry-run ./packages/codemod` contains only `dist/`, `package.json`, `README.md`.
3. Dogfood: run the built CLI on a fresh `origin/canary` checkout of lobe-chat (`--dry` first, then write), then compare the report against the manual fix list from #20503 (`lobe-ui-next-downstream` notes). Every break that trial fixed by hand appears either as an auto transform or a report item, or is listed as a gap in the PR.
4. Docs: `pnpm dev`, open `/migration-v6` (title check), click every component anchor link; `/skills.md` includes the new skill.
5. `git grep -nE "base-ui['\"/]|antd-style|ThemeProvider" -- docs/*.mdx README.md AGENTS.md src/**/index.mdx .agents/skills` returns only intentional migration mentions.

## Out of scope

- Codemod transforms for component props (too varied; the skill handles them).
- Raising `@lobehub/icons` / `@lobehub/fluent-emoji` peers (beta.2).
- Bumping docs-kit's `@lobehub/ui` dependency.
- Rewriting downstream repos (they run the kit).
