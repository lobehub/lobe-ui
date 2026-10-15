# Theming: ThemeProvider → theme.css + attributes

Guide section: https://ui.lobehub.com/migration-v6#theming

## What replaces what

| v5                                             | v6                                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `<ThemeProvider>` wrapper                      | `import '@lobehub/ui/theme.css'` + `import '@lobehub/ui/style.css'` once at the root        |
| `enableGlobalStyle`                            | `import '@lobehub/ui/global.css'` (body font/background, scrollbars, antd reset)            |
| `appearance="dark"` / `themeMode`              | `data-theme="dark"` on `<html>` via `setLobeTheme` / `LobeThemeScript` / next-themes        |
| `customTheme={{ primaryColor, neutralColor }}` | `data-primary-color` / `data-neutral-color` (same values)                                   |
| nested `ThemeProvider` for a different theme   | `<ThemeScope appearance primaryColor neutralColor>`                                         |
| `customFonts`, `enableCustomFonts`             | same props on `ConfigProvider`                                                              |
| antd `App` (static `message` / `modal`)        | `toast` (render `ToastHost` once), `createModal` / `confirmModal` (render `ModalHost` once) |
| `customToken`, `customStylish`, `theme` (antd) | none; define app tokens in your own CSS with your own prefix                                |
| `StyleProvider` (antd cssinjs SSR cache)       | delete it, keep its children                                                                |
| `@lobehub/ui/static-css/vite` plugin + runtime | delete; `theme.css` is static already                                                       |

Primary colors: `blue cyan geekblue gold green lime magenta orange purple red volcano yellow`. Neutral colors: `mauve olive sage sand slate`.

`ConfigProvider` must still wrap the app (it owns `motion`, i18n resources, fonts and the popup portal host `#lobe-ui-theme-app`).

## Vite / CSR app

```tsx
import '@lobehub/ui/theme.css';
import '@lobehub/ui/style.css';
import '@lobehub/ui/global.css';

import { ConfigProvider, setLobeTheme, ToastHost } from '@lobehub/ui';
import { motion } from 'motion/react';
import { createRoot } from 'react-dom/client';

setLobeTheme({ appearance: readStoredAppearance(), primaryColor: 'blue' });

createRoot(document.getElementById('root')!).render(
  <ConfigProvider motion={motion}>
    <App />
    <ToastHost />
  </ConfigProvider>,
);
```

Theme switch handler: `setLobeTheme({ appearance: next })` and persist `next` yourself. For "follow system", resolve with `matchMedia('(prefers-color-scheme: dark)')` and listen for changes; `appearance` passed to lobe-ui is always `'light'` or `'dark'`.

To avoid a flash on reload in a CSR app, put the same logic in an inline script in `index.html` before the bundle, or render `<LobeThemeScript appearance="system" />` from the server shell.

## Next.js app router with next-themes

```tsx
// app/layout.tsx
import '@lobehub/ui/theme.css';
import '@lobehub/ui/style.css';
import '@lobehub/ui/global.css';

import { LobeThemeScript } from '@lobehub/ui';
import { ThemeProvider as NextThemes } from 'next-themes';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <LobeThemeScript primaryColor="blue" neutralColor="slate" />
      </head>
      <body>
        <NextThemes attribute="data-theme" defaultTheme="system" enableSystem>
          <Providers>{children}</Providers>
        </NextThemes>
      </body>
    </html>
  );
}
```

```tsx
// app/providers.tsx
'use client';

import { ConfigProvider } from '@lobehub/ui';
import { motion } from 'motion/react';

export const Providers = ({ children }) => (
  <ConfigProvider motion={motion}>{children}</ConfigProvider>
);
```

next-themes owns `data-theme`; `LobeThemeScript` without `appearance` only fills in a default `light` when nothing set it, plus the colors. Read the theme with `useTheme()` from `next-themes` for the toggle UI; lobe-ui's `useThemeMode()` follows the attribute automatically.

Remove from the old setup: `StyleProvider` / `extractStaticStyle` antd wiring in `_document` or the registry, `antd` `ConfigProvider` and `App`, and any `transpilePackages` entry for `antd`.

## SSR shells and static HTML

Pages rendered outside React (auth shells, share pages) only need the stylesheets and the attributes:

```html
<html data-theme="dark" data-primary-color="blue">
  <head>
    <link rel="stylesheet" href="/assets/lobe-ui/theme.css" />
    <link rel="stylesheet" href="/assets/lobe-ui/style.css" />
  </head>
</html>
```

If the shell used `extractStaticStyle` for app styles written with `createStaticStyles`, keep it: it is exported from `@lobehub/ui` and returns `{ css, ids, key, tag }[]`. Inject `tag` (an HTML string) into the document head; code that rendered antd-style's `item.style` React element must switch to `tag` or build `<style data-emotion={`${key} ${ids.join(' ')}`}>` from `css`. Its antd options (`antdCache`, `includeAntd`) are ignored now; remove them.

## Islands with another theme

```tsx
<ThemeScope appearance="dark">
  <CodePreview />
</ThemeScope>
```

`ThemeScope` renders a `div` with the attributes; `useTheme()` / `useThemeMode()` inside it read the scope. Do not set `data-theme` on arbitrary elements by hand when hooks inside need the value — use `ThemeScope`.

## Popup containers

antd code often passed `getPopupContainer={() => document.querySelector('.ant-app')}` or portaled into `.ant-app`. The host is now `document.getElementById(LOBE_THEME_APP_ID)` (`LOBE_THEME_APP_ID` is exported from `@lobehub/ui`). Most lobe-ui popups find it themselves; only custom portals need the change.

## Reading tokens in code

- Styles: `cssVar.colorText` etc. inside `createStaticStyles` — no runtime branch for dark mode.
- Concrete values (canvas, charts, color math): `const theme = useTheme()` from `@lobehub/ui`; it has the token values plus `appearance` and `isDarkMode`.
- `theme.useToken()` from antd → `useTheme()`; `token.xxx` keeps the same key names (`controlOutline` is gone).
