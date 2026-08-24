# @lobehub/ui/static-css

Build-time extraction of antd component styles and LobeHub theme token palettes into cacheable static stylesheets, so SSR HTML no longer carries them inline on every page.

Requires antd v6 cssVar mode: extracted style rules are theme-agnostic `var(--ant-*)` references. The probe theme and the runtime `ConfigProvider` theme must be the same object shape — the token hash decides whether SSR style keys match the extracted ones.

## Entries

| Entry                            | Runs at                | Purpose                                                                              |
| -------------------------------- | ---------------------- | ------------------------------------------------------------------------------------ |
| `@lobehub/ui/static-css`         | build time (Node only) | `buildAntdStaticCss`, `buildThemeVarsCss`, probe registry, usage scanner             |
| `@lobehub/ui/static-css/runtime` | SSR server             | `buildInlineAntdStyle` — swaps antd-style's inline antd entry                        |
| `@lobehub/ui/static-css/vite`    | vite config            | virtual modules `virtual:lobehub/antd-static-css` + `virtual:lobehub/theme-vars-css` |
| `@lobehub/ui/static-css/emit`    | dedicated build script | writes `antd.css` / `theme-vars.css` / manifest under production semantics           |

## Vite

```ts
import { lobeStaticCssPlugin } from '@lobehub/ui/static-css/vite';

export default defineConfig({
  plugins: [lobeStaticCssPlugin()],
});
```

```ts
import { css, href, styleKeys } from 'virtual:lobehub/antd-static-css';
```

Ambient types for the virtual modules:

```ts
declare module 'virtual:lobehub/antd-static-css' {
  export const css: string;
  export const href: string;
  export const styleKeys: string[];
}

declare module 'virtual:lobehub/theme-vars-css' {
  export const css: string;
  export const href: string;
}
```

Serve `css` from a route at `href`'s pathname, link it render-blocking, and cache it immutable — the href embeds a content hash.

## SSR

```ts
import { extractStaticStyle } from 'antd-style';
import { buildInlineAntdStyle } from '@lobehub/ui/static-css/runtime';

const { html, uncovered } = buildInlineAntdStyle(extractStaticStyle.cache, { styleKeys });
// inject `html` into <head>; `uncovered` names components that fell back inline —
// add them to `extraIncluded` (or the registry) so their rules ship statically.
```

Component css-var blocks always stay inline (their values are the light-theme truth for the render); only `style` rules move to the stylesheet. A missed probe is never fatal — its rules fall back inline.

## Probe selection

`included: 'auto'` (default) scans the project source for antd imports and expands them through the probe registry; any `@lobehub/ui` import additionally unions `lobeUiAntdBaseline` — the antd components lobe-ui internals can render, kept in sync with the source tree by `baseline.test.ts`. Detection is by import source, never by component name, so a Base UI `Modal` from `@lobehub/ui` does not pull antd modal rules.

```ts
lobeStaticCssPlugin({
  antd: {
    extraIncluded: ['table'], // dynamically rendered, invisible to the scanner
    theme: myAntdTheme, // must equal the SSR ConfigProvider theme
  },
  themeVars: {
    appearanceSelector: (a) => `html[data-theme='${a}']`, // default
  },
});
```

Over-inclusion is harmless (a few KB in one cached file); under-inclusion self-heals via the inline fallback and is reported in `uncovered` / `failedProbes` / `unmatchedComponents` as data, never as console noise.

## Non-Vite build (Next.js etc.)

```ts
// dedicated script — the emit entry forces NODE_ENV=production before React/antd load,
// so import it before anything that imports them
import { emitStaticCssAssets } from '@lobehub/ui/static-css/emit';

await emitStaticCssAssets({ outDir: 'public' });
// writes public/antd.css, public/theme-vars.css, public/static-css.manifest.json
```
