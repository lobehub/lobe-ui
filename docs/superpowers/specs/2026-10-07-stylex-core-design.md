# StyleX for lobe-ui component styles — core + pilot (PR-5)

Date: 2026-10-07
Stacks on: #700 (`feat/drop-antd-deps`) → #699 → #698 → #697 → #695 → #683 → #682
Branch: `feat/stylex-core`
Follows: `2026-10-07-drop-antd-next-major-design.md` §6 (StyleX coexistence constraints)

## Goal

lobe-ui's own component styles move from the emotion-backed `createStaticStyles` to StyleX, compiled at lobe-ui build time into one shipped stylesheet. Consumers never run the StyleX compiler.

The migration is two stages:

- **A (this spec, PR-5):** the toolchain (build, docs, tests, lint), the shared StyleX modules, the authoring conventions, and a pilot of 7 style modules chosen to cover every hard pattern once.
- **B (after A is merged):** the remaining ~159 style modules, split into stacked PRs by area. Each B PR follows the conventions fixed here and gets its own pixel diff.

Success for A: pilot components render pixel-identical to #700 in light and dark; tsc / lint / tests green; `es/style.css` is the only CSS the pilot needs, all inside `@layer lobe-ui`; pilot modules no longer import emotion.

## Unchanged

- Theming: `theme.css` / `global.css`, `data-theme` / `data-primary-color` / `data-neutral-color`, `ThemeScope`, the theme hooks. StyleX `createTheme` is not used (it can only scope by class, not by `[data-*]`).
- The public emotion API (`createStaticStyles`, `cssVar`, `cx`, `css`, `keyframes`, `responsive`, `lobeStaticStylish`, `focusRing`) stays for downstream. Only lobe-ui internals move off it.
- docs-kit's own styles (13 files) stay on the emotion API.
- Public component props: `className`, `style`, `classNames` / `styles` slot props keep their shape.

## Research basis (checked 2026-10-07)

- `@stylexjs/stylex` 0.19.1 (2026-09-15). Still 0.x.
- `@stylexjs/unplugin` 0.19.1 has a `/rolldown` adapter. Verified with tsdown 0.23 `unbundle: true`: per-file `.mjs` with class names inlined, plus a single collected CSS asset. Statically resolvable `stylex.props` calls compile away; runtime merges keep `@stylexjs/stylex` (+ `styleq`) as a runtime dependency.
- Shipping precompiled StyleX is not an official pattern (maintainers prefer publishing source). Known precedent: `@defisaver/ui`. We accept this; the risk is ours, mitigated by the build-output checks below.
- `useCSSLayers: { prefix: 'lobe-ui' }` emits `@layer lobe-ui.priority1…N`, i.e. everything nests under `lobe-ui`, which satisfies drop-antd spec §6.2 (unlayered consumer CSS wins).
- `defineConsts` values are inlined at compile time and emit no CSS. Verified: `cssVar.colorText` with value `'var(--lobe-color-text)'` compiles to `.x…{color:var(--lobe-color-text)}`.
- Not supported by StyleX: arbitrary nested selectors (`&:hover .child`, `${cls} &`). Replacements: `stylex.when.*` + markers (0.16/0.17, attribute args 0.18), or moving the style onto the child.
- vitest: the unplugin's vite adapter leaks a timer (facebook/stylex#1836, ~10 s hang on exit). Fix merged in #1846, unreleased as of 2026-10-07.

## 1. Files

```
src/styles/stylex/
  cssVar.stylex.ts   # defineConsts: camelCase LobeToken keys → 'var(--lobe-…)'. Generated.
  media.stylex.ts    # defineConsts: the `responsive` breakpoints (xs…xxl, mobile, tablet, laptop, desktop) as media query strings
  focusRing.ts       # StyleX twin of base-ui/focusRing (keyframes declared in this file)
  stylish.ts         # StyleX twins of the lobeStaticStylish mixins the pilot uses; B adds the rest on demand
  props.ts           # styleProps(styles, className?, style?)
scripts/
  buildStylexVars.ts # writes cssVar.stylex.ts from Object.keys(createLobeToken(...)) with the same kebab rule as theme.css
```

- `cssVar.stylex.ts` is generated and committed. A test asserts it matches the generator output, so a new token cannot be missing from it.
- Key names are identical to the emotion `cssVar`, so migrating a value is `${cssVar.x}` → `cssVar.x`.
- `.stylex.ts` files contain only `defineConsts` exports (StyleX requirement).

`styleProps`:

```ts
export const styleProps = (
  styles: stylex.StyleXStyles | stylex.StyleXStyles[],
  className?: string,
  style?: CSSProperties,
) => {
  const p = stylex.props(styles);
  return {
    className: clsx(p.className, className),
    style: p.style || style ? { ...p.style, ...style } : undefined,
  };
};
```

`clsx` is already a dependency. Consumer `className` / `style` are applied after StyleX's, and consumer CSS wins by being unlayered.

## 2. Toolchain

| Where                     | Change                                                                                                                                                                          |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsdown.config.ts`        | `@stylexjs/unplugin/rolldown` with `useCSSLayers: { prefix: 'lobe-ui' }`, `classNamePrefix: 'lb'`, `unstable_moduleResolution` for `.stylex.ts` imports. Output `es/style.css`. |
| `package.json`            | `@stylexjs/stylex` → dependencies; `@stylexjs/unplugin`, `@stylexjs/eslint-plugin` → devDependencies; export `"./style.css": "./es/style.css"`; `sideEffects` keeps `*.css`.    |
| docs-kit `vite.config.ts` | `stylex.vite()` with the same options, so the docs site (which aliases `@lobehub/ui` to `src`) compiles source.                                                                 |
| `vitest.config.ts`        | same vite plugin. If the #1836 exit hang hurts CI before a release ships, pin `@stylexjs/unplugin` to the commit containing #1846.                                              |
| eslint                    | `@stylexjs/eslint-plugin` rules `valid-styles`, `sort-keys`, `valid-shorthands`, `no-unused` on `src/**/style*.ts` and `src/styles/stylex/**`.                                  |
| stylelint                 | the `.css` files from §4.                                                                                                                                                       |

`es/style.css` is exported separately; consumers add `import '@lobehub/ui/style.css'` next to `theme.css`. README, docs `index.mdx` and the migration notes say so.

### Plain CSS for markup lobe-ui doesn't render

Components import a sibling `.css` file (`import './global.css'`). Its rules are wrapped in `@layer lobe-ui { … }` and scoped by a stable `lobe-*` class or `data-*` attribute. The build must merge these into the same `es/style.css`.

First task of the implementation: verify that tsdown `unbundle` merges imported `.css` into the asset the StyleX plugin appends to. If it does not, the `.css` files are concatenated into `es/style.css` by `scripts/buildThemeCss.ts` instead, and the side-effect imports are dropped from the emitted JS.

## 3. Authoring conventions

| emotion pattern                                                                  | StyleX                                                                                                             |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `${cssVar.colorText}`                                                            | `cssVar.colorText`                                                                                                 |
| `${responsive.mobile} { … }`                                                     | `[media.mobile]: …` per property                                                                                   |
| `cva(styles.root, { variants })`                                                 | `styleProps([styles.root, styles[size], round && styles.round], className, style)`; `cva` removed from the module  |
| `compoundVariants`                                                               | an explicit condition in the array (`variant === 'filled' && danger && styles.filledDanger`)                       |
| `&& { … }` specificity bumps                                                     | removed; later entries in the array win                                                                            |
| `isDarkMode` cva variant                                                         | `useThemeMode()` + conditional style entry (unchanged runtime behaviour)                                           |
| `&:hover`, `&::before`, `&[data-open]`, `&[aria-pressed='true']`, `&:has(> svg)` | property-level conditions: `{ default: …, ':hover': …, ':is([data-open])': … }`, pseudo-elements as top-level keys |
| `span { … }` / `& > svg { … }` on children lobe-ui renders                       | the style moves onto the child element                                                                             |
| `&:hover .child`, `&[data-x] .child`                                             | `stylex.when.ancestor(':hover')` on the child + `stylex.defaultMarker()` on the parent                             |
| `keyframes`                                                                      | `stylex.keyframes` in the same file that uses it                                                                   |
| shared mixin (`lobeStaticStylish.x`, `focusRing`)                                | import the StyleX style from `src/styles/stylex/` and put it in the props array                                    |
| component CSS variables (`--lobe-tooltip-*`)                                     | kept as is: declared as properties in `stylex.create` (`'--lobe-tooltip-bg': …`) and read with `var()`             |
| `prefers-reduced-motion`, `forced-colors`                                        | `'@media (prefers-reduced-motion: reduce)'` conditions                                                             |
| markup lobe-ui doesn't render (KaTeX, shiki, markdown HTML, third-party DOM)     | plain `.css` (§2)                                                                                                  |

Slots: `styleProps([styles.popup, …], classNames?.popup, customStyles?.popup)`. base-ui function `className={(state) => …}` keeps working because `styleProps` returns a string.

## 4. Pilot

| Module                             | Covers                                                                         |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `base-ui/Divider`                  | smallest case, end-to-end wiring                                               |
| `base-ui/Tag`                      | size/variant maps, `lobeStaticStylish` mixins, `&&` bump, `span {}` child rule |
| `base-ui/Spin`                     | `keyframes`, reduced motion                                                    |
| `base-ui/Switch`                   | `[data-checked]` / `[data-disabled]` self states, ancestor state → thumb       |
| `base-ui/Tooltip`                  | heavy `[data-*]` states, `& > svg`, component CSS variables, popup slots       |
| `base-ui/Button` (+ `SplitButton`) | `[aria-*]`, `focusRing`, `compoundVariants`, `:has(> :where(button, a):hover)` |
| `base-ui/ScrollArea/globalStyle`   | the only `injectGlobal`; proves the plain `.css` path                          |

Each pilot module is fully migrated: no emotion import left in it or its component.

## 5. Verification

1. `pnpm type-check` (lib + site), `pnpm lint:circular`, eslint / stylelint on changed files, `pnpm vitest run src`.
2. Build output: `pnpm build`, then assert
   - `es/style.css` exists, every rule is inside `@layer lobe-ui…`, it contains the `.css`-path rules from ScrollArea;
   - no pilot module's `es/**` file imports `@emotion/css` or `@/styles/css`;
   - class names carry the `lb` prefix.
3. Pixel diff with the existing playwright harness (memory: `next-major-drop-antd-stack`): every demo, light and dark, #700 vs this branch. Pilot demos must be identical; non-pilot demos must be identical too (they still use emotion and must not be affected by the added layer).
4. A consumer smoke check: pack the tarball, install into a scratch Vite app with `theme.css` + `style.css`, render Button / Tooltip / Tag, confirm styles apply without the StyleX compiler.

## 6. Stage B outline (not part of PR-5)

Stacked PRs in this order, each with a pixel diff and the conventions in §3:

1. remaining `src/base-ui/*`
2. root components
3. `chat`, `mdx`, `mobile`, `awesome`, `dashboard`, `brand`, `color`, `icons`, `storybook`
4. third-party markup: `Markdown`, `Highlighter`, `Mermaid`, `CodeEditor`, `HtmlPreview` (mostly plain `.css`)
5. cleanup: delete internal-only emotion helpers, remove `extractStaticStyle` from lobe-ui SSR guidance if nothing internal needs it

## Out of scope

- docs-kit styles.
- Downstream migration to StyleX (downstream keeps the emotion API).
- StyleX `createTheme` / `defineVars`.
- The `sx={}` JSX prop.
