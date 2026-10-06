# Drop antd from @lobehub/ui (next major)

Date: 2026-10-07
Stacks on: #695 (`feat/lobe-token-engine`) → #683 (`feat/motion-13`) → #682

## Goal

The next major of `@lobehub/ui` ships with zero antd: no antd components, no antd `App` / `ConfigProvider`, no `antd-style`, no `@ant-design/*`, no `rc-*`. The `base-ui` component set becomes the root export. `ThemeProvider` is removed; theming is static CSS variables switched by `<html data-*>` attributes.

Downstream status (2026-10-07): lobe-editor / lobe-tts / lobe-icons / lobe-charts no longer import antd components (PRs lobe-editor#227, lobe-tts#68, lobe-icons#429, lobe-charts#33). Business apps only use antd `ConfigProvider` / `App`, which they drop when adopting this major.

## Why antd-style must go too

- `antd-style`'s `ThemeProvider` always renders antd `ConfigProvider` (`createThemeProvider/AntdProvider.js`).
- `antd-style`'s `createStaticStyles` module imports antd at runtime (`createStaticStyles/cssVar.js` calls `theme.getDesignToken()` to enumerate keys).
- Its `cssVar` map resolves to `var(--ant-*)`, which today only exist because antd `ConfigProvider` writes them.

lobe-ui usage (non-test, non-demo files importing from `antd-style`): `createStaticStyles` 177, `cx` 255, `cssVar` 45 (plus callback `cssVar` inside `createStaticStyles`), `useThemeMode` 35, `useResponsive` 20, `keyframes` 16, `responsive` 8, `useTheme` 7, `css` 6, `createGlobalStyle` 2, `StyleProvider` 1, `createStyles` 0.

## 1. Export structure

- Root `@lobehub/ui` = everything in `src/base-ui/index.ts` + existing non-antd root components (Flexbox, Icon, Markdown, Highlighter, Empty, Image, …). Name collisions (`Button`, `Select`, `Tag`, `Accordion`, `Text`, `Skeleton*`, …) resolve to the base-ui implementation.
- `@lobehub/ui/base-ui` stays one major as a re-export alias of the root; the lobe-ui eslint preset warns "import from `@lobehub/ui`".
- Deleted:
  - antd wrappers: Alert, AutoComplete, Avatar, Burger, Button, Collapse, DatePicker, Drawer, Dropdown, Input (Input / InputNumber / InputOPT / InputPassword / TextArea), Modal + ModalHost, Segmented, Select, Tabs, Tag, Form + FormModal (antd), Menu;
  - no base-ui equivalent yet, deleted now (rewrites are separate follow-ups): Footer, Toc, ThemeSwitch, SliderWithInput;
  - `ThemeProvider` (incl. `GlobalStyle` / `EssentialStyle` components, `AppElementContext` moves — see §2);
  - static-css antd parts: `buildAntdStaticCss`, `registry`, `scan`, `baseline`, `runtime`, antd parts of `emit` / `vite`; exports `./static-css/runtime`; `createLobeAntdTheme` / `antdTheme.ts`;
  - docs-kit: `site/app/antdStaticCss.server.tsx`, `app/routes/antd-css.ts`, the hook in `entry.server.tsx`, antd usage in `providers/themeTokens.ts`.
- Before deleting `src/Menu`: move `baseItem`, `renderUtils`, `type`, `checkboxItem`, `switchItem` into `src/base-ui/` (used by base-ui DropdownMenu / ContextMenu), with antd `MenuProps` / `MenuRef` types replaced by local types. Export the menu item types (`MenuItemType`, `MenuInfo` equivalents) from the root — lobe-editor needs them.
- Type-only antd references switch to base-ui / local types: `ImageProps` (brand/Logo3d, GuideCard, Img), `SelectProps` (ImageSelect), `InputRef` / `InputProps` (HotkeyInput), `AnchorProps` (Markdown).
- `DraggablePanel` reads `direction` from lobe-ui `ConfigProvider` (new `direction` prop) instead of antd `ConfigContext`.
- `src/eslint`: the old "deprecated wrapper" lists are replaced by bans on `antd`, `antd-style`, `@ant-design/*`, `rc-*`, and a warning for `@lobehub/ui/base-ui`.

## 2. Theme without a Provider

### theme.css

`@lobehub/ui/theme.css`, generated at lobe-ui build time from `createLobeTokenGroups`:

```css
:root {
  /* static + palette + primary + neutral, light */
}
[data-theme='dark'] {
  /* palette + primary + neutral, dark */
}
[data-primary-color='blue'] {
  /* primary group, light */
}
[data-theme='dark'][data-primary-color='blue'] {
  /* primary group, dark */
}
/* … 12 primaries × 2, 5 neutrals × 2 (neutral group only) */
@layer lobe-ui {
  /* essential + global styles (today's EssentialStyle / GlobalStyle), as plain CSS on var(--lobe-*) */
}
```

- Selectors target any ancestor (`[data-theme='dark'] …` works on `<html>` or a subtree), so nested islands with a different theme stay possible.
- Number tokens get `px` except a unitless set (`lineHeight*`, `fontWeightStrong`, `opacity*`, `zIndex*`, `motionBase`/`motionUnit` excluded) — same rule as today's `static-css/themeVars.ts`.
- Kebab names: `toKebabCase` from `static-css/themeVars.ts` (identical to antd-style's), prefix `--lobe-`.
- Consumers `import '@lobehub/ui/theme.css'` once.
- Global / essential rules live in `@layer lobe-ui` so unlayered consumer styles always win; variable declarations stay unlayered (layering does not affect custom property inheritance).

### Runtime API

- `setLobeTheme({ appearance?, primaryColor?, neutralColor? }, root = document.documentElement)` writes / removes the `data-*` attributes.
- `<LobeThemeScript appearance? primaryColor? neutralColor? storageKey? />` renders an inline `<script>` that sets attributes before first paint (no flash). Works with `next-themes` (which already owns `data-theme`; then only primary / neutral are set).
- `useThemeMode()` → `{ appearance: 'light' | 'dark', isDarkMode }`, read from the nearest `[data-theme]` / `<html>` via `useSyncExternalStore` + one shared `MutationObserver`; SSR snapshot = `'light'`.
- `useTheme()` → `createLobeToken({ appearance, primaryColor, neutralColor })` plus `{ appearance, isDarkMode }`, from the current attributes, memoized per combination. For code that needs concrete values (canvas, color mixing); styling uses `cssVar`.
- `useResponsive()` → lobe-ui implementation on `matchMedia` with the `screen*` breakpoints from the static token group; same return shape as antd-style's.

### ConfigProvider (lobe-ui's own, `src/ConfigProvider`)

Takes over from ThemeProvider:

- web font loading (`FontLoader`, `customFonts`, `enableCustomFonts`);
- the base-ui portal host (`AppElementContext` + `data-lobe-portal-host` element);
- `direction` (for DraggablePanel and future RTL).

`customTheme`, `customStylish`, `customToken`, `theme`, `appearance`, `themeMode` props disappear with ThemeProvider. `lobeCustomStylish` / `lobeStaticStylish` stylish helpers are re-expressed as plain `css` fragments on `cssVar`.

## 3. Styling layer: antd-style compatible API owned by lobe-ui

lobe-ui implements the antd-style core API that lobe-ui **and downstream** use, so downstream drops `antd-style` by rewriting `from 'antd-style'` → `from '@lobehub/ui'` (later, per repo; antd-style is deprecated downstream, not removed for them by this project).

Downstream usage that defines the surface (import counts, lobe-chat + lobehub-cloud + editor + charts + icons + tts, 2026-10-07): `createStaticStyles` ~2.8k, `cssVar` ~1.9k, `cx` ~1.1k, `useTheme` ~135, `useResponsive` ~70, `responsive` ~70, `keyframes` ~36, `css` ~50, `createGlobalStyle` ~12, `useThemeMode` ~17, `StyleProvider` 13, `extractStaticStyle` 7, `ThemeProvider` / `Theme` type a handful. `createStaticStyles` callbacks destructure only `css`, `cssVar`, `cx`, `responsive`. `useTheme()` consumers read token values plus `isDarkMode` (74) and `appearance`.

| API (exported from `@lobehub/ui`)        | Implementation                                                                                           | Compat notes                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `createStaticStyles((utils) => styles)`  | `@emotion/css`; `utils = { css, cx, cssVar, responsive }`                                                | same signature / return shape (record of class names)                     |
| `cssVar`                                 | `Record<keyof LobeToken, string>` → `var(--lobe-<kebab>)`                                                | was `var(--ant-*)`; values now come from `theme.css`                      |
| `cx`, `css`, `keyframes`, `injectGlobal` | re-exports from `@emotion/css`                                                                           | identical                                                                 |
| `responsive`                             | `{ xs, sm, md, lg, xl, xxl, mobile, tablet, laptop, desktop }` media-query strings from `screen*` tokens | `mobile=xs`, `tablet=md`, `laptop=lg`, `desktop=xxl` as in antd-style     |
| `useResponsive()`                        | `matchMedia` + `useSyncExternalStore`                                                                    | same boolean map keys                                                     |
| `useTheme()`                             | `LobeToken & { appearance, isDarkMode }` from current `data-*` attributes                                | no `stylish` / `prefixCls` (unused downstream)                            |
| `useThemeMode()`                         | `{ appearance, isDarkMode }`                                                                             | `themeMode` / `setThemeMode` dropped: use `setLobeTheme` or next-themes   |
| `createGlobalStyle`                      | returns a component that `injectGlobal`s once                                                            | template may only reference `cssVar`, not theme props                     |
| `extractStaticStyle(html?)`              | returns `<style>` tags for the emotion cache's inserted rules                                            | antd part (`antdCache`, `includeAntd`) dropped                            |
| `StyleProvider`                          | not provided                                                                                             | only existed to pass the antd cssinjs cache for SSR; delete at call sites |
| `Theme` type                             | `LobeTheme = ReturnType<typeof useTheme>`                                                                | rename                                                                    |

- Emotion cache key stays `acss`.
- `lobeCustomStylish` / `lobeStaticStylish` become plain `css` fragments on `cssVar`.
- Codemod (one-off script, not committed) rewrites `src/**` from `antd-style` to `@/styles` (demos: `@lobehub/ui`); the same script is handed to downstream repos. `packages/docs-kit` is published separately against a released `@lobehub/ui`, so it switches in PR-3 together with its ThemeProvider removal.
- Tests that `vi.mock('antd-style')` to stub `createStaticStyles` now mock `@/styles/css`.

## 4. Delivery: 4 stacked PRs on #695

| PR               | Content                                                                                                                                                                                                                                                                                                   | Green on its own because                                                                        |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| PR-1 styles core | §3 API (except the hooks, which land in PR-2) + `cssVar` (`--lobe-*`); codemod all internal imports off antd-style; runtime injection of `--lobe-*` vars from ThemeProvider (temporary)                                                                                                                   | ThemeProvider + antd still present; old antd components keep `--ant-*` from antd ConfigProvider |
| PR-2 theme       | `theme.css` build + export, `setLobeTheme`, `LobeThemeScript`, new `useThemeMode` / `useTheme` / `useResponsive`, ConfigProvider takes fonts / portal host / direction; codemod hooks; docs-kit switches to attributes + `theme.css`                                                                      | ThemeProvider still exists but is no longer needed by lobe-ui components                        |
| PR-3 deletion    | delete ThemeProvider, all antd components, Menu (after moving shared modules), Footer / Toc / ThemeSwitch / SliderWithInput, static-css antd parts, docs-kit antd parts; merge base-ui into root; `base-ui` subpath alias; type-only refs; DraggablePanel direction; drop temporary runtime var injection | —                                                                                               |
| PR-4 deps        | remove `antd`, `antd-style`, `@ant-design/*`, `rc-*` from package.json; eslint bans; docs migration guide                                                                                                                                                                                                 | —                                                                                               |

PR-1 backs `css` / `cx` / `keyframes` / `injectGlobal` with antd-style's own emotion instance (key `acss`) so existing SSR extraction (`extractStaticStyle`) keeps seeing lobe-ui styles; PR-4 swaps the backing to a lobe-ui `@emotion/css` instance with the same key and ships lobe-ui's `extractStaticStyle`. Two live instances with the same key are never present.

Estimate: PR-1 0.5–1 day, PR-2 1 day, PR-3 1.5–2 days, PR-4 0.5 day.

## 5. Verification

- Token ↔ CSS: test that every variable in generated `theme.css` (each selector block) equals `createLobeToken` for that combination, with the px / unitless rule.
- Visual: local-testing screenshots of every root component demo on the docs site, light + dark, before (current #695) vs after each PR; every diff explained or fixed.
- No antd: `rg "from ['\"](antd|antd-style|@ant-design|rc-)"` over `src`, `packages/docs-kit` = 0; built `es/` has no such import; `pnpm why antd` shows nothing from dependencies.
- API compat: type-check lobe-chat and lobehub-cloud with `antd-style` aliased to the new `@lobehub/ui` styles exports (tsconfig `paths`); every error is either fixed in lobe-ui or listed in the migration guide.
- Cascade / override surface: list unlayered global resets in lobe-chat and lobehub-cloud; check every root component exposes `className`, `style`, `classNames`, `styles`.
- Downstream: beta build → lobe-chat via local tarball override (existing workflow) → type-check + smoke run, producing the migration checklist for the guide.

## 6. StyleX coexistence (constraints for the later migration)

lobe-ui components will later move to StyleX (compiled at lobe-ui build time into a shipped stylesheet); downstream keeps the emotion-backed API from §3. Constraints this design locks in now:

1. **Shared variables**: StyleX `defineVars` with `--`-prefixed keys reuses the exact `--lobe-*` names; token groups map to `defineVars` + `createTheme` (see #695 spec, "StyleX readiness").
2. **Cascade**: all lobe-ui-authored CSS (theme.css globals now, StyleX output later) sits in `@layer lobe-ui`; downstream emotion styles are unlayered and therefore win regardless of insertion order. Downstream unlayered global resets (`* { margin: 0 }`, `button { … }`) would also win, so they must move into a layer; checked during the beta.
3. **Override surface**: downstream customizes lobe-ui components only via `className`, `style`, and `classNames` / `styles` slot props, plus stable `data-*` attributes on key inner elements — never by targeting generated class names. PR-3 audits root components for these props.
4. The emotion layer in §3 is permanent for downstream; inside lobe-ui it is an interim step replaced per component by StyleX.

## Out of scope

- base-ui rewrites of Footer, Toc, ThemeSwitch, SliderWithInput (follow-ups after PR-3).
- StyleX migration (token groups and `--lobe-*` names are already shaped for it).
- Migrating lobe-chat / lobehub-cloud to the new major (separate stacked PRs after the beta).
- Rewriting downstream repos from `antd-style` to `@lobehub/ui` (per-repo PRs using the codemod, after the beta).
