# Styling: antd-style → @lobehub/ui

Guide sections: https://ui.lobehub.com/migration-v6#styling-api and #css-cascade

## Already handled by the codemod

Imports of `createStaticStyles`, `cssVar`, `cx`, `css`, `keyframes`, `injectGlobal`, `responsive`, `createGlobalStyle`, `useTheme`, `useThemeMode`, `useResponsive`, `extractStaticStyle` move from `antd-style` to `@lobehub/ui`; `Theme` → `LobeTheme`, `ThemeAppearance` → `LobeAppearance`. The API is the same, backed by lobe-ui's own emotion instance (cache key `acss`).

What changes at runtime: `cssVar.x` is `var(--lobe-x)` instead of `var(--ant-x)`. Values come from `theme.css`, so it must be imported.

## Left for you (R6, R8)

| Leftover                                 | Fix                                                                                                                                                                                                          |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `createStyles(({ css, token }) => …)`    | `createStaticStyles(({ css, cssVar }) => …)`; replace `token.x` with `cssVar.x`. Props-dependent styles become variants (`cx(styles.base, active && styles.active)`) or inline CSS variables set in `style`. |
| `createStylish`                          | export plain `css` fragments built on `cssVar`, compose with `cx`                                                                                                                                            |
| `useAntdToken()` / `theme.useToken()`    | `useTheme()` from `@lobehub/ui` (token values + `appearance` + `isDarkMode`)                                                                                                                                 |
| `const { stylish } = useTheme()`         | import the fragment you need, or use `lobeStaticStylish` from `@lobehub/ui`                                                                                                                                  |
| `useTheme().prefixCls`                   | delete; there are no antd class prefixes                                                                                                                                                                     |
| `const { themeMode } = useThemeMode()`   | keep the light/dark/auto choice in app state (or next-themes `theme`); `appearance` / `isDarkMode` are the resolved values                                                                                   |
| `setThemeMode(mode)`                     | `setLobeTheme({ appearance })` or next-themes `setTheme`                                                                                                                                                     |
| `createGlobalStyle`                      | unchanged; function interpolations still get `{ theme }`, now a `LobeTheme` (no `stylish` / `prefixCls`)                                                                                                     |
| namespace / default `antd-style` imports | switch to named imports from `@lobehub/ui`                                                                                                                                                                   |

`createStyles` call sites that read component props are the slowest part. Do them one file at a time and keep visual parity: compare the page before and after in both appearances.

## antd class names and variables (R9)

- `.ant-*` selectors in `css` templates, global CSS or `querySelector`: they match nothing. Use the component's `className` / `classNames` slots or a `data-*` attribute it documents. Inspect the v6 DOM before choosing.
- `var(--ant-*)` in CSS: use the matching `--lobe-*` variable (same token name in kebab case, e.g. `--ant-color-text` → `--lobe-color-text`) or `cssVar` in JS.
- `.ant-app` as a portal container: `document.getElementById(LOBE_THEME_APP_ID)`.

## CSS cascade

All lobe-ui CSS lives in `@layer lobe-base, lobe-popup, lobe-ui`. Consequences:

- App styles written with `createStaticStyles` or plain CSS are unlayered, so they win over component styles without `!important` or specificity hacks. Remove old `!important` overrides that only fought antd.
- Unlayered global resets in the app (`* { margin: 0 }`, `button { background: none }`, normalize.css, Tailwind preflight without layers) now override components. Put them in a layer declared before lobe-ui's, as the first CSS the app loads:

  ```css
  @layer reset, lobe-base, lobe-popup, lobe-ui;

  @layer reset {
    button {
      font: inherit;
    }
  }
  ```

  With Tailwind v4: `@layer theme, base, lobe-base, lobe-popup, lobe-ui, components, utilities;` before `@import 'tailwindcss'`.

- Symptoms that point here: buttons without background or padding, inputs without border, popups behind content, wrong font in components only.

## Writing new styles

```ts
import { createStaticStyles } from '@lobehub/ui';

export const styles = createStaticStyles(({ css, cssVar, responsive }) => ({
  root: css`
    border: 1px solid ${cssVar.colorBorderSecondary};
    border-radius: ${cssVar.borderRadiusLG};
    background: ${cssVar.colorBgContainer};

    ${responsive.sm} {
      padding-inline: 12px;
    }
  `,
}));
```

`//` is not a comment inside a `css` template; use `/* */`.
