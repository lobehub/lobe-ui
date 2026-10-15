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
  styles: stylex.StyleXArray<
    | stylex.CompiledStyles
    | boolean
    | null
    | undefined
    | Readonly<[stylex.CompiledStyles, stylex.InlineStyles]>
  >,
  className?: string,
  style?: CSSProperties,
): { className: string; style: CSSProperties | undefined } => {
  const p = stylex.props(styles);
  return {
    className: clsx(p.className, className),
    style: p.style || style ? { ...p.style, ...style } : undefined,
  };
};
```

`styles` is anything `stylex.props` accepts: a style, a nested `StyleXArray` with `false` / `null` / `undefined` holes, and markers (`stylex.defineMarker()` values), so a root can take its marker in the same array. `clsx` is already a dependency. Consumer `className` / `style` are applied after StyleX's, and consumer CSS wins by being unlayered.

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

Rules the pilot settled on:

- **`stylex.props` vs `styleProps`.** Use `styleProps` only on an element that merges a consumer `className` / `style` (root or a slot from `classNames` / `styles`). Every other internal element spreads `stylex.props(...)` directly (Spin glyphs, Tooltip arrow, Button spinner).
- **Size variants.** A module-level map from the size prop to a style, indexed in the array: `const rootSizeStyles = { default: styles.rootDefault, small: styles.rootSmall }` → `rootSizeStyles[size]` (Switch, Tag `roundSizeStyles`). Tag's `styles[size]` (keys named after the size) is the same idea for a single sized slot. Button's `resolveSizeCls` predates this rule; don't copy it.
- **Parent → child style injection.** When a wrapper renders another lobe-ui component and must restyle it, split the child into an internal `*Impl` component with an `xstyle?: Parameters<typeof styleProps>[0]` prop that is appended last to its root array (it wins over the child's own entries). SplitButton passes its item styles to `ButtonImpl` this way; ActionIcon → Button follows the same pattern. `xstyle` is internal, never on the public props type.
- **Ancestor state.** Use a component-specific `stylex.defineMarker()` exported from a `marker.stylex.ts` next to the component (Switch `switchMarker`), put it in the parent's props array and target it with `stylex.when.ancestor('[data-checked]', switchMarker)`. Don't use `stylex.defaultMarker()`: it matches any other component's default marker in the tree.
- **Sibling `style.css`.** Rules for markup the component doesn't render (consumer children, third-party DOM) go in a sibling `style.css` imported from the component, wrapped in `@layer lobe-ui { … }` and scoped by a stable `lobe-<component>` class on the root (Tag, Switch, Tooltip, ScrollArea `global.css`).

### Cascade

- Layer order is `@layer lobe-base, lobe-popup, lobe-ui;`, declared as the first statement of `theme.css`, `global.css` and `es/style.css`. `lobe-base` holds opt-in document resets and `:where()` helpers, `lobe-popup` the popup trigger highlight; both lose to component styles.
- StyleX output sits in `lobe-ui.priority1…N`. Its priority-0 rules (keyframes, custom-property rules) are moved into `lobe-ui.priority1` by the lightningcss visitor in `config/stylex.ts`.
- Sibling `style.css` rules sit directly in `lobe-ui` (not a sublayer), so they beat every StyleX sublayer. Use them to override StyleX output on consumer markup, not to restyle what StyleX already styles.
- Consumer CSS: unlayered wins; resets must live in a layer declared before `lobe-base`.

### StyleX 0.19.1 gotchas

- `background` and `animation` shorthands compile to nothing, silently. Write longhands (`backgroundColor`, `backgroundImage`, `animationName`, `animationDuration`, `animationIterationCount`, `animationTimingFunction`). Write `border` as `borderWidth` / `borderStyle` / `borderColor`. `transition`, `outline`, `inset`, `insetBlock` and `margin` survive. eslint `no-restricted-syntax` flags `background` / `animation` / `border` keys inside `stylex.create` in style files.
- A longhand beats its shorthand by priority regardless of array order: override a longhand with the same longhand.
- When several conditions of one property can match at once, the emitted order follows neither the source nor the key order (`@stylexjs/sort-keys` reorders keys). Make overlapping conditions mutually exclusive with `:not()` (`':is([data-layout]):not([data-instant])'`).
- `transition: none` → `transitionProperty: 'none'`, `transitionDuration: '0s'`, `transitionTimingFunction: 'ease'`.
- `stylex.when.*` must be an inline computed key inside `stylex.create`; hoisting the call to a module-level const throws at runtime. Plain string consts as keys are fine. No default parameter values in dynamic-style arrow functions.
- `@stylexjs/valid-styles` rejects object values under non-allowlisted pseudo keys: flatten into compound keys (`':is([data-checked]):hover:not([data-disabled])'`) or hoist `@media` outside.
- Component custom properties (`--lobe-tooltip-*`) may be declared inside `stylex.create`; they land in `lobe-ui.priority1`.
- StyleX CSS passes through lightningcss with the project browserslist (vendor prefixes added) except `:dir()` and logical-property lowering, which are excluded. Check `es/style.css` for anything else lightningcss rewrites.
- Shared mixins live in `src/styles/stylex/` (`focusRing.info`, `stylish.ts`).

### Verifying a migration

- vitest runs StyleX with `runtimeInjection: true`, so `getComputedStyle` assertions work in tests.
- Dark mode: open the demo at `/~demos/<id>?appearance=dark`, or use playwright `colorScheme: 'dark'`. Setting `data-theme` on `<html>` alone does not switch the docs page; confirm the computed background actually changed.
- `pnpm build` runs `scripts/checkStylexBuild.ts`, which fails on CSS outside `@layer lobe-ui`, unprefixed class names, `.css` imports left in `es/**`, or emotion imports in migrated modules (add the module to its `migrated` list).

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

## Implementation notes (deviations from this spec)

- **Component `.css` via a tsdown plugin, not native merging.** tsdown `unbundle` does not merge imported `.css` into the StyleX asset. The `lobe-ui:component-css` plugin in `tsdown.config.ts` resolves each `.css` import (`this.resolve`, so package CSS works), drops the import from the emitted JS, and emits `es/style.css` = layer order + every collected file; StyleX then appends its CSS to that asset. `config/componentCss.ts` parses each file with lightningcss, wraps top-level rules not already in `@layer lobe-ui…` into `@layer lobe-ui`, and applies the same targets / `exclude` as the StyleX output.
- **lightningcss visitor for layering.** `processStylexRules` leaves priority-0 rules unlayered; the `layerStylexBase` visitor in `config/stylex.ts` moves them into `lobe-ui.priority1`, in both the lib build and docs.
- **lightningcss lowering.** Default browserslist targets stay (vendor prefixes), with `exclude` = `DirSelector | LogicalProperties` so `:dir()` and logical properties are not lowered to `:lang()` / physical fallbacks.
- **Layer reorder and docs reset.** The original `lobe-ui` first declaration let `lobe-popup` (trigger highlight) override StyleX Button backgrounds. The order is now `lobe-base, lobe-popup, lobe-ui` everywhere; `global.css` resets moved into `lobe-base`. docs-kit's element resets moved into `@layer docs-reset`, declared first (`docs-reset, lobe-base, lobe-popup, lobe-ui`) in `site/root.tsx` and the build stub `site/styles/stylex.css`; the docs build appends StyleX CSS to the `root-*.css` asset (`cssInjectionTarget`) so every route links it.
- **Sibling CSS beyond ScrollArea.** Switch (`:dir(rtl)` direction variable), Tag (`span` child reset) and Tooltip (viewport crossfade on base-ui-rendered children) each ship a sibling `style.css`.
- **vitest `runtimeInjection: true`**, so computed-style tests keep working without emotion.

## Out of scope

- docs-kit styles.
- Downstream migration to StyleX (downstream keeps the emotion API).
- StyleX `createTheme` / `defineVars`.
- The `sx={}` JSX prop.
