# @lobehub/ui-codemod

Codemods for upgrading [`@lobehub/ui`](https://ui.lobehub.com) across major versions.

## v6

```bash
npx @lobehub/ui-codemod@beta v6 .
```

| Option            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `paths...`        | Files or directories to migrate (default: `src`) |
| `--dry`           | Print a diff instead of writing files            |
| `--report <file>` | Also write the report as a Markdown checklist    |
| `--json`          | Print the result as JSON (for coding agents)     |

Rewritten automatically:

- `@lobehub/ui/base-ui` → `@lobehub/ui`, `@lobehub/ui/base-ui/form` → `@lobehub/ui/form`
- `antd-style` helpers (`createStaticStyles`, `cssVar`, `cx`, `css`, `keyframes`, `injectGlobal`, `responsive`, `createGlobalStyle`, `useTheme`, `useThemeMode`, `useResponsive`, `extractStaticStyle`) → `@lobehub/ui`
- `Theme` / `ThemeAppearance` types → `LobeTheme` / `LobeAppearance`
- duplicate `@lobehub/ui` imports merged

Reported with file, line and fix, linking the [migration guide](https://ui.lobehub.com/migration-v6):

| Rule | What                                                                            |
| ---- | ------------------------------------------------------------------------------- |
| R1   | `ThemeProvider`                                                                 |
| R2   | `StyleProvider`                                                                 |
| R3   | `@lobehub/ui/static-css*`, `lobeCustomToken`, `lobeCustomStylish`               |
| R4   | exports removed in v6 with their replacement; removed subpaths in plain strings |
| R5   | components whose implementation changed from antd to base-ui (info)             |
| R6   | `antd`, `@ant-design/*`, `rc-*` imports and leftover `antd-style` API           |
| R7   | `package.json` dependencies to bump or remove                                   |
| R8   | `themeMode` / `setThemeMode` / `stylish` from the theme hooks                   |
| R9   | `.ant-*` selectors and `--ant-*` variables in strings                           |

Run your formatter afterwards; merged imports are written on one line when short, one specifier per line otherwise. Then work through the report by hand, or give it to a coding agent with the `lobe-ui-v6-migration` skill (`npx skills add lobehub/lobe-ui`).
