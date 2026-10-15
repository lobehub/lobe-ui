# Lobe Token Engine (antd-free design tokens)

Date: 2026-10-07
Branch base: `feat/motion-13` (next-major baseline)

## Context

The next major of `@lobehub/ui` removes `antd` entirely. Removal is split into four sub-projects:

1. **Token engine** (this spec): lobe-ui produces the full design token set itself.
2. CSS variable emission (`--lobe-*`) + ThemeProvider without antd `ConfigProvider` / `App`.
3. Replace `antd-style` (`createStyles` / `createStaticStyles` / `cssVar` / `useTheme`); it imports `antd` at runtime.
4. Delete remaining antd-based components in lobe-ui; finish downstream cleanup.

Decisions already made:

- Token **key names stay antd's** (`colorText`, `colorFillSecondary`, …) so consumer code keeps working.
- CSS variable prefix becomes `--lobe-*` (sub-project 2, not here).
- Non-color tokens are a **snapshot**, not a port of antd's seed→map algorithm. No consumer overrides seed tokens (lobe-chat only passes `theme={{ cssVar: { key } }}`); only `customTheme.primaryColor` / `neutralColor` are customised, and their derivation is already ours.

## What antd provides today

`createLobeAntdTheme` → antd `algorithm` (`lightAlgorithm` / `darkAlgorithm`) spreads antd's `mapToken`, then lobe colors. antd then:

- supplies all non-color map tokens (sizes, font sizes, line heights, motion, zIndex, screens) from its default algorithm applied to lobe seeds (`borderRadius: 8`, `controlHeight: 36`, fonts in `token/base.ts`);
- runs `formatToken` (`antd/es/theme/util/alias.js`) to derive alias tokens: color ones (`colorTextPlaceholder`, `colorSplit`, `colorIcon`, `colorBgTextHover`, `controlItemBg*`, `colorErrorOutline`, …) and non-color ones (`padding*`, `margin*`, `screen*Min/Max`, `boxShadow*`);
- overrides `boxShadow*` after the algorithm, which is why `token/shadow.ts` is passed via `ThemeConfig.token`.

antd-style then adds `generateCustomToken` output (`colorBgContainerSecondary`, preset palette steps).

## Design

### Files

```
src/styles/theme/
  createLobeToken.ts       new — public entry
  createLobeToken.test.ts  new — parity snapshot test
  token/static.ts          new — `static` group: snapshot of non-color tokens
  token/palette.ts         new — `palette` group (status colors, links, lobe custom steps)
  token/primary.ts         new — `primary` group incl. its aliases
  token/neutral.ts         new — `neutral` group incl. its aliases
  token/legacy.ts          new — antd-only values that vary only by appearance, frozen (pink*, colorBgSolid*, colorShadow, derived shadows)
  token/base.ts            keep (fonts, radius, controlHeight seeds) — drop antd types
  token/light.ts, dark.ts  deleted — status scales moved into token/palette.ts
  token/shadow.ts          keep — drop antd types
  generateColorPalette.ts  keep — drop antd types
  customToken.ts           keep — drop antd types
  antdTheme.ts             rewired (see Transition)
  algorithms/              deleted
```

No file under `src/styles/theme/` imports from `antd` after this change, except `antdTheme.ts`, whose job is adapting to antd.

### API

```ts
interface CreateLobeTokenParams {
  appearance: 'light' | 'dark';
  neutralColor?: NeutralColors;
  primaryColor?: PrimaryColors;
}

declare const createLobeToken: (params: CreateLobeTokenParams) => LobeToken;
```

`LobeToken` is composed from the types of the objects above (static + color + alias + custom); it does not reference antd types. Exported from `@lobehub/ui` alongside the existing `lobeCustomToken` etc.

### Merge order

Resolved values must equal what antd's current order produces (the group functions in "StyleX readiness" reproduce this; the list is the reference semantics):

1. `static` (non-color snapshot)
2. appearance base colors (`token/light.ts` / `token/dark.ts`)
3. primary palette override (`generateColorPalette`, when `primaryColor` set)
4. neutral palette override (`generateColorNeutralPalette`, when `neutralColor` set)
5. lobe custom color steps (`generateCustomColorToken`)
6. color alias derivation (antd `formatToken` color part) — computed from the merged result of 1–5
7. shadows (`token/shadow.ts[appearance]`)
8. `colorBgContainerSecondary` (from `generateCustomToken`)

Step 6 must run after 3–4: e.g. `colorTextPlaceholder` follows the overridden neutral `colorTextQuaternary`.

### Scope of keys

- Keep all camelCase keys antd emits today (276) plus lobe custom tokens.
- Drop antd's kebab palette keys (`blue-1`, …). camelCase `blue1`… are already overwritten by lobe custom steps.
- Drop component-level tokens (antd `components.*`); they only configure antd components.

### Static snapshot

`token/static.ts` is a plain literal generated once from `theme.getDesignToken(createLobeAntdTheme(...))` (current code, light appearance), keeping only keys whose values are not colors and not appearance-dependent. Values reflect lobe seeds, not antd defaults (`controlHeightSM`, `borderRadiusOuter`, `fontHeight`, … derive from seeds). The generator is a throwaway script run once; not committed.

## StyleX readiness

This project does not migrate to StyleX, but the token output must be consumable by a later StyleX migration without reshaping. StyleX constraints that drive this (stylexjs.com docs, checked 2026-10-07):

- `defineVars` lives in `.stylex.ts` files, which may only export `defineVars` results; values must be compile-time static (no calls into `generateColorPalette` etc.).
- Keys starting with `--` keep their exact CSS variable name (`'--lobe-color-text'`), so the `--lobe-*` names from sub-project 2 can be the same variables StyleX later declares. Runtime-emitted vars and StyleX vars coexist during migration.
- `createTheme(vars, overrides)` overrides a fixed var group and is applied as a class. Runtime choice of primary (12) and neutral (5) colors maps to pre-built themes, which only compose if primary-driven and neutral-driven keys live in separate var groups.

Requirements this adds to the engine:

1. **Tokens are partitioned into groups by what drives them.** Each key belongs to exactly one group:

   | Group     | Varies by            | Examples                                                                                                                                                              |
   | --------- | -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
   | `static`  | nothing              | `fontSize`, `padding*`, `borderRadius*`, `motion*`, `zIndex*`                                                                                                         |
   | `palette` | appearance           | `boxShadow*`, `token/legacy.ts`, lobe custom steps `blue1`…, `geekblue10`, `colorSuccess*`, `colorError*`, `colorLink*`                                               |
   | `primary` | appearance × primary | `colorPrimary*`, aliases derived from primary (`controlItemBgActive`, …)                                                                                              |
   | `neutral` | appearance × neutral | `colorText*`, `colorBg*`, `colorFill*`, `colorBorder*`, aliases derived from them (`colorTextPlaceholder`, `colorSplit`, `colorIcon`, `colorBgContainerSecondary`, …) |

   Implemented as one function per group under `token/`; `createLobeToken` is their merge. Alias derivation moves into the group of its inputs, so the merge-order section above describes the resolved values, not a separate pass. If the parity run finds a key driven by both primary and neutral, stop and decide its placement explicitly.

2. **Every variant of a group has an identical key set** (all 12 primaries produce the same `primary` keys; all 5 neutrals the same `neutral` keys; light and dark the same keys everywhere). Required for `createTheme`.
3. **Values are flat JSON scalars** (string or number). No nested objects, no functions, no `undefined`. A later codegen script can serialize any group straight into a `.stylex.ts` literal. That script is not written in this project.
4. **Keys are camelCase identifiers** (already true after dropping kebab palette keys), so they map 1:1 to StyleX keys and, via one kebab rule in sub-project 2, to `--lobe-*` names.

Enforced by tests (in `createLobeToken.test.ts`):

- grouping: for each primary variant, the keys that differ from default ⊆ `primary` group; for each neutral variant ⊆ `neutral`; light vs dark differences ⊆ non-`static` groups;
- groups are disjoint and their union equals `createLobeToken` output;
- identical key sets across variants of each group;
- every value is a string or finite number.

## Parity test

Guarantees "UI stays basically identical" and survives antd removal.

1. **Commit 1** — `createLobeToken.test.ts` records vitest snapshots from the _current_ antd path: `theme.getDesignToken(createLobeAntdTheme(params))` merged with `lobeCustomToken`, filtered to the key scope above.
   - Cases: `light` / `dark` × { default, each of 12 primary colors, each of 5 neutral colors } = 36.
   - Default cases snapshot the full token; color cases snapshot only keys that differ from that appearance's default (keeps the snapshot file small).
2. **Commit 2** — the test subject switches to `createLobeToken(params)`. The snapshot file must be byte-identical; any diff is a parity bug, fixed in the engine, never by `test:update`.

## Transition wiring

- `createLobeAntdTheme` passes `createLobeToken(...)` both as `token` and through a one-line algorithm `(_, map) => ({ ...map, ...token })`. antd strips seed keys (`colorPrimary`, `colorError`, …) from `token` overrides and `darkAlgorithm` rewrites them, so the overlay is required for dark mode parity. antd-style still prepends antd's default/dark algorithm.
- `ThemeProvider` keeps merging the consumer `theme` prop on top.
- `generateCustomToken` keeps producing `colorBgContainerSecondary` for antd-style until sub-project 3.
- `components.*.activeBorderColor/hoverBorderColor` referenced `baseToken.colorBorder`, which never existed (always `undefined`). Kept as `undefined` so antd output is unchanged.
- No CSS variable changes (sub-project 2).

## Implementation results (2026-10-07)

- `controlOutline` dropped: it is `getAlphaColor(colorPrimaryBg, colorBgContainer)`, so it depends on primary × neutral; 0 usages in lobe-ui, lobe-chat, lobehub-cloud, lobe-editor/tts/icons/charts. antd still computes it internally for its own components.
- Parity: `createLobeToken` output equals the pre-refactor antd snapshot for all 36 variants (only `controlOutline` lines removed). The full antd runtime output after rewiring (733 keys × 36 variants, incl. antd-only keys) is identical to before the refactor.
- Group split: 110 static keys, 35 frozen legacy keys per appearance; no key varies by both primary and neutral besides `controlOutline`.

## Out of scope

- `--lobe-*` CSS variable emission and the `StreamdownProfilerPanel` vars that depend on it (sub-project 2).
- antd-style replacement (3).
- base-ui exporting menu item types (`MenuInfo` / `MenuItemType`) for lobe-editor (4).
- Seed-driven recomputation (changing `fontSize` and having derived tokens follow). Add when a consumer needs it.
- StyleX itself: no `@stylexjs/*` dependency, no `.stylex.ts` files, no codegen script. This project only guarantees the token shape is ready for them.
