# @lobehub/ui-codemod

Codemods for upgrading [`@lobehub/ui`](https://ui.lobehub.com) across major versions.

## v6

```bash
npx --registry=https://registry.npmjs.org @lobehub/ui-codemod@latest v6 . --dry
```

| Option            | Description                                                               |
| ----------------- | ------------------------------------------------------------------------- |
| `paths...`        | Files or directories to migrate (default: `src`)                          |
| `--dry`           | Preserve source files and save a patch preview; reports are still written |
| `--report <file>` | Custom Markdown report path; JSON and dry-run patch use the same basename |
| `--json`          | Emit only JSON to stdout; reports are still saved                         |

Every run saves `report.md` and `report.json` in a fresh `.lobe-ui-codemod/v6-*/` directory; dry-runs also save `report.patch`. The terminal prints a short summary, the next action and absolute artifact paths. Review the patch, then rerun without `--dry` to apply the mechanical changes. Earlier reports are preserved. Custom `--report` paths refuse existing Markdown / JSON / patch files before changing source; choose a fresh path for each run.

## For coding agents

Start with the JSON report's `summary` and `nextAction`, then process `tasks`. Repeated instructions are grouped by rule, level, message and guide URL; stable task IDs survive line-number and file-order changes, and `locations` retains every finding. `kind: "manual-fix"` is a reported migration issue; `kind: "review"` needs inspection and is not proof of a bug. Use the Markdown checklist for review and the raw `items` only when more detail is needed.

```bash
# Replace the path with the JSON report path printed by the CLI.
jq '{schemaVersion, mode, status, scope, summary, nextAction}' path/to/report.json
jq '.tasks[] | {id, kind, message, occurrences: (.locations | length)}' path/to/report.json
# Read one task's complete locations when working on it.
jq '.tasks[] | select(.id == "TASK_ID_FROM_REPORT")' path/to/report.json
```

The JSON format has `schemaVersion: 1`, `codemodVersion`, `migration`, `mode` (`dry-run` / `write`), `scope`, `summary`, `artifacts`, `nextAction` and grouped `tasks`. Resolve finding paths against `scope.root`, even when reports are saved elsewhere. Existing `files`, `changed`, `items`, `errors` and `nextSteps` remain available. Locations refer to source **after transforms**, including during dry-run; use the patch when the original line differs. In dry-run `changed` describes proposed edits. Task IDs group the same instruction; they do not track completion or prove a fix survives reruns.

Exit code 0 means no parse errors; it does not mean the migration passed. `status` is `parse-errors` or `needs-verification`, and `nextSteps` always includes manual verification. Reports stay local; the CLI does not run checks or send data to a model.

## Coverage

Rewritten automatically:

- `@lobehub/ui/base-ui` → `@lobehub/ui`, `@lobehub/ui/base-ui/form` → `@lobehub/ui/form`
- `antd-style` helpers (`createStaticStyles`, `cssVar`, `cx`, `css`, `keyframes`, `injectGlobal`, `responsive`, `createGlobalStyle`, `useTheme`, `useThemeMode`, `useResponsive`, `extractStaticStyle`) → `@lobehub/ui`
- `Theme` / `ThemeAppearance` types → `LobeTheme` / `LobeAppearance`
- `Spline` (`@lobehub/ui/awesome`) and `LogoThree` / `LogoSpline` (`@lobehub/ui/brand`), plus deep `es/awesome/Spline` / `es/brand/LogoThree` paths → `@lobehub/ui/spline`
- duplicate `@lobehub/ui` imports merged

Reported with file, line and fix, linking the [migration guide](https://ui.lobehub.com/migration-v6):

| Rule | What                                                                                                                                      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| R1   | `ThemeProvider`                                                                                                                           |
| R2   | `StyleProvider`                                                                                                                           |
| R3   | `@lobehub/ui/static-css*`, `lobeCustomToken`, `lobeCustomStylish`                                                                         |
| R4   | exports removed in v6 with their replacement; removed subpaths in plain strings                                                           |
| R5   | changed components, specific Select / InputNumber / Tag / Drawer props and uninspected prop spreads                                       |
| R6   | `antd`, `@ant-design/*`, `rc-*` imports and leftover `antd-style` API                                                                     |
| R7   | `package.json` dependencies to bump or remove                                                                                             |
| R8   | `themeMode` / `setThemeMode` / `stylish` from the theme hooks                                                                             |
| R9   | `.ant-*` selectors and `--ant-*` variables in JS/TS strings and CSS / Less / Sass files, with verified slot / token hints where available |
| R10  | removed v5 `Video` props                                                                                                                  |
| R11  | removed `Table` / `ProTable` props and aliases                                                                                            |
| R12  | removed `DatePicker` / `DateRangePicker` aliases                                                                                          |
| R13  | whole-package `vi.mock` / `jest.mock` calls that may lose real exports such as `createStaticStyles` and `Text`                            |

Stylesheets are scanned without rewriting them. Known mappings name the replacement slot or token; unknown matches explicitly require a manual choice. Selectors in JS/TS strings are reported at the containing string's location. Dynamic selector construction, preprocessor expansion and other file types (such as Vue / Svelte / MDX) need a manual search. Only the selected paths are scanned; use `.` to include config and tests, and check ignored / generated sources separately if the app consumes them.

Every report includes **Next steps**, even with zero findings: test migration, light/dark × desktop/mobile verification, accessibility, the minimum fix version, and installation / cache checks. A clean static report is not a completed migration.

The codemod still only rewrites imports and type names. Component props, callbacks, CSS overrides and test mocks are reported for manual migration; callback semantics and app palettes cannot be inferred safely. Prop checks follow named root imports (including aliases); inspect wrapper components, default and namespace imports separately.

Run your formatter afterwards; merged imports are written on one line when short, one specifier per line otherwise. Then work through the report by hand, or give it to a coding agent with the `lobe-ui-v6-migration` skill (`npx skills add lobehub/lobe-ui`).
